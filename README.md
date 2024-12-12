#### Installer node-windows depuis le dossier du projet (a faire pour chaque projet) :

```bash
npm link node-windows
```

#### Créez un script JavaScript pour définir et installer le service. Par exemple, créez un fichier installServiceBack.js avec le contenu suivant :

```javascript
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

```

#### Exécuter le script pour installer le Service :
```bash
node installServiceBack.js
```

#### Supprimer un processus (service windows) :

#### Créez un script JavaScript pour définir et supprimer le service. Par exemple, créez un fichier deleteServiceBack.js avec le contenu suivant :

```javascript
var Service = require('node-windows').Service;

var svc = new Service({
  name: 'backendNode',
  script: 'D:\\intranet\\backend\\index.js',
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
```

#### Exécuter le script pour supprimer le Service :
```bash
node deleteServiceBack.js
```

***Le service a bien été supprimer.***

Note: Ne pas oublier d'utiliser pm2
- A la racine du projet:
```powershell
pm2 install <le nom du fichier, index.js par exemple>
pm2 start <le nom du fichier>
pm2 save
```


#### Roles ####

1 = Accès total (Lallemant + CML + Cola)
2 = Tout Lallemant
3 = Accès CML
4 = Accès Lallemant + CML
5 = Accès uniquement aux parties visible comme en tant qu'user non connecter
