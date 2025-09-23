const { getCommandes } = require('../models/paletteModel');

const fetchCommandes = async (req, res) => {
    const { week, zone } = req.query;

    try {
        const commandes = await getCommandes(week, zone);
        res.status(200).json(commandes);
    } catch (error) {
        console.error('Erreur lors de la récupération des palettes :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

module.exports = {
    fetchCommandes,
};
