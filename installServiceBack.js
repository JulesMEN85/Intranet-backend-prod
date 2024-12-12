var Service = require('node-windows').Service;

// Création du service
var svc = new Service({
  name: 'backendNode',
  description: 'My Node.js application as a Windows service.',
  script: 'E:\\Intranet\\backend-prod\\index.js',
  env: [
    {
      name: "PM2_HOME",
      value: "C:\\ProgramData\\pm2"
    },
    {
      name: "NODE_ENV",
      value: "production" // Indique que l'environnement est en production
    }
  ]
});

// Log lors de l'installation du service
svc.on('install', function() {
  console.log('Service "backendNode" installé avec succès.');
  console.log('Tentative de démarrage du service...');
  svc.start();
});

// Log lors du démarrage du service
svc.on('start', function() {
  console.log('Service "backendNode" démarré avec succès.');
});

// Log si le service est déjà installé
svc.on('alreadyinstalled', function() {
  console.log('Le service "backendNode" est déjà installé.');
});

// Log pour toute erreur lors de l'installation ou du démarrage
svc.on('error', function(err) {
  console.error('Erreur avec le service "backendNode" :', err);
});

// Log lors de la désinstallation
svc.on('uninstall', function() {
  console.log('Service "backendNode" désinstallé avec succès.');
});

// Log si le service existe encore après une tentative de désinstallation
svc.on('exists', function() {
  console.log('Le service "backendNode" existe déjà.');
});

// Installation du service
console.log('Installation du service "backendNode"...');
svc.install();
