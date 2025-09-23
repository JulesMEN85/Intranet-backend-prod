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
            SELECT
                all_dates.date,
                ROUND(
                    COALESCE(SUM(c.mfacture + IFNULL(a.total_acompte, 0)), 0)  -- Total de la table commande + les acomptes
                    + COALESCE((
                        SELECT SUM(f.net)
                        FROM facnc f
                        WHERE f.TYPE = 'F' AND f.date = all_dates.date
                    ), 0)  -- Ajouter les factures simples
                    - COALESCE((
                        SELECT SUM(f2.net)
                        FROM facnc f2
                        WHERE f2.TYPE = 'N' AND f2.date = all_dates.date
                    ), 0), 2)  -- Retirer les montants des avoirs/escomptes
                AS totalHT_fact_jour
            FROM (
                SELECT dfacture AS date FROM commande
                WHERE dfacture+0 >= ? AND dfacture+0 <= ?
                UNION   -- Combine toutes les dates distinctes des deux tables
                SELECT date FROM facnc
                WHERE date+0 >= ? AND date+0 <= ?
            ) AS all_dates
            LEFT JOIN commande c ON c.dfacture = all_dates.date
            AND c.nfacture <> 0 AND c.etat <> 900 AND c.numero NOT LIKE 'NON%'
            LEFT JOIN (
              SELECT commande, SUM(pu) AS total_acompte
              FROM artcde
              WHERE TYPE = 4
              GROUP BY commande
              ) a ON c.numero = a.commande -- On fait la somme des acomptes (car possible d'en avoir plusieurs sur la même commande)
            GROUP BY all_dates.date
            ORDER BY all_dates.date;
        `, [`${year}0101`, `${year}1231`, `${year}0101`, `${year}1231`]); // Bornes ajustées pour toute l'année

        return result;
    } catch (error) {
        console.error('Erreur dans getTotalFactureByYear :', error);
        throw error;
    }
  }
}

module.exports = MEN85DashboardModel;
