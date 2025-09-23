const UserModel = require("../models/userModel");
const { generateAccessToken } = require("../middlewares/members");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.getConnected = async (request, response, next) => {
  try {
    const data = request.body;

    if (!data.password || !data.email) {
      return response.status(400).json({ error: "Email et mot de passe requis" });
    }

    const user = await UserModel.showData(data);
    if (!user) {
      return response.status(403).json({ error: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return response.status(403).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = generateAccessToken({ id: user.id });
    response.status(200).json({ token, userLevel: user.role_id });
  } catch (error) {
    console.trace(error);
    response.status(500).json({ error: "Erreur serveur, veuillez contacter un administrateur" });
  }
};

exports.addMember = async (request, response, next) => {
  try {
    const data = request.body;
    if (!data.email || !data.password || !data.roleId) {
      return response.status(400).json({ error: "Données manquantes" });
    }

    data.password = await bcrypt.hash(data.password, saltRounds);
    const member = await UserModel.addUser(data);

    if (!member) {
      return response.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }

    response.status(200).json({ message: member });
  } catch (error) {
    console.trace(error);
    response.status(500).json({ error: "Erreur serveur, veuillez contacter un administrateur" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID reçu dans la requête :", id);

    const user = await UserModel.showDataById(id);

    if (!user) {
      console.log("Aucun utilisateur trouvé pour l'ID :", id);
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.trace(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

