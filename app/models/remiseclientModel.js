const db = require('../clientMEN85');

const getClientRemises = async (filter = {}) => {
  let query = `
    SELECT
      DISTINCT v.CODE,
      c.nom,
      c.remise AS Remise_Fiche_Client,

      REPLACE(
        REPLACE(
          SUBSTRING(
            varremise,
            LOCATE('&01(familleremise&1D1)', varremise) + LENGTH('&01(familleremise&1D1)'),
            LOCATE('&02(familleremise&1D2)', varremise) - (LOCATE('&01(familleremise&1D1)', varremise) + LENGTH('&01(familleremise&1D1)'))
          ),
          '_!893&23', ''
        ),
        '&0F', ''
      ) AS Volets_1,

      REPLACE(
        REPLACE(
          SUBSTRING(
            varremise,
            LOCATE('&02(familleremise&1D2)', varremise) + LENGTH('&02(familleremise&1D2)'),
            LOCATE('&02(familleremise&1D3)', varremise) - (LOCATE('&02(familleremise&1D2)', varremise) + LENGTH('&02(familleremise&1D2)'))
          ),
          '_!893&23', ''
        ),
        '&0F', ''
      ) AS Portes_Garages_2,

      REPLACE(
        REPLACE(
          SUBSTRING(
            varremise,
            LOCATE('&02(familleremise&1D3)', varremise) + LENGTH('&02(familleremise&1D3)'),
            LOCATE('&02(familleremise&1D4)', varremise) - (LOCATE('&02(familleremise&1D3)', varremise) + LENGTH('&02(familleremise&1D3)'))
          ),
          '_!893&23', ''
        ),
        '&0F', ''
      ) AS Portes_Sectionnelles_3,

      REPLACE(
        REPLACE(
          SUBSTRING(
            varremise,
            LOCATE('&02(familleremise&1D4)', varremise) + LENGTH('&02(familleremise&1D4)'),
            LOCATE('&02(familleremise&1D5)', varremise) - (LOCATE('&02(familleremise&1D4)', varremise) + LENGTH('&02(familleremise&1D4)'))
          ),
          '_!893&23', ''
        ),
        '&0F', ''
      ) AS Portail_Cloture_4,

      REPLACE(
        REPLACE(
          SUBSTRING(
            varremise,
            LOCATE('&02(familleremise&1D5)', varremise) + LENGTH('&02(familleremise&1D5)'),
            LOCATE('&04', varremise) - (LOCATE('&02(familleremise&1D5)', varremise) + LENGTH('&02(familleremise&1D5)'))
          ),
          '_!893&23', ''
        ),
        '&0F', ''
      ) AS Panneaux_5

    FROM
      varcli v
    LEFT JOIN
      client c ON c.code = v.code
  `;

  // Ajouter un filtre pour les particuliers si spécifié
  if (filter.excludeParticuliers) {
    query += " WHERE NOT (v.CODE LIKE '9___' AND LENGTH(v.CODE) = 4)";
  }

  // Ajouter un filtre pour un client spécifique
  if (filter.clientCode) {
    query += (filter.excludeParticuliers ? " AND" : " WHERE") + ` c.code = '${filter.clientCode}'`;
  }

  query += " ORDER BY c.nom;";

  const [rows] = await db.execute(query);
  return rows;
};

const getTotalClients = async () => {
  try {
    const query = `SELECT COUNT(*) AS totalClients FROM varcli;`;
    console.log('Exécution de la requête SQL pour /total-clients :', query);
    const [rows] = await db.execute(query);
    console.log('Résultat de la requête SQL pour /total-clients :', rows);
    return rows[0].totalClients;
  } catch (error) {
    console.error('Erreur dans getTotalClients (modèle) :', error);
    throw error;
  }
};


const getTotalParticuliers = async () => {
  try {
    const query = `SELECT COUNT(*) AS totalParticuliers FROM varcli WHERE CODE LIKE '9___' AND LENGTH(CODE) = 4;`;
    console.log('Exécution de la requête SQL pour /total-particuliers :', query);
    const [rows] = await db.execute(query);
    console.log('Résultat de la requête SQL pour /total-particuliers :', rows);
    return rows[0].totalParticuliers;
  } catch (error) {
    console.error('Erreur dans getTotalParticuliers (modèle) :', error);
    throw error;
  }
};




module.exports = {
  getClientRemises,
  getTotalClients,
  getTotalParticuliers,
};
