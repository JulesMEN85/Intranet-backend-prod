const remiseclientModel = require('../models/remiseclientModel');

const fetchClientRemises = async (req, res) => {
  try {
    const { excludeParticuliers, clientCode } = req.query;
    const filters = {
      excludeParticuliers: excludeParticuliers === 'true',
      clientCode,
    };
    const clients = await remiseclientModel.getClientRemises(filters);
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des remises.' });
  }
};

const getTotalClients = async (req, res) => {
  try {
    console.log('Requête reçue pour /total-clients');
    const totalClients = await remiseclientModel.getTotalClients();
    console.log('Total clients récupérés :', totalClients);
    res.status(200).json({ totalClients });
  } catch (error) {
    console.error('Erreur dans getTotalClients:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du total des clients.' });
  }
};


const getTotalParticuliers = async (req, res) => {
  try {
    console.log('Requête reçue pour /total-particuliers');
    const totalParticuliers = await remiseclientModel.getTotalParticuliers();
    console.log('Total particuliers récupérés :', totalParticuliers);
    res.status(200).json({ totalParticuliers });
  } catch (error) {
    console.error('Erreur dans getTotalParticuliers:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du total des particuliers.' });
  }
};


module.exports = {
  fetchClientRemises,
  getTotalClients,
  getTotalParticuliers,
};