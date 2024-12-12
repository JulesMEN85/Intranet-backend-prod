require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dashboardRouter = require("./app/routers/dashboardRouter");
const userRouter = require("./app/routers/userRouter");
const cdeachatRouter = require("./app/routers/cdeachatRouter");
const tdcRouter = require("./app/routers/tdcRouter");
const personnelRouter = require("./app/routers/personnelRouter");
const planningRouter = require("./app/routers/planningRouter");
const remiseClientRouter = require('./app/routers/remiseclientRouter');
const representantRouter = require('./app/routers/representantRouter');
const encodeurRouter = require('./app/routers/encodeurRouter');
const articleRouter = require('./app/routers/articleRouter');

// Configuration des origines autorisées
const allowedOrigins = process.env.ORIGIN_ALLOWED
  ? process.env.ORIGIN_ALLOWED.split(",")
  : ["http://localhost:3000", "http://192.168.1.18:3000"];

console.log("Origines autorisées :", allowedOrigins);

const app = express();
const port = process.env.PORT || 4000;

// Middleware pour gérer les autorisations CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (ex : outils comme Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Origine non autorisée :", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Gérer explicitement les pré-requêtes OPTIONS
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Middleware pour parser les données JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour loguer les requêtes
app.use(morgan("dev"));

// Middleware personnalisé pour loguer les détails des requêtes
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  console.log("Headers :", req.headers);
  next();
});

// Déclaration des routeurs
app.use("/api/user", userRouter);
app.use("/dashboard", dashboardRouter);
app.use("/commande", cdeachatRouter);
app.use("/tdcmen", tdcRouter);
app.use("/api/personnel", personnelRouter);
app.use("/api/planning", planningRouter);
app.use('/api/remises', remiseClientRouter);
app.use('/api/representants', representantRouter);
app.use('/api/encodeurs', encodeurRouter);
app.use('/api/articles', articleRouter);

// Gérer les routes inexistantes (404)
app.use((req, res) => {
  console.error(`Route non trouvée : ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
