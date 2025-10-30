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

    // on récupere le texte compacté
    const texteCompacte = await getVarremiseCustomerWithId(id);
    if (!texteCompacte) {
      return res.status(404).json({ error: `Aucun texte de remise pour le client ${id}` });
    }

    // On traduit en texte WinPro lisible
    const texteWinPro = sqlToWinProText(texteCompacte);

    // On extrait toutes les remises du texte WinPro
    // On attend des blocs du type "Si (familleremise = x)\n_Remise := y"
    const regex = /Si\s*\(familleremise\s*=\s*(\d+)\)[\s\S]*?_Remise\s*:?\s*=?\s*(\d+)/g;
    const remises = [];
    let match;
    while ((match = regex.exec(texteWinPro)) !== null) {
      remises.push({ idRemise: match[1], valeur: match[2] });
    }
    // En cas de bloc unique ou mal formé, retourne au moins le résultat
    if (remises.length === 0) {
      return res.status(200).json({ message: "Aucune remise trouvée pour ce client.", remises: [] });
    }

    // On envoie le tableau au frontend
    res.status(200).json(remises);

  } catch (error) {
    console.error("Erreur fetchClientRemisesWinPro:", error);
    res.status(500).json({ error: "Impossible d'extraire les remises pour ce client." });
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
    //On récupère l'id du client qui est dans l'URL
    const { id } = req.params;

    //On récupère le numéro de la famille de remise et la valeur de la nouvelle remise à appliquer dans le body
    const { idRemise, nouvelleRemise } = req.body;

    //S'il n'y a pas d'identifiant du client, on envoie une erreur
    if (!id) {
      return res
        .status(400)
        .json({ error: "Il manque l'identifiant du client" });
    }

    //On vérifie que le client existe bien
    const client = await getCustomerWithId(id);
    if (!client) {
      return res
        .status(400)
        .json({ error: `Aucun client trouvé avec l'id ${id}` });
    }

    //S'il n'existe pas de numéro de famille de remise, on envoie une erreur
    if (!idRemise) {
      return res
        .status(400)
        .json({ error: "Il manque le numéro de la remise du client" });
    }

    //S'il n'y a pas de valeur de nouvelle remise, on envoie une erreur
    if (!nouvelleRemise) {
      return res
        .status(400)
        .json({ error: "Il manque la valeur de la nouvelle remise du client" });
    }

    // On récupère le texte SQL actuel en appelant la BDD
    const texteRemise = await getVarremiseCustomerWithId(id); 


    if (texteRemise === null) {
      // Si aucun texte trouvé, le client n'existe pas ou pas de donnée de remise
      return res
        .status(404)
        .json({ error: `Aucun client n'a été trouvé avec le code '${id}'` });
    }

    let winProTexte;

    try {
      // Conversion du texte SQL compact en texte WinPro lisible
      winProTexte = sqlToWinProText(texteRemise);
    } catch (err) {
      // En cas d'erreur dans la conversion, on envoie une erreur
      console.error("Erreur sqlToWinProText:", err);
      throw new Error("Erreur dans sqlToWinProText");
    }

    // Création d'une expression régulière pour détecter la famille de remise dans le texte WinPro
    const regexFamille = new RegExp(
      `\\(familleremise\\s*=\\s*${idRemise}\\)`,
      "m"
    );

    // Vérifie si la famille remise existe dans le texte WinPro
    const familleRemiseExiste = regexFamille.test(winProTexte);

    let familles = [];
    try {
      // Récupération des familles de remise connues (depuis un service ou contrôleur)
      familles = await fetchFamiliesDiscountData();
    } catch (err) {
      // Erreur lors de la récupération des familles 
      console.error("Erreur fetchFamiliesDiscountData:", err);
      return res
        .status(500)
        .json({ error: "Impossible de récupérer les familles de remise." });
    }

    // Vérifie si la famille remise demandée existe dans la DB des familles
    const familleExistsInDB = familles.some(
      (f) => String(f.famille_remise) === String(idRemise)
    );

    let updatedTexte;
    //Variable affichant si le texte a été ajouté ou bien modifié
    let texteAjouterOuModifie
    if (familleRemiseExiste) {
      // La famille remise est déjà dans le texte
      // On met le texte à jour normalement
      try {
        updatedTexte = updateRemiseWinPro(
          winProTexte,
          idRemise,
          nouvelleRemise
        );
        //Le texte est modifié
        texteAjouterOuModifie = "modifié"
      } catch (err) {
        // En cas d'erreur lors de la mise à jour, on retourne une erreur 400
        console.error("Erreur updateRemiseWinPro:", err);
        return res.status(400).json({ error: err.message });
      }
    } else if (familleExistsInDB) {
      //La famille n'existe pas dans le texte client mais existe dans la base données
      // On ajoute la nouvelle remise proprement après les autres remises
      const texteNouvelleRemise = `&02(familleremise&1D${idRemise})\n_!893&23${nouvelleRemise}\n`;

      // Trouve la position du 'Fin Si' pour insérer avant
      const posFinSi = winProTexte.lastIndexOf("Fin Si");

      if (posFinSi !== -1) {
        // Insertion propre avant 'Fin Si' avec nettoyage des espaces
        updatedTexte =
          winProTexte.slice(0, posFinSi).replace(/\s*$/, "\n") +
          texteNouvelleRemise +
          winProTexte.slice(posFinSi);
      } else {
        // Si pas de 'Fin Si', ajoute à la fin de façon propre
        updatedTexte =
          winProTexte.replace(/\s*$/, "\n") + texteNouvelleRemise + "Fin Si";
      }
      texteAjouterOuModifie = "ajouté"
    } else {
      // La famille remise n'existe ni dans le texte ni dans la base de donneés
      // On renvoie une erreur 400
      return res
        .status(400)
        .json({ error: `Le numéro de remise ${idRemise} n'existe pas` });
    }

    // Re-conversion du texte WinPro modifié en format SQL compact 
    let sqlTexte;
    try {
      sqlTexte = winProTextToSql(updatedTexte);
    } catch (err) {
      // Erreur lors de la reconversion en SQL, on log et stoppe
      console.error("Erreur winProTextToSql:", err);
      throw new Error("Erreur dans winProTextToSql");
    }

    // On met à jour la colonne Varremise du client avec le texte transformé
    await updateCustomerRemise(id, sqlTexte);

    // Message de succès
    res.status(200).json({
      message:
      `La remise ${idRemise} du client avec le code ${id} a bien été ${texteAjouterOuModifie} avec une remise de ${nouvelleRemise}%`,
    });
  } catch (error) {
    //Message d'erreur
    console.error(
      "Erreur lors de la mise à jour de la remise du client (dans le controleur): ",
      error
    );
    res.status(500).json({
      error:
        "Une erreur est survenue en essayant de mettre à jour la remise du client.",
    });
  }
};

module.exports = {
  fetchCustomersWithName,
  fetchCustomerWithId,
  editCustomerRemise,
  fetchClientRemisesWinPro
};
