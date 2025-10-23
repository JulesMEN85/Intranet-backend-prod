const db = require('../clientMEN85');

const getPanelQuantity = async (startDate, endDate) => {
    try {
        /**
         * Récupère pour une date de début et une date de fin, 
         * la quantité de panneau utilisé pour le tableau achat
         * Filtre sur le code de la commande (uniquement les "C...")
         * Filtre sur l'etat de la commande (uniquement 400)
         * Filtre sur le code de l'article (seulement les articles en "A10...")
         * Filtre sur la date de début et de fin (choisies par l'utilisateur)
         *
         * @param {string} startDate - Date de début au format 'YYYY-MM-DD'.
         * @param {string} endDate - Date de fin au format 'YYYY-MM-DD'.
         * @returns {Array<Object>} Liste des articles récupérés :
         *   - code {string} : code de l'article.
         *   - descriptio {string} : description de l'article.
         *   - quantite {number} : quantité totale utilisée pour cet article sur la période et les filtres donnés.
         */

        const query = `
            SELECT
                code,
                descriptio as description,
                SUM(quantite) AS quantite
            FROM (
                SELECT DISTINCT
                    t1.commande,
                    t1.code,
                    t1.descriptio,
                    t1.quantite
                FROM lin t1
                INNER JOIN commande t2 ON t2.numero = t1.commande
                INNER JOIN clognav t3 ON t2.numero = t3.commande
                WHERE t2.numero LIKE 'C%'
                AND t3.statut = 400
                AND t1.code LIKE 'A10%'
                AND t3.date >= ?
                AND t3.date <= ?
            ) AS dedup -- Enleve les doublons si une commande est passé plusieurs fois par le meme état (400...)
            GROUP BY
                code,
                descriptio
            ORDER BY
                code ASC;
        `;
        const [rows] = await db.query(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        console.error('Erreur lors de la récupération des quantités de panneaux (dans le modèle):', error);
        throw error;
    }
};

module.exports = {
    getPanelQuantity,
};
