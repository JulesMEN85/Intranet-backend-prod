const ArticleModel = require('../models/ArticleModel');

const ArticleController = {
    getArticlesByLetter: async (req, res) => {
        const { letters, articleCode, stockManagement, supplierRef, supplierCode } = req.query;

        if (!letters) {
            return res.status(400).json({ error: "Missing letters parameter" });
        }

        const letterArray = letters.split(",");

        const filters = {
            articleCode: articleCode || null,
            stockManagement: stockManagement || null,
            supplierRef: supplierRef || null,
            supplierCode: supplierCode || null,
        };

        try {
            const articles = await ArticleModel.getArticlesByLetters(letterArray, filters);
            res.status(200).json({ data: articles });
        } catch (err) {
            console.error("Error fetching articles by letters and filters:", err);
            res.status(500).json({ error: "An error occurred while fetching articles" });
        }
    },
};

module.exports = ArticleController;
