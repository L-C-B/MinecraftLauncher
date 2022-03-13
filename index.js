// Importation des Modules.
const { app, ipcMain, BrowserWindow} = require("electron");
const path = require("path");
const { Client, Authenticator } = require("minecraft-launcher-core");
const Launcher = new Client();
const fs = require("fs");
const msmc = require("msmc");
const ipc = require("electron").ipcRenderer;
const fetch = require("node-fetch");

// Création de la fenêtre principale.
let mainWindow;
let AppData = app.getPath("appData")
function ShowApp() {
  mainWindow.show()
  splash.close();
};
function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Minecraft Launcher",
    icon: path.join(__dirname, "/assets/images/logo.png"),
    width: 980,
    maxWidth: 980,
    minWidth: 980,
    height: 530,
    maxHeight: 530,
    minHeight: 530,
    show: false,
    titleBarStyle: "hidden",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "assets/app/html/login.html")).then(() => {
    console.log("> La mainWindow vient de se contruire.");
  });
  /* For open dev tools (bobsonic)
  mainWindow.webContents.openDevTools()  
  */
  // Création du Splash Screen.
  splash = new BrowserWindow({width: 300, icon: path.join(__dirname, "/assets/images/logo.png") ,height: 400, frame: false, alwaysOnTop: true, transparent: true});
  splash.loadFile(path.join(__dirname, 'assets/app/html/splash.html'));
  console.log("> Le SplashScreen vient de se contruire.");
  mainWindow.once('ready-to-show', () => {
   setTimeout(ShowApp, 2900);
  });
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function () {
  if(process.platform !== "darwin") app.quit();
});

// Login Mojang avec les Identifiants.
ipcMain.on('LoginMojang',(evt, login) => {
  Authenticator.getAuth(login.user, login.pass)
  .then((user) => {
    mainWindow.loadFile(path.join(__dirname, 'assets/app/html/app.html')).then(() => {
      mainWindow.webContents.send('user', user);
      console.log('\n > Pseudo - ' + user.name + "\n")
      mainWindow.webContents.send('mojangTokens')
    });
  }).catch(() => { 
    evt.sender.send('err', 'Mauvais identifiants');
  });
});
// Login Mojang avec les tokens de connexions.
ipcMain.on('LoginMojangToken', (evt, data) => {
  Authenticator.getAuth(data.access_token, data.client_token)
  .then((user) => {
    mainWindow.loadFile(path.join(__dirname, 'assets/app/html/app.html')).then(() => {
      mainWindow.webContents.send('user', user);
      console.log('\n > Pseudo - ' + user.name + "\n");
    });
  }).catch(() => { 
    evt.sender.send('err', 'Tokens expirés');
  });
});
// Login Microsoft.
ipcMain.on('LoginMicrosoft', (evt, data) => {
    msmc.setFetch(fetch);
    msmc.fastLaunch("electron", (update) => {
      console.log(update);
    }).then(call => {
      if(msmc.errorCheck(call)) {
        evt.sender.send("err", "Erreur lors de la connexion");
        console.error(call.reason);
        return;
      };
      console.log(call)
      var accessToken = call.access_token;
      var profile = call.profile;
      mainWindow.loadFile(path.join(__dirname, 'assets/app/html/app.html')).then(() => {
      mainWindow.webContents.send('user', profile);
      mainWindow.webContents.send('accessToken', accessToken);
      console.log('\n > Pseudo - ' + profile.name + "\n");
    });
  });
});
// Quand le jeu se lance.
ipcMain.on('Play', (evt, data) => {
  if(!data.version) {
    data.version = "1.14.4"; // Version par défaut.
  };
  if(!data.ram) {
    data.ram = "1G";
  };
  let Options = {
    clientPackage: null,
    authorization: msmc.getMCLC().getAuth(data.user) || Authenticator.refreshAuth(data.user.access_token, data.user.client_token), // Microsoft & Mojang
    root: `${AppData}/.minecraftlauncher/`,
    version: {
      number: data.version,
      type: "release"
    },
    memory: {
      max: data.ram,
      min: data.ram,
    },
    window: {
      width: "854",
      height: "480"
    },
  };
  Launcher.launch(Options)
  .catch((err) => {
    evt.sender.send("err", "Erreur lors du lancement");
    console.error(err);
  });
  evt.sender.send("msg", "Minecraft・Lancement du Jeu en cours.")
  Launcher.on('debug', (e) => console.log(e));
  Launcher.on('data', (e) => console.log(e));
});
// Déconnexion.
ipcMain.on('logout', (evt, user) => {
  mainWindow.loadFile(path.join(__dirname, 'assets/app/html/login.html'))
    .catch(() => {
      console.log()
      evt.sender.send('err', 'Erreur lors de la déconnexion');
    });
  });