const db = require('../clientMEN85');

const getPSLorder = async (startDate, endDate) => {
    try {
        const query = `
            SELECT DISTINCT numero, client, nom, reference, DATE AS date_saisie, dlivraison AS date_livraison, etat
            FROM commande c
            LEFT JOIN det d ON d.commande = c.numero
            LEFT JOIN client cl ON cl.code = c.client
            WHERE d.CODE LIKE 'PSA%'
            AND d.question = 'Gamme de Porte' AND d.texte = 'Porte Laterale'
            AND dlivraison+0 >= ?
            AND dlivraison+0 <= ?
            ORDER BY dlivraison, nom
        `;
        const [rows] = await db.query(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        console.error('Error fetching PSL orders:', error);
        throw error;
    }
};

module.exports = {
    getPSLorder,
};
