const { end } = require("../clientMEN85");
const {
  getCustomersWithName,
  getCustomerWithId,
  updateCustomerRemise,
  getVarremiseCustomerWithId,
} = require("../models/editRemiseModel");
const {
  sqlToWinProText,
  updateRemiseWinPro,
  winProTextToSql,
} = require("../utils/translate");
const {
  fetchFamiliesDiscountData,
} = require("./familleRemiseController");

const fetchCustomersWithName = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        error: "Veuillez entrer un nom.",
      });
    }

    const customers = await getCustomersWithName(search);
    res.status(200).json(customers);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des clients (dans le controleur):",
      error
    );
    res.status(500).json({
      error: "Une erreur est survenue en essayant de récupérer les clients.",
    });
  }
};

const fetchCustomerWithId = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "Il manque l'identifiant du client",
      });
    }
    const customer = await getCustomerWithId(id);
    if (!customer || (Array.isArray(customer) && customer.length === 0)) {
      return res
        .status(400)
        .json({ error: `Aucun client trouvé avec l'id ${id}` });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du client (dans le controleur): ",
      error
    );
    res.status(500).json({
      error: "Une erreur est survenue en essayant de récupérer le client.",
    });
  }
};

const fetchClientRemisesWinPro = async (req, res) => {
   /**
   * Récupère le texte SQL compact, le traduit en langage WinPro lisible,
   * puis cherche dans le texte l'idRemise et sa valeur afin d'en faire un tableau
   * que le frontend pourra appelé
   *
   */
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Il manque l'identifiant du client" });
    }

    const texteCompacte = await getVarremiseCustomerWithId(id);
    if (!texteCompacte) {
      return res.status(404).json({ error: `Aucun texte de remise pour le client ${id}` });
    }

    const texteWinPro = sqlToWinProText(texteCompacte);

    // Découpe en lignes
    const lines = texteWinPro.split(/\r?\n/);

    const remises = [];
    let currentFamille = null;
    let skipFamille = false;

    const regexFamille = /^Sinon Si\s*\(familleremise\s*=\s*(\d+)\)$/;
    const noRemiseText = "MessagePas de remise accordée sur cette famille de produit";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      const famMatch = line.match(regexFamille);
      if (famMatch) {
        currentFamille = famMatch[1];
        skipFamille = false;
        continue;
      }

      if (currentFamille !== null) {
        if (line === noRemiseText) {
          skipFamille = true;
        } else if (!skipFamille && line.startsWith("_Remise")) {
          // Extrait la valeur, support formats _Remise:=50 or _Remise := 50
          const valMatch = line.match(/_Remise\s*:?\s*=?\s*(\d+)/);
          if (valMatch) {
            remises.push({ idRemise: currentFamille, valeur: valMatch[1] });
          }
          currentFamille = null; // Fin du bloc famille
        }
      }
    }

    if (remises.length === 0) {
      return res.status(200).json({ message: "Aucune remise trouvée pour ce client.", remises: [] });
    }

    return res.status(200).json(remises);

  } catch (error) {
    console.error("Erreur fetchClientRemisesWinPro:", error);
    return res.status(500).json({ error: "Impossible d'extraire les remises pour ce client." });
  }
};



const editCustomerRemise = async (req, res) => {
  /**
   * Met à jour une remise client selon la logique métier décrite.
   * - Si la famille remise existe déjà dans le texte SQL : modifie la valeur (code précédent).
   * - Si elle n'existe pas dans le texte SQL mais existe dans la liste des familles : ajoute le bloc avant Fin Si.
   * - Sinon : renvoie une erreur, aucune modification.
   */
  try {
    const { id } = req.params;
    const { idRemise, nouvelleRemise } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Il manque l'identifiant du client" });
    }

    const client = await getCustomerWithId(id);
    if (!client) {
      return res.status(400).json({ error: `Aucun client trouvé avec l'id ${id}` });
    }

    if (!idRemise) {
      return res.status(400).json({ error: "Il manque le numéro de la remise du client" });
    }

    if (!nouvelleRemise) {
      return res.status(400).json({ error: "Il manque la valeur de la nouvelle remise du client" });
    }

    const texteRemise = await getVarremiseCustomerWithId(id);
    if (texteRemise === null) {
      return res.status(404).json({ error: `Aucun client n'a été trouvé avec le code '${id}'` });
    }
// Recherche dans texteRemise si la famille a ce pattern exact
const regexBloc = new RegExp(`&0[0-9A-Z]\\(familleremise&1D${idRemise}\\)\\s*\\n&0FPas de remise accordée sur cette famille de produit`, 'm');

if (regexBloc.test(texteRemise)) {
  // Remplacement ciblé
  const replacement = `&02(familleremise&1D${idRemise})\n_!893&23${nouvelleRemise}`;
  const updatedTexte = texteRemise.replace(regexBloc, replacement);

  // Si rien n'a changé, répondre avec un message cohérent
  if (updatedTexte === texteRemise) {
    return res.status(200).json({
      message: `Aucune modification de remise n'a été appliquée pour la famille ${idRemise} du client ${id}.`
    });
  }

  // Mise à jour BDD direct car modification faite
  try {
    const sqlTexte = await winProTextToSql(updatedTexte);
    await updateCustomerRemise(id, sqlTexte);
    return res.status(200).json({
      message: `La remise ${idRemise} du client avec le code ${id} a bien été modifiée avec une remise de ${nouvelleRemise}%`,
    });
  } catch (err) {
    console.error("Erreur conversion ou mise à jour BDD:", err);
    return res.status(500).json({ error: "Erreur interne lors de la mise à jour." });
  }
}

    let winProTexte;
    try {
      winProTexte = sqlToWinProText(texteRemise);
    } catch (err) {
      console.error("Erreur sqlToWinProText:", err);
      throw new Error("Erreur dans sqlToWinProText");
    }

    const regexFamille = new RegExp(`\\(familleremise\\s*=\\s*${idRemise}\\)`, "m");
    const familleRemiseExiste = regexFamille.test(winProTexte);

    let familles = [];
    try {
      familles = await fetchFamiliesDiscountData();
    } catch (err) {
      console.error("Erreur fetchFamiliesDiscountData:", err);
      return res.status(500).json({ error: "Impossible de récupérer les familles de remise." });
    }

    const familleExistsInDB = familles.some(f => String(f.famille_remise) === String(idRemise));

    let updatedTexte;
    let texteAjouterOuModifie;

    if (familleRemiseExiste) {
      try {
        updatedTexte = updateRemiseWinPro(winProTexte, idRemise, nouvelleRemise);
        if (updatedTexte === winProTexte) {
          return res.status(200).json({
            message: `Aucune modification de remise n'a été appliquée pour la remise ${idRemise} du client ${id}.`
          });
        }
        texteAjouterOuModifie = "modifié";
      } catch (err) {
        console.error("Erreur updateRemiseWinPro:", err);
        return res.status(400).json({ error: err.message });
      }
    } else if (familleExistsInDB) {
      const texteNouvelleRemise = `&02(familleremise&1D${idRemise})\n_!893&23${nouvelleRemise}\n`;
      const posFinSi = winProTexte.lastIndexOf("Fin Si");

      if (posFinSi !== -1) {
        updatedTexte = winProTexte.slice(0, posFinSi).replace(/\s*$/, "\n") + texteNouvelleRemise + winProTexte.slice(posFinSi);
      } else {
        updatedTexte = winProTexte.replace(/\s*$/, "\n") + texteNouvelleRemise + "Fin Si";
      }

      if (updatedTexte === winProTexte) {
        return res.status(200).json({
          message: `Aucune modification d'ajout n'a été appliquée pour la remise ${idRemise} du client ${id}.`
        });
      }
      texteAjouterOuModifie = "ajouté";
    } else {
      return res.status(400).json({ error: `Le numéro de remise ${idRemise} n'existe pas` });
    }

    let sqlTexte;
    try {
      sqlTexte = winProTextToSql(updatedTexte);
    } catch (err) {
      console.error("Erreur winProTextToSql:", err);
      throw new Error("Erreur dans winProTextToSql");
    }

    await updateCustomerRemise(id, sqlTexte);

    // Message de succès uniquement si modif réelle
    res.status(200).json({
      message: `La remise ${idRemise} du client avec le code ${id} a bien été ${texteAjouterOuModifie} avec une remise de ${nouvelleRemise}%`,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la remise du client (dans le controleur): ", error);
    res.status(500).json({
      error: "Une erreur est survenue en essayant de mettre à jour la remise du client.",
    });
  }
};

module.exports = {
  fetchCustomersWithName,
  fetchCustomerWithId,
  editCustomerRemise,
  fetchClientRemisesWinPro
};
