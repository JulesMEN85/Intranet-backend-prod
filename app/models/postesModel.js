const dbDashboard = require("../clientDashboard");

// 📌 Récupérer les affectations par défaut
exports.getDefaultAssignments = async () => {
    const query = `
        SELECT 
            DISTINCT bp.name,
            pp.poste_code, 
            bp.id AS personnel_id, 
            semaine,
            SEC_TO_TIME(
                TIME_TO_SEC(STR_TO_DATE(lundi, '%H:%i:%s')) +
                TIME_TO_SEC(STR_TO_DATE(mardi, '%H:%i:%s')) +
                TIME_TO_SEC(STR_TO_DATE(mercredi, '%H:%i:%s')) +
                TIME_TO_SEC(STR_TO_DATE(jeudi, '%H:%i:%s')) +
                TIME_TO_SEC(STR_TO_DATE(vendredi, '%H:%i:%s'))
            ) AS total_heures_disponible
        FROM postes_personnel pp
        JOIN base_personnel bp ON pp.personnel_id = bp.id;

    `;
    const [rows] = await dbDashboard.execute(query);
    
    console.log("✅ Affectations récupérées avec calcul des heures :", rows);
    return rows;
};



// 📌 Enregistrer ou mettre à jour une affectation par défaut
exports.setDefaultAssignment = async (poste_code, personnel_id) => {
    const query = `
        INSERT INTO postes_personnel (poste_code, personnel_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE personnel_id = VALUES(personnel_id)
    `;
    await dbDashboard.execute(query, [poste_code, personnel_id]);
};

// 📌 Récuperer les heures disponibles en fonction de la semaine et du nom 
exports.getPersonnelAvailability = async (name, semaine) => {
    const query = `
        SELECT name, id,
            SEC_TO_TIME(
                SUM(TIME_TO_SEC(STR_TO_DATE(lundi, '%H:%i:%s'))) +
                SUM(TIME_TO_SEC(STR_TO_DATE(mardi, '%H:%i:%s'))) +
                SUM(TIME_TO_SEC(STR_TO_DATE(mercredi, '%H:%i:%s'))) +
                SUM(TIME_TO_SEC(STR_TO_DATE(jeudi, '%H:%i:%s'))) +
                SUM(TIME_TO_SEC(STR_TO_DATE(vendredi, '%H:%i:%s')))
            ) AS total_heures_disponible
        FROM base_personnel
        WHERE name = ? AND semaine = ?
        GROUP BY name, id;
    `;

    try {
        const [rows] = await dbDashboard.execute(query, [name, semaine]);
        console.log("📤 Temps disponible récupéré :", rows); // Vérification
        return rows;
    } catch (error) {
        console.error("❌ Erreur SQL :", error.message);
        throw error;
    }
};


// 📌 Enlever une assignation a un id 
exports.deleteDefaultAssignment = async (poste_code) => {
    const query = `
        DELETE FROM postes_personnel
        WHERE poste_code = ?
    `;
    await dbDashboard.execute(query, [poste_code]);
};

