const dbDashboard = require("../clientDashboard");

// 📌 Récupérer les affectations pour une semaine donnée
exports.getWeeklyAssignments = async (semaine, annee) => {
    const query = `
        SELECT pph.poste_code, bp.id as personnel_id, bp.name
        FROM postes_personnel_historique pph
        JOIN base_personnel bp ON pph.personnel_id = bp.id
        WHERE pph.semaine = ? AND pph.annee = ?
    `;
    const [rows] = await dbDashboard.execute(query, [semaine, annee]);
    return rows;
};

// 📌 Enregistrer ou mettre à jour une affectation pour une semaine spécifique
exports.setWeeklyAssignment = async (poste_code, personnel_id, semaine, annee) => {
    const query = `
        INSERT INTO postes_personnel_historique (poste_code, personnel_id, semaine, annee)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE personnel_id = VALUES(personnel_id)
    `;
    await dbDashboard.execute(query, [poste_code, personnel_id, semaine, annee]);
};
