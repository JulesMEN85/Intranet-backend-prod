const db = require('../clientDashboard');

const PlanningModel = {
    // Récupérer les personnels de base
    getBasePersonnel: async () => {
        const [rows] = await db.query(`SELECT * FROM base_personnel`);
        return rows;
    },

    // Ajouter un personnel de base
    addBasePersonnel: async (name, lundi, mardi, mercredi, jeudi, vendredi, semaine) => {
        console.log("Insertion dans la table base_personnel :", {
            name,
            lundi,
            mardi,
            mercredi,
            jeudi,
            vendredi,
            semaine,
        });
    
        const [result] = await db.query(
            `
            INSERT INTO base_personnel (name, lundi, mardi, mercredi, jeudi, vendredi, semaine)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [name, lundi, mardi, mercredi, jeudi, vendredi, semaine]
        );
        return result.insertId;
    },
    


    // Mettre à jour un personnel de base
    updateBasePersonnel: async (id, name, lundi, mardi, mercredi, jeudi, vendredi) => {
        const [result] = await db.query(
            `UPDATE base_personnel
             SET name = ?, lundi = ?, mardi = ?, mercredi = ?, jeudi = ?, vendredi = ?
             WHERE id = ?`,
            [name, lundi || "00:00", mardi || "00:00", mercredi || "00:00", jeudi || "00:00", vendredi || "00:00", id]
        );
        return result;
    },

    // Supprimer un personnel de base
    deleteBasePersonnel: async (id) => {
        const [result] = await db.query(`DELETE FROM base_personnel WHERE id = ?`, [id]);
        return result;
    },

    // Récupérer le planning hebdomadaire basé sur la semaine donnée
    getWeeklyPlanning: async (semaine) => {
        const query = `
            SELECT *
            FROM base_personnel
            WHERE semaine = ? OR semaine IS NULL
            ORDER BY CASE WHEN semaine IS NULL THEN 1 ELSE 0 END
        `;
        const [rows] = await db.query(query, [semaine]);
        return rows;
    },

    // Générer un planning hebdomadaire à partir du personnel de base
    generateWeeklyPlanning: async (semaine) => {
        const [basePersonnel] = await db.query(`SELECT * FROM base_personnel WHERE semaine IS NULL`);
        if (!basePersonnel.length) {
            throw new Error("Aucun personnel de base défini pour toutes les semaines.");
        }

        const insertValues = basePersonnel.map((personnel) => [
            personnel.name,
            personnel.lundi,
            personnel.mardi,
            personnel.mercredi,
            personnel.jeudi,
            personnel.vendredi,
            semaine,
        ]);

        const query = `
            INSERT INTO base_personnel (name, lundi, mardi, mercredi, jeudi, vendredi, semaine)
            VALUES ?
        `;
        await db.query(query, [insertValues]);
    },

    // Vérifier si un planning de base existe
    validateBasePersonnel: async () => {
        const [rows] = await db.query(`SELECT COUNT(*) as count FROM base_personnel`);
        if (rows[0].count === 0) {
            throw new Error("Aucun personnel de base défini.");
        }
    },
};

module.exports = PlanningModel;
