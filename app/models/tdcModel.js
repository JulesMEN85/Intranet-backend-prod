const dbMEN85 = require("../clientMEN85");
const dbDashboard = require("../clientDashboard");

// Utilisation de la base de données MEN85
exports.calculateTauxDeCharge = async (week) => {
    const query = `
        SELECT 
            l.code, 
            l.descriptio, 
            ROUND(SUM(f.quantite * l.sec), 0) AS total_secondes, 
            c.dlivraison
        FROM lin l
        INNER JOIN fen f 
            ON l.commande = f.commande 
            AND l.chassis = f.chassis 
            AND f.typedoc = l.typedoc
        INNER JOIN commande c 
            ON l.commande = c.numero
        WHERE l.typedoc = 'X'
        AND l.type = 2
        AND c.etat NOT IN (100, 200, 398, 900)
        AND DATE_FORMAT(c.dlivraison, '%Y-W%v') = ? -- Filtrer par semaine sélectionnée
        GROUP BY l.code, l.descriptio, c.dlivraison;
    `;

    const [rows] = await dbMEN85.execute(query, [week]);
    return rows;
};


// Utilisation de la base de données Dashboard
exports.getWeeklyPersonnel = async (week) => {
    const query = `
        SELECT 
            id,
            name, 
            lundi, 
            mardi, 
            mercredi, 
            jeudi, 
            vendredi, 
            semaine 
        FROM base_personnel
        WHERE semaine = ? OR semaine IS NULL
    `;

    const [rows] = await dbDashboard.execute(query, [week]); // Connexion à la DB Dashboard
    return rows;
};

exports.assignPosteForWeek = async (id, poste, semaine) => {
    const query = `
        UPDATE base_personnel
        SET 
            poste_1 = CASE 
                WHEN poste_1 IS NULL AND (poste_2 IS NULL OR poste_2 != ?) AND (poste_3 IS NULL OR poste_3 != ?) THEN ?
                ELSE poste_1 
            END,
            poste_2 = CASE 
                WHEN poste_1 IS NOT NULL AND poste_2 IS NULL AND (poste_1 IS NULL OR poste_1 != ?) AND (poste_3 IS NULL OR poste_3 != ?) THEN ?
                ELSE poste_2 
            END,
            poste_3 = CASE 
                WHEN poste_1 IS NOT NULL AND poste_2 IS NOT NULL AND poste_3 IS NULL AND (poste_1 IS NULL OR poste_1 != ?) AND (poste_2 IS NULL OR poste_2 != ?) THEN ?
                ELSE poste_3 
            END
        WHERE id = ? AND semaine = ? AND (
            poste_1 IS NULL OR poste_2 IS NULL OR poste_3 IS NULL
        )
    `;

    try {
        const [result] = await dbDashboard.execute(query, [
            poste, poste, poste, 
            poste, poste, poste, 
            poste, poste, poste, 
            id, semaine
        ]);
        
        console.log("Résultat SQL :", result);

        if (result.affectedRows === 0) {
            throw new Error("Aucune colonne disponible ou poste déjà attribué.");
        }

        return result;
    } catch (error) {
        console.error("Erreur SQL :", error.message);
        throw error;
    }
};

// récupére tout les postes 
exports.getAllUniquePostes = async () => {
    const query = `
        SELECT DISTINCT code, descriptio
        FROM lin 
        WHERE TYPE = 2
    `;

    try {
        const [rows] = await dbMEN85.execute(query);
        console.log("📤 Postes uniques récupérés :", rows);
        return rows;
    } catch (error) {
        console.error("❌ Erreur SQL :", error.message);
        throw error;
    }
};

// récupére tout les personnel DISTINCTEMENT 
exports.getAllUniquePersonnel = async () => {
    const query = `
        SELECT DISTINCT id AS personnel_id, name
        FROM base_personnel
    `;

    try {
        const [rows] = await dbDashboard.execute(query);
        console.log("📤 Personnel unique récupéré :", rows); // Vérification
        return rows;
    } catch (error) {
        console.error("❌ Erreur SQL :", error.message);
        throw error;
    }
};










