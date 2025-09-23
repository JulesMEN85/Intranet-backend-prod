const dbMEN85 = require('../../clientMEN85'); // Assurez-vous que le chemin est correct

const getPVC38Lines = async (startDate, endDate) => {
  const query = `
    SELECT lin.commande, lin.type, lin.code, lin.descriptio, lin.temps, 
           f.quantite, f.systeme, commande.dlivraison
    FROM lin
    JOIN (
        SELECT commande, MAX(quantite) AS quantite, 
               GROUP_CONCAT(DISTINCT systeme SEPARATOR ', ') AS systeme
        FROM fen
        GROUP BY commande
    ) AS f ON f.commande = lin.commande
    JOIN commande ON commande.numero = lin.commande
    WHERE lin.type = '2'
      AND lin.descriptio LIKE 'Poste Finition PVC38'
      AND commande.etat NOT IN (100, 200, 398)
      AND commande.dlivraison BETWEEN ? AND ?;
  `;

  try {
    const [rows] = await dbMEN85.execute(query, [startDate, endDate]);
    return rows;
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête :", error);
    throw error;
  }
};

module.exports = { getPVC38Lines };
