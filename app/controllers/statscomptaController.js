const { getReportData } = require('../models/statscomptaModel'); // Assurez-vous que ce chemin est correct

const getReportDataHandler = async (req, res) => {
  try {
    const { startDate, endDate, filterType, filterValue } = req.query;

    if (!startDate || !endDate || !filterType || !filterValue) {
      return res.status(400).json({ error: 'Tous les paramètres requis doivent être fournis.' });
    }

    const data = await getReportData(startDate, endDate, filterType, filterValue);
    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données du rapport :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données.' });
  }
};

module.exports = { getReportData: getReportDataHandler }; // Export correct
