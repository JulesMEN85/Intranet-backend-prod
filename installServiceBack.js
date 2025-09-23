var Service = require('node-windows').Service;

var svc = new Service({
  name: 'backendNode',
  description: 'My Node.js application as a Windows service.',
  script: 'D:\\intranet\\backend\\index.js',
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

svc.on('install', function() {
  svc.start();
});

svc.install();