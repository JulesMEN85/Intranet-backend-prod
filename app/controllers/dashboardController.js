const MEN85DashboardModel = require("../models/MEN85DashboardModel.js");

const getDatesInMonth = (year, month) => {
  const dates = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const showAllYears = async (request, response, next) => {
  try {
    const entrepriseParams = request.params.entreprise;
    console.log("Paramètre entreprise reçu dans showAllYears :", entrepriseParams);

    if (!entrepriseParams) {
      console.log("Aucun paramètre entreprise fourni.");
      return next();
    }

    let years;
    if (['CDE HT', 'BL HT', 'FACT HT'].includes(entrepriseParams)) {
      console.log(`Récupération des années pour ${entrepriseParams}`);
      years = await MEN85DashboardModel.showAllYears();
    }

    if (!years) {
      console.log("Aucune donnée trouvée pour les années.");
      return next();
    }

    console.log("Données des années récupérées :", years);
    response.json(years);
  } catch (error) {
    console.trace(error);
    response.status(500).json({ error: `Server error, please contact an administrator` });
  }
};

const showDataByYear = async (request, response, next) => {
  try {
    const yearParams = parseInt(request.params.year, 10); // Année
    const entrepriseParams = request.params.entreprise; // Entreprise

    console.log("Paramètres reçus dans showDataByYear :", { yearParams, entrepriseParams });

    if (!yearParams || isNaN(yearParams)) {
      console.error("Erreur : année non valide ou manquante.");
      return response.status(400).json({ error: "L'année spécifiée est invalide ou manquante." });
    }

    if (!entrepriseParams) {
      console.error("Erreur : entreprise non spécifiée.");
      return response.status(400).json({ error: "L'entreprise spécifiée est invalide ou manquante." });
    }

    let charts;

    if (entrepriseParams === 'CDE HT') {
      const cdeData = await MEN85DashboardModel.showDataByYear(yearParams);
      const blData = await MEN85DashboardModel.getTotalBLByYear(yearParams);
      const factureData = await MEN85DashboardModel.getTotalFactureByYear(yearParams);

      const blDataByDate = {};
      blData.forEach(item => { blDataByDate[item.dlivraison] = item.totalHT_BL_jour; });

      const factureDataByDate = {};
      factureData.forEach(item => { factureDataByDate[item.date] = item.totalHT_fact_jour; });

      charts = cdeData.map(day => ({
        DATE: day.DATE,
        totalHT_cdes_jour: day.totalHT_cdes_jour,
        totalHT_BL_jour: blDataByDate[day.DATE] || 0,
        totalHT_fact_jour: factureDataByDate[day.DATE] || 0
      }));

      console.log("Données CDE HT regroupées par mois :", charts);
      response.json(groupByMonth(charts));
    } else if (entrepriseParams === 'BL HT') {
      const blData = await MEN85DashboardModel.getTotalBLByYear(yearParams);
      const formattedBLData = blData.map(day => ({
        DATE: day.dlivraison,
        totalHT_BL_jour: day.totalHT_BL_jour,
      }));

      console.log("Données BL HT regroupées par mois :", formattedBLData);
      response.json(groupByMonth(formattedBLData));
    } else if (entrepriseParams === 'FACT HT') {
      const factureData = await MEN85DashboardModel.getTotalFactureByYear(yearParams);

      const formattedFactureData = factureData.map(day => ({
        DATE: day.date,
        totalHT_fact_jour: day.totalHT_fact_jour,
      }));

      console.log("Données FACT HT regroupées par mois :", formattedFactureData);
      response.json(groupByMonth(formattedFactureData));
    } else {
      console.error("Erreur : entreprise inconnue.");
      response.status(400).json({ error: "L'entreprise spécifiée est invalide." });
    }
  } catch (error) {
    console.trace(error);
    response.status(500).json({ error: `Erreur interne du serveur. Veuillez contacter un administrateur.` });
  }
};

const getBLDataByYear = async (request, response, next) => {
  try {
    const yearParams = parseInt(request.params.year, 10);
    const entrepriseParams = request.params.entreprise;

    console.log("Paramètres reçus dans getBLDataByYear :", { yearParams, entrepriseParams });

    if (entrepriseParams === 'BL HT') {
      const blData = await MEN85DashboardModel.getTotalBLByYear(yearParams);
      const formattedBLData = blData.map(day => ({
        DATE: day.dlivraison,
        totalHT_BL_jour: day.totalHT_BL_jour,
      }));

      const groupedData = groupByMonth(formattedBLData);
      console.log("Données regroupées par mois pour BL HT :", groupedData);

      response.json(groupedData);
    } else {
      response.status(404).json({ error: "Entreprise non trouvée pour les données BL" });
    }
  } catch (error) {
    console.trace(error);
    response.status(500).json({ error: "Erreur du serveur, veuillez contacter un administrateur" });
  }
};

const getFactureDataByYear = async (request, response, next) => {
  try {
    const yearParams = parseInt(request.params.year, 10);
    const entrepriseParams = request.params.entreprise;

    console.log("Paramètres reçus dans getFactureDataByYear :", { yearParams, entrepriseParams });

    if (entrepriseParams === 'FACT HT') {
      const factureData = await MEN85DashboardModel.getTotalFactureByYear(yearParams);
      const formattedFactureData = factureData.map(day => ({
        DATE: day.date,
        totalHT_fact_jour: day.totalHT_fact_jour,
      }));

      const groupedData = groupByMonth(formattedFactureData);
      console.log("Données regroupées par mois pour FACT HT :", groupedData);

      response.json(groupedData);
    } else {
      response.status(404).json({ error: "Entreprise non trouvée pour les données Facture" });
    }
  } catch (error) {
    console.trace(error);
    response.status(500).json({ error: "Erreur du serveur, veuillez contacter un administrateur" });
  }
};

function groupByMonth(data) {
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];

  return data.reduce((acc, item) => {
    const monthName = months[new Date(item.DATE).getMonth()];
    if (!acc[monthName]) acc[monthName] = [];
    acc[monthName].push(item);
    return acc;
  }, {});
}

module.exports = {
  showDataByYear,
  showAllYears,
  getBLDataByYear,
  getFactureDataByYear,
};
