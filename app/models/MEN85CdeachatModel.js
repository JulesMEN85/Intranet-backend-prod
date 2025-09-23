const db = require('../clientMEN85');

class MEN85CdeachatModel {
  // 🔎 Fonction existante pour récupérer les commandes avec les pièces jointes
  static async getCdeAchat(from, to, nCommande = '', serie = '') {
    try {
      let query = `
        SELECT 
          comfouh.numero, 
          comfouh.histo,
          COALESCE(comfou.dateconf, histofou.dateconf) AS dateconf,
          comfouh.datelivr, 
          comfouh.remarque, 
          fourn.nom, 
          GROUP_CONCAT(DISTINCT attachments.filename SEPARATOR ', ') AS attachment_paths
        FROM comfouh
        LEFT JOIN fourn ON comfouh.fourn = fourn.code
        LEFT JOIN comfou ON comfou.numcom = comfouh.numero
        LEFT JOIN histofou ON histofou.numcom = comfouh.numero
        LEFT JOIN attachments ON attachments.code = comfouh.numero AND attachments.\`table\` = 'SupplierOrder'
        WHERE comfouh.datelivr BETWEEN ? AND ?
      `;

      const queryParams = [from, to];

      if (nCommande) {
        query += ` AND comfouh.numero LIKE ?`;
        queryParams.push(`%${nCommande}%`);
      }

      if (serie) {
        query += ` AND comfouh.remarque LIKE ?`;
        queryParams.push(`%${serie}%`);
      }

      query += ` GROUP BY comfouh.numero, comfouh.histo, comfou.dateconf, histofou.dateconf, comfouh.datelivr, comfouh.remarque, fourn.nom ORDER BY comfouh.datelivr DESC`;


      const [results] = await db.query(query, queryParams);
      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
      throw error;
    }
  }

  // 🆕 Nouvelle fonction pour récupérer les articles d'une commande spécifique 
    static async getArticlesByCommande(numeroCommande) {
      try {
        const query = `
          SELECT c.numcom, c.numligne, c.article, c.libelle, c.qtecdee, c.qterecue, c.pa, hp.prixconf, c.dateconf
          FROM comfou c
          LEFT JOIN hconffouprix hp ON c.numcom = hp.commande AND c.numligne = hp.ligne AND c.article = hp.article
          WHERE c.numcom LIKE ?
          
          UNION ALL
          
          SELECT h.numcom, h.numligne, h.article, h.libelle, h.qtecdee, h.qterecue, h.pa, hp.prixconf, h.dateconf
          FROM histofou h
          LEFT JOIN hconffouprix hp ON h.numcom = hp.commande AND h.numligne = hp.ligne AND h.article = hp.article
          WHERE h.numcom LIKE ?
        `;
    
        const [results] = await db.query(query, [`%${numeroCommande}%`, `%${numeroCommande}%`]);
    
        // Conversion du Buffer en chaîne de caractères
        const formattedResults = results.map(item => ({
          ...item,
          dateconf: item.dateconf ? Buffer.from(item.dateconf).toString('utf-8') : null
        }));
    
        return formattedResults;
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        throw error;
      }
    }      
}

module.exports = MEN85CdeachatModel;

