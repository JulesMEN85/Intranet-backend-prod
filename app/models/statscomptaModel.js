const db = require('../clientMEN85');



const getReportData = async (startDate, endDate, filterType, filterValue) => {
  const query = `
    SELECT
      c.client,
      cl.nom,

      -- Calcul pour PG_ALU
      COALESCE((
        SELECT ROUND(SUM(c1.mfacture - c1.supplfft - c1.fraisport), 2)
        FROM commande c1
        LEFT JOIN (
          SELECT DISTINCT commande, csysteme
          FROM fen
        ) f1 ON c1.numero = f1.commande
        WHERE c1.client = c.client
          AND (f1.csysteme LIKE 'Sca%' OR f1.csysteme LIKE 'Spa%')
          AND c1.numne <> 0
          AND c1.dfacture + 0 >= ?
          AND c1.dfacture + 0 <= ?
          AND c1.etat = 850
      ), 0) AS PG_ALU,

      -- Calcul pour PG_PVC
      COALESCE((
        SELECT ROUND(SUM(c2.mfacture - c2.supplfft - c2.fraisport), 2)
        FROM commande c2
        LEFT JOIN (
          SELECT DISTINCT commande, csysteme
          FROM fen
        ) f2 ON c2.numero = f2.commande
        WHERE c2.client = c.client
          AND (f2.csysteme LIKE 'Scp%' OR f2.csysteme LIKE 'Spp%')
          AND c2.numne <> 0
          AND c2.dfacture + 0 >= ?
          AND c2.dfacture + 0 <= ?
          AND c2.etat = 850
      ), 0) AS PG_PVC,

      -- Calcul pour Volets_ALU
      COALESCE((
        SELECT ROUND(SUM(c3.mfacture - c3.supplfft - c3.fraisport), 2)
        FROM commande c3
        WHERE c3.client = c.client
          AND c3.numero IN (
            SELECT DISTINCT f3.commande
            FROM fen f3
            WHERE f3.csysteme LIKE 'SS%' OR f3.csysteme LIKE 'SVa%'
          )
          AND c3.numne <> 0
          AND c3.dfacture + 0 >= ?
          AND c3.dfacture + 0 <= ?
          AND c3.etat = 850
      ), 0) AS Volets_ALU,

      -- Calcul pour Volets_PVC
      COALESCE((
        SELECT ROUND(SUM(c4.mfacture - c4.supplfft - c4.fraisport), 2)
        FROM commande c4
        WHERE c4.client = c.client
          AND c4.numero IN (
            SELECT DISTINCT f4.commande
            FROM fen f4
            WHERE f4.csysteme LIKE 'SVp%'
          )
          AND c4.numne <> 0
          AND c4.dfacture + 0 >= ?
          AND c4.dfacture + 0 <= ?
          AND c4.etat = 850
      ), 0) AS Volets_PVC,

      -- Calcul pour Portail_et_Cloture
      COALESCE((
        SELECT ROUND(SUM(c5.mfacture - c5.supplfft - c5.fraisport), 2)
        FROM commande c5
        WHERE c5.client = c.client
          AND c5.numero IN (
            SELECT DISTINCT f5.commande
            FROM fen f5
            WHERE f5.csysteme LIKE 'PORCLOT'
          )
          AND c5.numne <> 0
          AND c5.dfacture + 0 >= ?
          AND c5.dfacture + 0 <= ?
          AND c5.etat = 850
      ), 0) AS Portail_et_Cloture,

      -- Calcul pour Motorisation
      COALESCE((
        SELECT ROUND(SUM(a.pvtotal), 2)
        FROM art a
        LEFT JOIN article ar ON a.code = ar.code
        LEFT JOIN commande c6 ON a.commande = c6.numero
        WHERE c6.client = c.client
          AND a.commande IN (
            SELECT c7.numero
            FROM commande c7
            WHERE c7.client = c.client
              AND c7.numne <> 0
              AND c7.dlivraison + 0 >= ?
              AND c7.dlivraison + 0 <= ?
              AND c7.etat = 850
              AND c7.numero NOT IN (
                SELECT DISTINCT f6.commande
                FROM fen f6
              )
          )
          AND ar.categorie IN ('140', '145')
      ), 0) AS Motorisation,

      -- Calcul pour PS
      COALESCE((
        SELECT ROUND(SUM(c8.mfacture - c8.supplfft - c8.fraisport), 2)
        FROM commande c8
        WHERE c8.client = c.client
          AND c8.numero IN (
            SELECT DISTINCT f8.commande
            FROM fen f8
            WHERE f8.csysteme LIKE 'PSA%'
          )
          AND c8.numne <> 0
          AND c8.dfacture + 0 >= ?
          AND c8.dfacture + 0 <= ?
          AND c8.etat = 850
      ), 0) AS PS,

      -- Calcul pour Persiennes
      COALESCE((
      SELECT ROUND(SUM(c12.mfacture - c12.supplfft - c12.fraisport), 2)
      FROM commande c12
      WHERE c12.client = c.client
      AND c12.numero IN (
      SELECT DISTINCT f12.commande
      FROM fen f12
      WHERE f12.csysteme LIKE 'PER%'
      )
      AND c12.numne <> 0
      AND c12.dfacture + 0 >= ?
      AND c12.dfacture + 0 <= ?
      AND c12.etat = 850
      ), 0) AS Persiennes,

      -- Calcul pour Divers
      COALESCE((
      -- Total HT des commandes non liées à un système
        SELECT ROUND(SUM(c9.mfacture - c9.supplfft - c9.fraisport), 2)
        FROM commande c9
        LEFT JOIN client cl9 ON c9.client = cl9.code
        WHERE c9.client = c.client
          AND c9.numne <> 0
          AND c9.dfacture + 0 >= ?
          AND c9.dfacture + 0 <= ?
          AND c9.etat = 850
          AND c9.numero NOT IN (
            SELECT f.commande
            FROM fen f
          )
          AND c9.numero NOT IN (
            SELECT f.commande
            FROM fen f
            WHERE f.csysteme LIKE 'SS%' OR f.csysteme LIKE 'SVa%' OR f.csysteme LIKE 'SVp%' OR f.csysteme LIKE 'Sca%' OR f.csysteme LIKE 'Spa%'
          )
      ), 0)
      - COALESCE((
      -- Retirer le total des motorisations
        SELECT ROUND(SUM(a.pvtotal), 2)
        FROM art a
        LEFT JOIN article ar ON a.code = ar.code
        LEFT JOIN commande c6 ON a.commande = c6.numero
        WHERE c6.client = c.client
          AND ar.categorie IN ('140', '145')
          AND a.commande IN (
            SELECT c7.numero
            FROM commande c7
            WHERE c7.client = c.client
              AND c7.numne <> 0
              AND c7.dlivraison + 0 >= ?
              AND c7.dlivraison + 0 <= ?
              AND c7.etat = 850
              AND c7.numero NOT IN (
                SELECT DISTINCT f6.commande
                FROM fen f6
              )
          )
      ), 0)
      + COALESCE((
      -- Ajouter le total HT des commandes 'PORG%' (Portes de garages Correze) et des 'PX%' (Panneaux alu)
        SELECT ROUND(SUM(c10.mfacture - c10.supplfft - c10.fraisport), 2)
        FROM commande c10
        LEFT JOIN client cl10 ON c10.client = cl10.code
        WHERE c10.client = c.client
          AND c10.numne <> 0
          AND c10.dfacture + 0 >= ?
          AND c10.dfacture + 0 <= ?
          AND c10.etat = 850
          AND c10.numero IN (
            SELECT f.commande
            FROM fen f
            WHERE f.csysteme LIKE 'PORG%'
            OR f.csysteme LIKE 'PX01%')
      ), 0) 
      + COALESCE((
      -- Ajouter le total des acomptes de la table artcde (TYPE = 4)
        SELECT ROUND(SUM(a12.pu), 2)
        FROM artcde a12
        LEFT JOIN commande c12 ON a12.commande = c12.numero
        WHERE c12.client = c.client
        AND a12.TYPE = 4
        AND c12.dfacture + 0 >= ?
        AND c12.dfacture + 0 <= ?
        AND c12.etat = 850
      ), 0)
      AS Divers,

      -- Calcul pour Complements
      COALESCE((
        SELECT ROUND(SUM(c11.fraisport + c11.supplfft), 2)
        FROM commande c11
        WHERE c11.client = c.client
          AND c11.numne <> 0
          AND c11.dfacture + 0 >= ?
          AND c11.dfacture + 0 <= ?
          AND c11.etat = 850
      ), 0) AS Complements,

      -- Calcul pour les escomptes
      COALESCE((
        SELECT ROUND(SUM(-f.net), 2)
        FROM facnc f
        WHERE f.client = c.client
          AND f.texte LIKE '%ESCOMPTE%'
          AND f.date + 0 >= ?
          AND f.date + 0 <= ?
      ), 0) AS Escomptes,

      -- Calcul pour les avoirs
      COALESCE((
        SELECT ROUND(SUM(-f.net), 2)
        FROM facnc f
        WHERE f.client = c.client
          AND f.texte NOT LIKE '%ESCOMPTE%'
          AND f.type = 'N'
          AND f.date + 0 >= ?
          AND f.date + 0 <= ?
      ), 0) AS Avoirs

    FROM
      commande c
    LEFT JOIN
      client cl ON c.client = cl.code
    WHERE
      ${filterType === 'categorie' ? 'cl.categorie = ?' :
        filterType === 'client' ? 'cl.code = ?' : 
        'cl.repres = ?'}
    GROUP BY
      c.client, cl.nom
    ORDER BY
      cl.nom;
  `;

  // Transformez les dates dynamiques
  const formattedStartDate = startDate.replace(/-/g, '');
  const formattedEndDate = endDate.replace(/-/g, '');

  // Logs pour valider les transformations
  console.log('Formatted StartDate:', formattedStartDate);
  console.log('Formatted EndDate:', formattedEndDate);

  // Exécution de la requête
  const [rows] = await db.execute(query, [
    formattedStartDate, formattedEndDate, // PG_ALU
    formattedStartDate, formattedEndDate, // PG_PVC
    formattedStartDate, formattedEndDate, // Volets_ALU
    formattedStartDate, formattedEndDate, // Volets_PVC
    formattedStartDate, formattedEndDate, // Portail_et_Cloture
    formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate, // Motorisation
    formattedStartDate, formattedEndDate, // PS
    formattedStartDate, formattedEndDate, // Persiennes
    formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate, // Divers
    formattedStartDate, formattedEndDate, // Complements
    formattedStartDate, formattedEndDate, // Escomptes
    formattedStartDate, formattedEndDate, // Avoirs
    filterValue // Filtre
  ]);

  return rows;
};

module.exports = { getReportData };
