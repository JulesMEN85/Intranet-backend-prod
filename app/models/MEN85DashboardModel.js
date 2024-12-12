// MEN85DashboardModel.js
const db = require('../clientMEN85');

class MEN85DashboardModel {
  // Méthode existante showAllYears
  static async showAllYears() {
    try {
      const [years] = await db.query('SELECT DISTINCT YEAR(date) AS nombre_d_annees, YEAR(date) AS date FROM commande');
      return years;
    } catch (error) {
      console.error('Erreur dans showAllYears :', error);
      throw error;
    }
  }

  // Méthode existante showDataByYear
  static async showDataByYear(year) {
    try {
      const [data] = await db.query(`
        SELECT DATE, ROUND(SUM(totht), 2) AS totalHT_cdes_jour
        FROM commande
        WHERE YEAR(DATE) = ? 
          AND etat <> 900
          AND numero NOT LIKE 'NON%'
        GROUP BY DATE
        ORDER BY DATE;
      `, [year]);
      return data;
    } catch (error) {
      console.error('Erreur dans showDataByYear de MEN85 :', error);
      throw error;
    }
  }

  // Nouvelle méthode pour getTotalBLByYear
  static async getTotalBLByYear(year) {
    try {
      const [result] = await db.query(`
        SELECT dlivraison, ROUND(SUM(totht), 2) AS totalHT_BL_jour
        FROM commande
        WHERE numne <> 0
          AND YEAR(dlivraison) = ?
          AND etat <> 900
          AND numero NOT LIKE 'NON%'
        GROUP BY dlivraison
        ORDER BY dlivraison;
      `, [year]);
      return result;
    } catch (error) {
      console.error('Erreur dans getTotalBLByYear :', error);
      throw error;
    }
  }

  // Nouvelle méthode pour getTotalFactureByYear
  static async getTotalFactureByYear(year) {
    try {
      const [result] = await db.query(`
        SELECT dfacture, ROUND(SUM(mfacture), 2) AS totalHT_fact_jour
        FROM commande
        WHERE nfacture <> 0
          AND YEAR(dfacture) = ?
          AND etat <> 900
          AND numero NOT LIKE 'NON%'
        GROUP BY dfacture
        ORDER BY dfacture;
      `, [year]);
      return result;
    } catch (error) {
      console.error('Erreur dans getTotalFactureByYear :', error);
      throw error;
    }
  }
}

module.exports = MEN85DashboardModel;
