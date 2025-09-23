const db = require('../clientMEN85');

const getCommandes = async (week, zone) => {
    const conditions = [];
    const params = [];

    // Ajout des conditions dynamiques
    conditions.push('(c.etat >= 500 AND c.etat < 740)'); // Filtrer par état

    if (week) {
        conditions.push('YEARWEEK(c.dlivraison, 1) = YEARWEEK(?, 1)');
        params.push(week);
    }

    if (zone) {
        conditions.push('c.zonelivr = ?');
        params.push(zone);
    }

    // Construction de la clause WHERE
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Requête principale
    const query = `
        SELECT
            c.numero AS Num_Cde,
            c.dlivraison AS Date_Livraison,
            c.zonelivr AS Zone_Livraison,
            c.etat AS Etat_Cde,
            cl.nom,
            COALESCE(f.position, '---') AS Repere,
            COALESCE(f.csysteme, 'SANS') AS systeme,
            COALESCE(f.systeme, 'COMMANDE SANS SYSTEME') AS Designation,
            COALESCE(f.quantite, 1) AS Quantite,
            CASE
                WHEN f.csysteme = 'PSA01' THEN
                (SELECT dt.texte
                 FROM det dt
                 WHERE f.commande = dt.commande
                 AND f.typedoc = dt.typedoc
                 AND dt.chassis = f.chassis
                 AND dt.question LIKE '%Nombre total de panneaux%')
                ELSE
                COALESCE(d.nvantaux, 0)
            END AS Nb_Vtx_Pan_Par_Repere,
            ROUND(f.hautfabr, 0) AS Hauteur,
            ROUND(f.largfabr, 0) AS Largeur
        FROM commande c
        LEFT JOIN client cl ON c.client = cl.code
        LEFT JOIN fen f ON c.numero = f.commande AND (f.typedoc = 'X' OR f.typedoc IS NULL)
        LEFT JOIN detail d ON d.commande = c.numero AND d.numero = f.position
        ${whereClause};
    `;

    const [rows] = await db.execute(query, params);
    return rows;
};

module.exports = {
    getCommandes
};
