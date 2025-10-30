const { bool } = require("sharp");
const {
  postFamilyDiscount,
  deleteFamilyDiscount,
  getFamilyDiscount,
  getFamiliesDiscount,
  updateFamilyDiscount,
} = require("../models/familleRemiseModel");

const addFamilyDiscount = async (req, res) => {
  try {
    const { name, famille_remise } = req.body;

    if (!name) {
      throw new Error("Il manque le nom de la famille");
    }
    if (!famille_remise) {
      throw new Error("Il manque le numero de la famille");
    }

    // Effectuer la requête d'insertion
    await postFamilyDiscount(name, famille_remise);

    // Succès
    res.status(200).json({
      message: `La famille ${name} a bien été ajoutée.`,
    });
  } catch (error) {
    //Affiche un message compréhensible pour un utilisateur lambda
    if (
      error.code === "ER_DUP_ENTRY" ||
      (error.message && error.message.includes("Duplicate entry"))
    ) {
      res.status(400).json({
        error: "Ce code famille de remise existe déjà. Veuillez en choisir un autre.",
      });
    } else {
      // Message générique pour les autres erreurs
      res.status(500).json({
        error: "Une erreur est survenue lors de l'ajout de la famille.",
      });
    }
  }
};


const removeFamilyDiscount = async (req, res) => {
  try {
    //On récupère le numéro de la famille de remise qui est dans l'URL
    const { famille_remise } = req.params;

    //On fait d'abord une recherche de la famille
    const resultat = await getFamilyDiscount(famille_remise);
    let est_supprimable = null;

    //Si la requête a bien fonctionné
    if (resultat[0]) {
        //On récupère le booléen est_supprimable
      est_supprimable = resultat[0].est_supprimable;
    } else {
        //Sinon, on affiche une erreur comme quoi la famille est introuvable
      throw new Error("Famille remise introuvable");
    }
    
    //Si l'utilisateur essaie de supprimé une famille qui a False pour est_supprimable, on lui envoie une erreur
    if (est_supprimable == 0) {
      throw new Error(
        "Les familles de remise de 1 à 5 ne sont pas supprimables"
      );
    }

    //On effectue la requête de suppression
    await deleteFamilyDiscount(famille_remise);

    //Message de succès
    return res.status(200).json({
      message: `La famille ${famille_remise} a bien été supprimée`,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la famille :",
      error.stack || error
    );
    //Si la requête a échoué, on recherche quelle erreur en est responsable pour afficher le code d'erreur correspondant
    const statusCode =
      error.message.includes("pas supprimables") ||
      error.message.includes("introuvable")
        ? 400
        : 500;

    //On envoie l'erreur à l'utilisateur
    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

const fetchFamiliesDiscount = async (req, res) => {
  try {
    //On récupère toutes les familles
    familles = await getFamiliesDiscount();
    ///Message de succès
    return res.status(200).json({
      familles: familles,
    });
  } catch (error) {
    //Message d'erreur
    res.status(500).json({
      error: `Une erreur est survenue lors de la recherches des familles ${error}`,
    });
  }
};

const fetchFamiliesDiscountData = async () => {
  return await getFamiliesDiscount(); // Retourne juste le tableau, pas de gestion Express
};
const editFamilyDiscount = async (req, res) => {
    try {
        //On récupère la famille_remise dans l'URL
        const { famille_remise } = req.params;

        //On récupère le name dans le body reçu
        const { name } = req.body;

        //S'il manque le code de famille, on envoie une erreur
        if(!famille_remise){
            throw new Error("Il manque le code de la famille de remise ou elle est introuvable");
        }


        //S'il manque le nom, on envoie une erreur
        if(!name){
            throw new Error("Il faut ajouter un nom pour la famille");
        }

        //Si le nom fait moins de 3 caractères, on envoie une erreur
        if(name.length < 3){
            throw new Error("Le nom doit faire au minimum 3 caractères");
        }

        //On execute la requête
        result = await updateFamilyDiscount(name, famille_remise);

        //Message de succès
        res.status(200).json({
      message:
        "La nom de la famille de remise " +
        famille_remise +
        " a été mis à jour"
    });
    }catch (error){
        //Message d'erreur
        res.status(500).json({
      error:
        "Une erreur est survenue en essayant de mettre à jour la famille de remise du client." + error,
    });
    }
}

const fetchFamilyDiscount = async (req, res) => {
    try {
        //On récupère la famille_remise dans l'URL
        const { famille_remise } = req.params;

        //On execute la requête
        const resultat = await getFamilyDiscount(famille_remise);

        //On envoie le résultat à l'utilisateur
        res.status(200).json({
      result: resultat
    });

    } catch (error) {
        //Message d'erreur
        res.status(500).json({
      error:
        "Une erreur est survenue en essayant de la récupération de la famille." + error,
    });
    }
}
module.exports = {
  addFamilyDiscount,
  removeFamilyDiscount,
  fetchFamiliesDiscount,
  editFamilyDiscount,
  fetchFamilyDiscount,
  fetchFamiliesDiscountData
};
