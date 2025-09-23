const db = require('../clientDashboard'); // Connexion à la base de données

class PersonnelModel {
  // Récupérer tous les enregistrements de la table personnel
  static async getAllPersonnel() {
    try {
      console.log("Exécution de la requête SQL pour récupérer le personnel");
      const [personnel] = await db.query('SELECT * FROM personnel');
      return personnel;
    } catch (error) {
      console.error('Erreur dans getAllPersonnel :', error);
      throw error;
    }
  }

  // Ajouter une nouvelle personne
  static async addPersonnel(data) {
    try {
      const { name } = data; // Seul `name` est utilisé pour cette table
      const [result] = await db.query(
        'INSERT INTO personnel (name) VALUES (?)',
        [name]
      );
      console.log("Résultat de l'insertion dans personnel :", result);
      return { id: result.insertId, name }; // Retourne l'ID inséré pour les opérations suivantes
    } catch (error) {
      console.error('Erreur dans addPersonnel :', error);
      throw error;
    }
  }

  // Mettre à jour uniquement le nom d'une personne
  static async updatePersonnel(id, data) {
    try {
      const { name } = data; // Seul `name` est mis à jour dans cette table
      console.log("Données pour la mise à jour :", { id, name });
      
      const [result] = await db.query(
        'UPDATE personnel SET name = ? WHERE id = ?',
        [name, id]
      );

      console.log("Résultat de la mise à jour :", result);
      return result;
    } catch (error) {
      console.error('Erreur dans updatePersonnel :', error);
      throw error;
    }
  }

  // Supprimer une personne
  static async deletePersonnel(id) {
    try {
      console.log("ID pour la suppression :", id);

      const [result] = await db.query(
        'DELETE FROM personnel WHERE id = ?',
        [id]
      );

      console.log("Résultat de la suppression :", result);
      return result;
    } catch (error) {
      console.error('Erreur dans deletePersonnel :', error);
      throw error;
    }
  }
}

module.exports = PersonnelModel;
