const dbMEN85 = require('../../clientMEN85'); // Si le fichier est dans le dossier parent
const dbDashboard = require("../../clientDashboard"); 

const getPSPProducts = async (startDate, endDate) => {
  const query = `
    SELECT lin.commande, lin.type, lin.code, lin.descriptio, lin.temps, fen.systeme, fen.quantite, commande.dlivraison
    FROM lin
    JOIN fen ON fen.commande = lin.commande AND lin.chassis = fen.chassis AND lin.typedoc = fen.typedoc 
    JOIN commande ON commande.numero = fen.commande
    WHERE lin.type = '2'
      AND Lin.typedoc = 'X'
      AND lin.code = 'MO_MEN_FINIT05'
      AND dlivraison BETWEEN ? AND ?
      AND commande.etat NOT IN (100, 200, 398);
  `;

  const [rows] = await dbMEN85.execute(query, [startDate, endDate]);
  return rows;
};

const getPostesPersonnel = async (selectedWeek) => {
  try {
    console.log("🔍 Requête SQL pour la semaine :", selectedWeek); // Debug

    const query = `
      SELECT p.poste_code, b.NAME, b.lundi, b.mardi, b.mercredi, b.jeudi, b.vendredi, b.semaine
      FROM postes_personnel p
      JOIN base_personnel b ON b.personnel_id = p.personnel_id  -- ✅ Correction ici
      WHERE b.semaine = ?;
    `;

    const [rows] = await dbDashboard.execute(query, [selectedWeek]);

    console.log("✅ Résultats de la requête SQL :", rows); // Debug
    return rows;
  } catch (error) {
    console.error("❌ Erreur dans le modèle :", error);
    throw error;
  }
};

module.exports = { getPSPProducts, getPostesPersonnel};
