const dbMEN85 = require('../../clientMEN85'); // Connexion à la base MEN85

// 🟢 Récupération des commandes de volets PVC 28 et PVC 24
const getVoletProducts = async (startDate, endDate) => {
    try {
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
            AND lin.descriptio LIKE 'Poste Finition Volet PVC'
            AND commande.etat NOT IN (100, 200, 398)
            AND (f.systeme LIKE '%Volet PVC 28%' OR f.systeme LIKE '%Volet PVC 24%')
            AND commande.dlivraison BETWEEN ? AND ?;
        `;

        const [rows] = await dbMEN85.execute(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        console.error("❌ Erreur lors de l'exécution de la requête SQL :", error);
        throw error;
    }
};

module.exports = { getVoletProducts };
