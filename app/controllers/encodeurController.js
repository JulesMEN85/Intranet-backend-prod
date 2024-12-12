const { getProcessingTimeByEncodeur, getEncodeurs, getProcessingTime, getProcessingTimeForCCommands, getProcessingTimeForSAV, getProcessingTimeForAccess,getProcessingTimeByMonth } = require('../models/encodeurModel');

// Fonction pour récupérer les temps de traitement pour un encodeur spécifique
const fetchProcessingTimeByEncodeur = async (req, res) => {
  const { encodeur, startDate, endDate } = req.query;

  // Vérifier si les paramètres requis sont fournis
  if (!encodeur || !startDate || !endDate) {
    return res.status(400).json({ message: 'Les paramètres encodeur, startDate et endDate sont requis.' });
  }

  try {
    const results = await getProcessingTimeByEncodeur(encodeur, startDate, endDate);
    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des temps de traitement :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Nouvelle fonction pour récupérer les temps de traitement sans filtrer par encodeur
const fetchProcessingTime = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Vérifier si les paramètres requis sont fournis
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Les paramètres startDate et endDate sont requis.' });
  }

  try {
    const results = await getProcessingTime(startDate, endDate);

    if (!results.length) {
      return res.status(200).json({
        commandes: [],
        totalTVA: 0, // Renvoie 0 pour les totaux s'il n'y a pas de résultats
        totalHTVA: 0,
      });
    }

    const totalTVA = results.reduce((sum, row) => sum + (row.tottvac || 0), 0);
    const totalHTVA = results.reduce((sum, row) => sum + (row.tothtva || 0), 0);

    // Retourner les totaux directement
    res.status(200).json({
      commandes: results,
      totalTVA: totalTVA.toFixed(2), // Totaux arrondis à 2 décimales
      totalHTVA: totalHTVA.toFixed(2),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des temps de traitement :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


// Fonction pour récupérer les encodeurs disponibles
const fetchEncodeurs = async (req, res) => {
  try {
    const encodeurs = await getEncodeurs(); // Appel à la fonction du modèle
    res.status(200).json(encodeurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des encodeurs :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

const fetchProcessingTimeForCCommands = async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log('Requête reçue avec startDate:', startDate, 'endDate:', endDate);

  const isValidDate = (date) => !isNaN(new Date(date).getTime());

  if (!startDate || !endDate || !isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({ message: 'Les paramètres startDate et endDate sont requis et doivent être des dates valides.' });
  }

  try {
    const results = await getProcessingTimeForCCommands(startDate, endDate);

    if (!results || results.length === 0) {
      return res.status(200).json({
        totalCommands: 0,
        totalTVA: 0,
        totalHTVA: 0,
      });
    }

    const totalTVA = results.reduce((sum, row) => sum + (row.tottvac || 0), 0);
    const totalHTVA = results.reduce((sum, row) => sum + (row.tothtva || 0), 0);

    res.status(200).json({
      totalCommands: results.length,
      totalTVA, // Total TVA sans division
      totalHTVA, // Total HTVA sans division
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour les commandes C:', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};




const fetchProcessingTimeForSAVCommands = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Vérifier si les dates sont fournies
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Les paramètres startDate et endDate sont requis.' });
  }

  try {
    const results = await getProcessingTimeForSAV(startDate, endDate);

    if (!results.length) {
      return res.status(200).json({
        totalCommands: 0,
        totalTVA: 0, // Retourne un total de TVA de 0
        totalHTVA: 0, // Retourne un total de HTVA de 0
      });
    }

    // Calcul des totaux
    const totalTVA = results.reduce((sum, row) => sum + (row.tottvac || 0), 0);
    const totalHTVA = results.reduce((sum, row) => sum + (row.tothtva || 0), 0);

    res.status(200).json({
      totalCommands: results.length,
      totalTVA, // Retourne le total complet de la TVA
      totalHTVA, // Retourne le total complet de la HTVA
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données SAV :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


const fetchProcessingTimeForAccess = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Vérifier si les dates sont fournies
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Les paramètres startDate et endDate sont requis.' });
  }

  try {
    const results = await getProcessingTimeForAccess(startDate, endDate);

    if (!results.length) {
      return res.status(200).json({
        totalCommands: 0,
        totalTVA: 0,
        totalHTVA: 0,
      });
    }

    // Calculer les totaux pour TVA et HTVA
    const totalTVA = results.reduce((sum, row) => sum + (row.tottvac || 0), 0);
    const totalHTVA = results.reduce((sum, row) => sum + (row.tothtva || 0), 0);

    res.status(200).json({
      totalCommands: results.length,
      totalTVA: totalTVA.toFixed(2), // Arrondi à deux décimales
      totalHTVA: totalHTVA.toFixed(2), // Arrondi à deux décimales
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données Access :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

const fetchComparisonForMonths = async (req, res) => {
  const { months } = req.query; // Liste des mois

  // Vérifiez si des mois sont fournis
  if (!months) {
    return res.status(400).json({ message: 'Veuillez fournir une liste de mois.' });
  }

  const monthArray = Array.isArray(months) ? months : [months]; // Assurez-vous d'avoir un tableau

  try {
    // Récupérez les données pour chaque mois
    const results = await Promise.all(
      monthArray.map((month) => getProcessingTimeByMonth(month))
    );

    // Formatez les résultats
    const formattedResults = results.map((data, index) => ({
      month: monthArray[index],
      data,
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Exporter les fonctions
module.exports = { fetchProcessingTimeByEncodeur, 
  fetchProcessingTime, 
  fetchEncodeurs, 
  fetchProcessingTimeForCCommands, 
  fetchProcessingTimeForSAVCommands, 
  fetchProcessingTimeForAccess, 
  fetchComparisonForMonths };
