require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");

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
const statscomptaRouter = require('./app/routers/statscomptaRouter');
const paletteRouter = require('./app/routers/paletteRouter');
const pslRouter = require('./app/routers/pslRouter'); 
const QuantiteAchatRouter = require('./app/routers/QuantiteAchatRouter');
const postesRouter = require('./app/routers/postesRouter'); 
const systemesRouter = require("./app/routers/systemesRouter");
const editRemiseRouter = require('./app/routers/editRemiseRouter');
const familleRemiseRouter = require("./app/routers/familleRemiseRouter")


const app = express();
const port = process.env.PORT || 4000;

// Middleware pour gérer les autorisations CORS
app.use(
  cors({
    origin: process.env.ORIGIN_ALLOWED || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware pour parser les données JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour loguer les requêtes
app.use(morgan("dev"));

// Middleware personnalisé pour loguer les détails des requêtes
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// 📂 Middleware pour servir les fichiers depuis le dossier Attachments
app.use('/attachments', express.static('\\\\srv-winpro\\Winpro Prod\\Attachments'));

// 📊 Déclaration des routeurs
app.use("/api/user", userRouter);
app.use("/dashboard", dashboardRouter);
app.use("/commande", cdeachatRouter);
app.use("/api", tdcRouter);
app.use("/api/personnel", personnelRouter);
app.use("/api/planning", planningRouter);
app.use('/api/remises', remiseClientRouter);
app.use('/api/representants', representantRouter);
app.use('/api/encodeurs', encodeurRouter);
app.use('/api/articles', articleRouter);
app.use('/api', statscomptaRouter);
app.use('/api/palette', paletteRouter); 
app.use('/api/psl', pslRouter);
app.use('/api/panels', QuantiteAchatRouter);
app.use("/api/postes", postesRouter);
app.use("/api/systemes", systemesRouter);
app.use("/api/remise", editRemiseRouter);
app.use("/api/family", familleRemiseRouter)


// 🚀 Lancement du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
