const { getPSLorder } = require('../models/pslModel');

const fetchPSLOrders = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required.' });
        }

        const orders = await getPSLorder(startDate, endDate);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error in fetchPSLOrders:', error);
        res.status(500).json({ error: 'An error occurred while fetching PSL orders.' });
    }
};

module.exports = {
    fetchPSLOrders,
};
