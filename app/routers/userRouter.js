const express = require('express');
const router = express.Router();
const multer = require('multer');
const loginController = require('../controllers/loginController');
const { authenticateToken } = require('../middlewares/members');

// Configuration de multer pour gérer l'upload
const upload = multer({ dest: "uploads/" });

// Récupérer un utilisateur par ID
router.get('/:id', loginController.getUserById);

// Récupérer l'utilisateur connecté
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.level;

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || 'https://via.placeholder.com/40',
      role_id: user.role_id, // Inclure le rôle utilisateur dans la réponse
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


// Tentative de connexion
router.post('/', loginController.getConnected);

// Ajouter un membre
router.post('/addUser', loginController.addMember);




module.exports = router;
