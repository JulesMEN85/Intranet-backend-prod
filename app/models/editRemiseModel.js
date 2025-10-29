const db = require("../clientMEN85");


const getCustomersWithName = async (search) => {
  /**
   * A l'aide d'une recherche sur le code OU le nom du client,
   * affiche tous les clients qui correspondent
   *
   * @param {string} search - Chaine de caractère ou code qui aiderait à retrouver le client.
   * @returns {Array<Object>} Liste des clients récupérés :
   *   - code {string} : code du client.
   *   - varremise {string} : Texte sql qui recense les remises de chaque client avec des caractères modifiés ("Si" devient "&01", Pourquoi? je ne sais pas), voir ../utils/mapping.js pour plus d'informations
   *   - nom {string} : Nom du client.
   */
  try {
    const query = `
      SELECT varcli.CODE, varremise, client.nom
      FROM varcli
      INNER JOIN client ON client.code = varcli.code
      WHERE CAST(varcli.CODE AS CHAR) LIKE ?
         OR client.nom LIKE ?
    `;
    // Utilisez ici le paramètre `search` pour construire le pattern
    const searchPattern = `%${search}%`;
    const [rows] = await db.query(query, [searchPattern, searchPattern]);
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération clients:", error);
    throw error;
  }
};

const getVarremiseCustomerWithId = async (id) => {
  /**
   * Récupère uniquement la colonne 'varremise' d'un client afin
   * d'appliquer les remises que l'on souhaite
   *
   * @param { integer } id - Identifiant du client
   * @returns { string } varremise
   */
  try {
    const query = `
      SELECT varremise
      FROM varcli
      INNER JOIN client ON client.code = varcli.code
      WHERE varcli.code = ?
    `;
    const [rows] = await db.query(query, [id]);

    if (rows.length > 0) {
      return rows[0].varremise;
    } else {
      return null; 
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw error;
  }
};
const getCustomerWithId = async (id) => {
  /**
   * Récupère un unique client à l'aide de son identifiant (code)
   *
   * @param {integer} id - Identifiant du client.
   * @returns {Array<Object>} Informations du client :
   *   - code {string} : code du client.
   *   - varremise {string} : Texte sql qui recense les remises de chaque client avec des caractères modifiés ("Si" devient "&01", Pourquoi? je ne sais pas), voir ../utils/mapping.js pour plus d'informations
   *   - nom {string} : Nom du client.
   */
  try {
    const query = `
      SELECT varcli.CODE, varremise, client.nom
        FROM varcli
        INNER JOIN client ON client.code = varcli.code
        WHERE varcli.code = ?

    `;
    const [rows] = await db.query(query, [id]);
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération clients:", error);
    throw error;
  }
};

const updateCustomerRemise = async (id, texte) => {
  /**
   * Met à jour le texte de remise d'un client trouvé à l'aide de son identifiant
   * @param {integer} id - Identifiant du client
   * @param {varchar} texte - Texte transformé pour pouvoir être ajouté dans la base de données afin qu'il soit utilisable dans WinPro
   * @returns {NULL}
   */

  try {
    const query = await db.query(
      `
            UPDATE varcli
            SET varcli.varremise = ?
            WHERE CODE = ?
        `,
      [texte, id]
    );
    return query;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client " + id, error);
    throw error;
  }
};

module.exports = {
  getCustomersWithName,
  getCustomerWithId,
  updateCustomerRemise,
  getVarremiseCustomerWithId
};
