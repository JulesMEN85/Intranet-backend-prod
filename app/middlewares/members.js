const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Génération du token
exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "365d" });
};

// Middleware pour forcer la connexion
exports.authenticateToken = async (request, response, next) => {
  const token = request.headers["authorization"] && request.headers["authorization"].split(" ")[1];

  if (token == null) {
    console.log("Aucun token reçu");
    return response.status(401).json("Vous n'êtes pas connecté");
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
    if (err) {
      console.log("Erreur lors de la vérification du token :", err);
      return response.status(403).json("Votre token a expiré ou est invalide. Veuillez vous reconnecter.");
    }

    try {
      console.log("Token décodé :", decodedToken);

      const user = await User.showDataById(decodedToken.id);
      if (!user) {
        console.log("Utilisateur introuvable :", decodedToken.id);
        return response.status(404).json("Utilisateur non trouvé");
      }

      console.log("Utilisateur trouvé :", user);

      // Ajouter toutes les informations pertinentes à request.level
      request.level = {
        id: user.id,
        email: user.email,
        role_id: user.role_id, // Ajoutez le rôle
        name: user.name,
        avatar: user.avatar,
      };
      next();
    } catch (error) {
      console.trace(error);
      return response.status(500).json("Erreur interne du serveur");
    }
  });
};


// Middleware pour vérifier l'ID de l'utilisateur sans bloquer l'accès
exports.controlIfToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return next();

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
    if (err) return next();

    request.user = decodedToken.id;
    next();
  });
};
