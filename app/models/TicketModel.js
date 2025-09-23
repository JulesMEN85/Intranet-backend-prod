const db = require('../clientDashboard');

const createTicket = async ({ NomTicket, Description, Priorite, PieceJointe, CreatedBy, AssignedTo }) => {
  const query = `
    INSERT INTO Ticket (NomTicket, Description, Priorite, PieceJointe, CreatedBy, AssignedTo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.execute(query, [NomTicket, Description, Priorite, PieceJointe, CreatedBy, AssignedTo]);
    return {
      success: true,
      message: 'Ticket créé avec succès.',
      insertedId: result.insertId, // Retourne l'ID du ticket créé
    };
  } catch (error) {
    console.error('Erreur lors de la création du ticket :', error);
    throw new Error('Impossible de créer le ticket en base de données.');
  }
};

module.exports = {
  createTicket,
};
