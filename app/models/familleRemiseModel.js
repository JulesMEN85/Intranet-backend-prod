const db_intranet = require("../clientDashboard");

const postFamilyDiscount = async (name, famille_remise) => {
    /**
     * Ajoute une famille de remise dans la 
     * base de données de l'intranet
     * @param {string} name - Le nom de la famille de remise (Volets, Portails...)
     * @param {integer} famille_remise - Le numéro de la famille que l'on souhaite attribuer. 
     *                                      Attention, case très fragile, les familles de remise dans la BDD de l'intranet 
     *                                      et de celle dans WinPro ne sont pas liés
     * @returns {null}
     */
  const [result] = await db_intranet.query(
    `
            INSERT INTO famille (name, famille_remise, est_supprimable)
            VALUES (?, ?, 1)
            `,
    [name, famille_remise]
  );
  return result.insertId;
};

const deleteFamilyDiscount = async (famille_remise) => {
    /**
     * Supprime une famille de remise 
     * à partir du code de la famille de remise
     * @param {integer} famille_remise - Numéro de la famille de remise
     * @returns {null}
     */
  const result = await db_intranet.query(
    `
        DELETE FROM famille
        WHERE famille_remise = ?
        `,
    famille_remise
  );
  return result;
};

const getFamilyDiscount = async (famille_remise) => {
    /**
     * Récupère une seule famille de remise 
     * récupéré à l'aide de son code famille de remise
     * @param {integer} famille_remise - Numéro de famille de remise
     * @returns {Array<Object>} - Information sur cette famille de remise
     *      - id {integer} Identifiant unique incrémenté automatiquement lors de sa création
     *      - name {string} Nom de la famille de remise
     *      - famille_remise {integer} Numéro de la famille de remise (unique aussi)
     *      - est_supprimable {boolean} Booléen afin de savoir si la famille peut être supprimée par un utilisateur
     */
  const query = `
            SELECT *
            FROM famille
            WHERE famille_remise = ? 
        `;
  const [rows] = await db_intranet.query(query, [famille_remise]);
  return rows;
};

const getFamiliesDiscount = async () => {
    /**
     * Récupère toutes les familles de remise 
     * @param {integer} famille_remise - Numéro de famille de remise
     * @returns {Array<Object>} - Information sur les familles de remise
     *      - id {integer} Identifiant unique incrémenté automatiquement lors de sa création
     *      - name {string} Nom de la famille de remise
     *      - famille_remise {integer} Numéro de la famille de remise (unique aussi)
     *      - est_supprimable {boolean} Booléen afin de savoir si la famille peut être supprimée par un utilisateur
     */
    const query = `
    SELECT *
    FROM famille
    `;
  try {
    const [rows] = await db_intranet.execute(query);
    return rows;
  } catch (err) {
    console.error("Erreur lors de la récupération des familles:", err);
    throw err;
  }
};

const updateFamilyDiscount = async (name, famille_remise) => {
    /**
     * Met à jour le nom d'une famille de remise
     * à l'aide de son numéro de famille de remise
     * @param {string} name - Nouveau nom de la famille de remise 
     * @param {integer} famille_remise - Numéro de famille de remise
     * @returns {null} 
     */
    try {
    const query = await db_intranet.query(
      `
            UPDATE famille
            SET famille.name = ?
            WHERE famille_remise = ?
        `,
      [name, famille_remise]
    );
    return query;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la famille  " + famille_remise, error);
    throw error;
  }
}

module.exports = {
  postFamilyDiscount,
  deleteFamilyDiscount,
  getFamilyDiscount,
  getFamiliesDiscount,
  updateFamilyDiscount
};
