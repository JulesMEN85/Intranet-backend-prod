require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role }, // Payload
    process.env.TOKEN_SECRET, // Clé secrète
    { expiresIn: "1h" } // Expiration
  );
};

// Informations utilisateur simulées
const user = {
  id: 4, // ID de l'utilisateur
  role: "Admin", // Rôle de l'utilisateur
};

try {
  const token = generateAccessToken(user);
  console.log("Token JWT généré :");
  console.log(token);
} catch (error) {
  console.error("Erreur lors de la génération du token :", error.message);
}
