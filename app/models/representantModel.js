const db = require('../clientMEN85');

// Récupérer la liste des représentants
const getAllRepresentants = async () => {
    const query = 'SELECT CODE, nom FROM repres;';
    const [rows] = await db.execute(query);
    return rows;
  };
  
  // Récupérer les clients associés à un représentant
  const getClientsByRepresentant = async (representantCode) => {
    const query = `
      SELECT c.CODE AS Code_Client, c.nom AS Nom_Client, c.repres AS Code_Representant, r.nom AS Nom_Representant
      FROM client c
      LEFT JOIN repres r ON c.repres = r.code
      WHERE c.repres = ?
      ORDER BY c.nom;
    `;
    const [rows] = await db.execute(query, [representantCode]);
    return rows;
  };
  
  module.exports = { getAllRepresentants, getClientsByRepresentant };
