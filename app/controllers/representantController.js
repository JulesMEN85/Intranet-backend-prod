const { getAllRepresentants, getClientsByRepresentant } = require('../models/representantModel');

// Contrôleur pour récupérer tous les représentants
const fetchRepresentants = async (req, res) => {
  try {
    const representants = await getAllRepresentants();
    res.status(200).json(representants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des représentants.' });
  }
};

// Contrôleur pour récupérer les clients associés à un représentant
const fetchClientsByRepresentant = async (req, res) => {
  const { representantCode } = req.query;

  if (!representantCode) {
    return res.status(400).json({ message: 'Le code du représentant est requis.' });
  }

  try {
    const clients = await getClientsByRepresentant(representantCode);
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients.' });
  }
};

module.exports = { fetchRepresentants, fetchClientsByRepresentant };
