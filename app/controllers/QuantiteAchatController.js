const { end } = require('../clientMEN85');
const { getPanelQuantity } = require('../models/QuantiteAchatModel');

const fetchPanelQuantity = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                error: 'Veuillez entrer une date de début et une date de fin.'
            });
        }

        const quantities = await getPanelQuantity(startDate, endDate);
        res.status(200).json(quantities);
    } catch (error) {
        console.error('Erreur lors de la récupération des quantités de panneaux (dans le controleur):', error);
        res.status(500).json({ error: 'Une erreur est survenue en essayant de récupérer les quantités de panneaux.' });
    }
};

module.exports = {
    fetchPanelQuantity,
};
