const db = require('../clientMEN85');

// Fonction pour récupérer la liste des encodeurs disponibles
const getEncodeurs = async () => {
  const query = `
    SELECT code 
    FROM user
    WHERE envoiconf = 1
    AND wpreport = 0
    AND retourconf = 0;
  `;
  const [rows] = await db.execute(query);
  return rows;
};

// Fonction pour récupérer les temps de traitement
const getProcessingTimeByEncodeur = async (encodeur, startDate, endDate) => {
  const query = `
    SELECT 
        cdelog.commande,
        cdelog.encodeur,
        MIN(CONCAT(cdelog.date, ' ', cdelog.heure)) AS heure_debut,
        cde.tothtva,
        cde.tottvac,
        SUM(detail.qte) AS total_quantite,
        SUM(detail.nvantaux) AS total_taux
    FROM 
        cdelog
    JOIN 
        cde ON cdelog.commande = cde.commande
    JOIN 
        detail ON cdelog.commande = detail.commande
    WHERE 
        cdelog.date BETWEEN ? AND ?
        AND cdelog.statut = 100
        AND cdelog.encodeur = ?
        AND cdelog.commande NOT LIKE 'NON%'
    GROUP BY 
        cdelog.commande
    ORDER BY 
        cdelog.date, cdelog.heure;
  `;
  const [rows] = await db.execute(query, [startDate, endDate, encodeur]);
  return rows;
};


// Fonction pour récupérer les temps de traitement sans filtrer par encodeur
const getProcessingTime = async (startDate, endDate) => {
  const query = `
    SELECT 
        cdelog.commande,
        cdelog.encodeur,
        MIN(CONCAT(cdelog.date, ' ', cdelog.heure)) AS heure_debut,
        cde.tothtva,
        cde.tottvac,
        SUM(detail.qte) AS total_quantite,
        SUM(detail.nvantaux) AS total_taux
    FROM 
        cdelog
    JOIN 
        cde ON cdelog.commande = cde.commande
    JOIN 
        detail ON cdelog.commande = detail.commande
    WHERE 
        cdelog.date BETWEEN ? AND ?
        AND cdelog.statut = 100
        AND cdelog.commande NOT LIKE 'NON%'
    GROUP BY 
        cdelog.commande
    ORDER BY 
        cdelog.date, cdelog.heure;
  `;
  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};

const getProcessingTimeForCCommands = async (startDate, endDate) => {
  const query = `
    SELECT 
        cdelog.commande,
        cdelog.encodeur,
        MIN(CONCAT(cdelog.date, ' ', cdelog.heure)) AS heure_debut,
        cde.tothtva,
        cde.tottvac,
        SUM(detail.qte) AS total_quantite,
        SUM(detail.nvantaux) AS total_taux
    FROM 
        cdelog
    JOIN 
        cde ON cdelog.commande = cde.commande
    JOIN 
        detail ON cdelog.commande = detail.commande
    WHERE 
        cdelog.date BETWEEN ? AND ?
        AND cdelog.statut = 100
        AND cdelog.commande LIKE 'C%'
    GROUP BY 
        cdelog.commande
    ORDER BY 
        cdelog.date, cdelog.heure;
  `;
  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};

const getProcessingTimeForSAV = async (startDate, endDate) => {
  const query = `
    SELECT 
        cdelog.commande,
        cdelog.encodeur,
        MIN(CONCAT(cdelog.date, ' ', cdelog.heure)) AS heure_debut,
        cde.tothtva,
        cde.tottvac,
        SUM(detail.qte) AS total_quantite,
        SUM(detail.nvantaux) AS total_taux
    FROM 
        cdelog
    JOIN 
        cde ON cdelog.commande = cde.commande
    JOIN 
        detail ON cdelog.commande = detail.commande
    WHERE 
        cdelog.date BETWEEN ? AND ?
        AND cdelog.statut = 100
        AND cdelog.commande LIKE 'S%'
    GROUP BY 
        cdelog.commande
    ORDER BY 
        cdelog.date, cdelog.heure;
  `;
  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};

const getProcessingTimeForAccess = async (startDate, endDate) => {
  const query = `
    SELECT 
        cdelog.commande,
        cdelog.encodeur,
        MIN(CONCAT(cdelog.date, ' ', cdelog.heure)) AS heure_debut,
        cde.tothtva,
        cde.tottvac,
        SUM(detail.qte) AS total_quantite,
        SUM(detail.nvantaux) AS total_taux
    FROM 
        cdelog
    JOIN 
        cde ON cdelog.commande = cde.commande
    JOIN 
        detail ON cdelog.commande = detail.commande
    WHERE 
        cdelog.date BETWEEN ? AND ?
        AND cdelog.statut = 100
        AND cdelog.commande LIKE 'A%'
    GROUP BY 
        cdelog.commande
    ORDER BY 
        cdelog.date, cdelog.heure;
  `;
  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};

const getProcessingTimeByMonth = async (month) => {
    const query = `
      SELECT 
        cdelog.date AS day,  
        SUM(cde.tottvac) AS totalTVA,
        SUM(cde.tothtva) AS totalHTVA,
        COUNT(DISTINCT cdelog.commande) AS totalCommands
      FROM 
        cdelog
      JOIN 
        cde ON cdelog.commande = cde.commande
      WHERE 
        DATE_FORMAT(cdelog.date, '%Y-%m') = ?
        AND cdelog.statut = 100
        AND cdelog.commande NOT LIKE 'NON%'
      GROUP BY 
        cdelog.date
      ORDER BY 
        cdelog.date;
    `;
  
    const [rows] = await db.execute(query, [month]);
    return rows;
  };


module.exports = { getProcessingTimeByEncodeur, 
    getEncodeurs, 
    getProcessingTime, 
    getProcessingTimeForCCommands, 
    getProcessingTimeForSAV, 
    getProcessingTimeForAccess, 
    getProcessingTimeByMonth };



