const db = require('../clientMEN85');

const ArticleModel = {
    getArticles: async () => {
        const query = `
            SELECT DISTINCT 
            a.CODE AS Code_Article_MEN85,
            a.descriptio AS Description_MEN85,
            af.artfou AS Reference_fournisseur,
            a.codefou AS Code_fournisseur,
            f.nom AS Nom_fournisseur,
            (SELECT SUM(comfou.qtecdee)
            FROM comfou
            WHERE comfou.article = a.code) AS Commande_fournisseur,
            (SELECT SUM(rescli.qtecdee)
            FROM rescli
            WHERE rescli.article = a.code) AS Reservation_client,
            CASE
                WHEN a.horsstock = 0 THEN 'OUI'
                WHEN a.horsstock = 1 THEN 'NON'
            END AS Gere_en_stock,
            SUM(CASE
                WHEN s.local <> '' THEN s.qte
                ELSE 0
            END) AS Stock_courant,
            a.stkmin01 AS Stock_mini
        FROM article a
        LEFT JOIN fourn f ON a.codefou = f.code
        LEFT JOIN artfou af ON a.code = af.article AND a.codefou = af.codefou AND af.codefou = f.code 
        LEFT JOIN stock s ON a.code = s.article AND af.article = s.article
        WHERE a.categorie NOT IN ('FICTIF', 'TARIF')
        AND a.CODE NOT LIKE 'KQ%'
        AND a.CODE NOT LIKE 'FI%'
        AND a.CODE NOT LIKE 'ECOPAR%'
        AND a.CODE NOT LIKE '\\_%'
        GROUP BY a.code;

        `;

        try {
            const [rows] = await db.execute(query);
            return rows;
        } catch (err) {
            console.error('Error fetching articles:', err);
            throw err;
        }
    },

    // Nouvelle méthode pour filtrer par lettre
    getArticlesByLetters: async (letters, filters) => {
        let query = `
            SELECT DISTINCT 
                a.CODE AS Code_Article_MEN85,
                a.descriptio AS Description_MEN85,
                af.artfou AS Reference_fournisseur,
                a.codefou AS Code_fournisseur,
                f.nom AS Nom_fournisseur,
                (SELECT SUM(comfou.qtecdee)
                 FROM comfou
                 WHERE comfou.article = a.code) AS Commande_fournisseur,
                (SELECT SUM(rescli.qtecdee)
                 FROM rescli
                 WHERE rescli.article = a.code) AS Reservation_client,
                CASE
                    WHEN a.horsstock = 0 THEN 'OUI'
                    WHEN a.horsstock = 1 THEN 'NON'
                END AS Gere_en_stock,
                SUM(CASE
                    WHEN s.local <> '' THEN s.qte
                    ELSE 0
                END) AS Stock_courant,
                a.stkmin01 AS Stock_mini
            FROM article a
            LEFT JOIN fourn f ON a.codefou = f.code
            LEFT JOIN artfou af ON a.code = af.article AND a.codefou = af.codefou AND af.codefou = f.code
            LEFT JOIN stock s ON a.code = s.article AND af.article = s.article
            WHERE a.categorie NOT IN ('FICTIF', 'TARIF')
              AND a.CODE NOT LIKE 'KQ%'
              AND a.CODE NOT LIKE 'FI%'
              AND a.CODE NOT LIKE 'ECOPAR%'
              AND a.CODE NOT LIKE '\\_%'
              AND (${letters.map(() => "a.CODE LIKE ?").join(" OR ")})
        `;
    
        const params = letters.map((letter) => `${letter}%`);
    
        // Ajouter des conditions pour les filtres
        if (filters.articleCode) {
            query += " AND a.CODE LIKE ?";
            params.push(`${filters.articleCode}%`);
        }
        if (filters.stockManagement) {
            query += " AND CASE WHEN a.horsstock = 0 THEN 'OUI' WHEN a.horsstock = 1 THEN 'NON' END = ?";
            params.push(filters.stockManagement);
        }
        if (filters.supplierRef) {
            query += " AND af.artfou LIKE ?";
            params.push(`%${filters.supplierRef}%`);
        }
        if (filters.supplierCode) {
            // Comparaison stricte
            query += " AND a.codefou = ?";
            params.push(filters.supplierCode);
        }
        if (filters.stockStatus === 'low') {
            query += " HAVING Stock_courant < Stock_mini";
        }
        if (filters.stockStatus === 'near') {
            query += " HAVING Stock_courant BETWEEN Stock_mini AND (Stock_mini + (Stock_mini * 0.1))";
        }
    
        query += " GROUP BY a.code";
    
        try {
            const [rows] = await db.execute(query, params);
            return rows;
        } catch (err) {
            console.error("Error fetching articles by letters and filters:", err);
            throw err;
        }
    },    
};

module.exports = ArticleModel;
