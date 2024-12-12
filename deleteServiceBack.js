var Service = require('node-windows').Service;

var svc = new Service({
  name: 'backendNode',
  script: 'E:\\Intranet\\backend-prod\\index.js', // Chemin du script
  env: {
    name: "PM2_HOME",
    value: "C:\\ProgramData\\pm2"
  }
});

svc.on('uninstall', function() {
  console.log('Service uninstalled');
  console.log('The service exists: ',svc.exists);
});

svc.uninstall();