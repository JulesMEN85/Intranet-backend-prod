// controllers/tdcController.js

const getTauxDeChargePage = (req, res) => {
    res.status(200).json({ message: "Bienvenue sur la page Taux de charge" });
};

module.exports = { getTauxDeChargePage };
