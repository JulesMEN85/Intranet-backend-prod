const db = require('../clientMEN85');

class MEN85CdeachatModel {
  static async getCdeAchat(from, to, nCommande = '', serie = '') {
    try {
      let query = `
        SELECT numero, datelivr, datecde, remarque, client.nom 
        FROM comfouh
        INNER JOIN client ON comfouh.client = client.code
        WHERE datecde BETWEEN ? AND ?
      `;
      const queryParams = [from, to];

      // Ajoutez le filtre de `nCommande` si le paramètre est présent
      if (nCommande) {
        query += ` AND numero LIKE ?`;
        queryParams.push(`%${nCommande}%`); // Utilisez LIKE pour une recherche partielle
      }

      // Ajoutez le filtre de `serie` si le paramètre est présent
      if (serie) {
        query += ` AND remarque LIKE ?`;
        queryParams.push(`%${serie}%`);
      }

      const [result] = await db.query(query, queryParams);
      return result;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes d'achat :", error);
      throw error;
    }
  }
}

module.exports = MEN85CdeachatModel;
