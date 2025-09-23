const client = require('../clientDashboard');

class UserModel {
  // Ajout d'utilisateur
  static async addUser(data) {
    try {
      await client.query(
        'INSERT INTO user (email, password, role_id) VALUES (?, ?, ?)',
        [data.email, data.password, data.roleId]
      );

      const user = await client.query(
        'SELECT email FROM user WHERE id = LAST_INSERT_ID()'
      );

      return user[0] ? "L'utilisateur a bien été créé !" : null;
    } catch (error) {
      console.trace(error);
      throw new Error("Erreur lors de l'ajout de l'utilisateur");
    }
  }

  // Récupération des informations de l'utilisateur
  static async showData(data) {
    try {
      const result = await client.query(
        'SELECT id, password, email, role_id FROM user WHERE email = ?',
        [data.email]
      );

      return result[0][0] || null;
    } catch (error) {
      console.trace(error);
      throw new Error("Erreur lors de la récupération des données");
    }
  }

  // Récupération des informations par ID
  static async showDataById(id) {
    try {
      const [rows] = await client.query(
        'SELECT id, email, role_id, name, avatar FROM user WHERE id = ?',
        [id]
      );
      return rows[0] || null; // Retourner l'utilisateur avec son rôle
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  }
  
static async showDataById(id) {
  try {
    console.log("ID reçu :", id); // Vérifie que l'ID est transmis
    const [rows] = await client.query(
      "SELECT * FROM user WHERE id = ?",
      [id]
    );
    console.log("Résultat brut de la requête SQL :", rows); // Log les résultats SQL
    return rows[0] || null; // Retourne le premier utilisateur trouvé ou null
  } catch (error) {
    console.error("Erreur lors de la requête SQL :", error);
    throw new Error("Erreur interne lors de la récupération de l'utilisateur");
  }
}
}

module.exports = UserModel;
