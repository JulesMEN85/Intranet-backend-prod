const dbMEN85 = require('../../clientMEN85'); // Assurez-vous que le chemin est correct

const getPSProducts = async (startDate, endDate) => {
  const query = `
    SELECT DISTinct lin.commande, lin.type, lin.code, lin.descriptio, lin.temps, fen.systeme, fen.quantite, commande.dlivraison, det.question, det.texte
    FROM lin
    JOIN fen ON fen.commande = lin.commande AND lin.chassis = fen.chassis AND lin.typedoc = fen.typedoc 
    JOIN commande ON commande.numero = fen.commande
    JOIN det ON det.commande = lin.commande AND lin.chassis = det.chassis AND lin.typedoc = det.typedoc
    WHERE lin.type = '2'
      AND Lin.typedoc = 'X'
      AND commande.etat NOT IN (100, 200, 398)
      AND commande.dlivraison BETWEEN ? AND ?
      AND (
        (lin.code = 'MO_MEN_FINIT06' AND det.texte = 'Porte plafond')
        OR
        (lin.code = 'MO_MEN_FINIT06' AND det.texte = 'Porte Laterale')
      );
  `;

  try {
    const [rows] = await dbMEN85.execute(query, [startDate, endDate]);
    return rows;
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête :", error);
    throw error; // Vous pouvez choisir de gérer l'erreur différemment selon vos besoins
  }
};

module.exports = { getPSProducts };
