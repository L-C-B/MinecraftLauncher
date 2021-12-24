// Import of Modules.
const { app, ipcMain, BrowserWindow} = require("electron");
const path = require("path");
const { Client, Authenticator } = require("minecraft-launcher-core");
const Launcher = new Client();
const fs = require("fs");
const msmc = require("msmc");
const ipc = require("electron").ipcRenderer;
const fetch = require("node-fetch");

// Building the mainWindow.
let mainWindow;
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
    console.log("- The mainWindow has been created");
  });
  // Building the SplashScreen.
  function ShowApp() {
    mainWindow.show()
    splash.close();
  };
  splash = new BrowserWindow({
    width: 300, 
    icon: path.join(__dirname, "/assets/images/logo.png"),
    height: 400, 
    frame: false, 
    alwaysOnTop: true, 
    transparent: true
  });
  splash.loadFile(path.join(__dirname, 'assets/app/html/splash.html'));
  console.log("- The Splash sreen has been created");
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

// Mojang Login with Identifiers.
ipcMain.on('LoginMojang',(evt, data) => {
  Authenticator.getAuth(data.user, data.pass)
  .then((user) => {
    mainWindow.loadFile(path.join(__dirname, 'assets/app/html/app.html')).then(() => {
      mainWindow.webContents.send('user', user);
      console.log('\n Pseudo - ' + user.name + "\n")
      mainWindow.webContents.send('MojangTokens')
    });
  }).catch(() => { 
    evt.sender.send('err', 'Mauvais identifiants');
  });
});
// Login Mojang with tokens.
ipcMain.on('LoginMojangToken', (evt, data) => {
  Authenticator.getAuth(data.access_token, data.client_token)
  .then((user) => {
    mainWindow.loadFile(path.join(__dirname, 'assets/app/html/app.html')).then(() => {
      mainWindow.webContents.send('user', user);
      console.log('\n Pseudo - ' + user.name + "\n");
    });
  }).catch(() => { 
    evt.sender.send('err', 'Tokens expirés');
  });
});
// Login with Microsoft account.
ipcMain.on('LoginMicrosoft', (evt, data) => {
    msmc.setFetch(fetch);
    msmc.fastLaunch("electron", (update) => {
      console.log(update);
    }).then(call => {
      if(msmc.errorCheck(call)) {
        evt.sender.send("err", "Erreur lors de la connexion") 
        return;
      };
      console.log(call)
      var accessToken = call.access_token;
      var profile = call.profile;
      mainWindow.loadFile(path.join(__dirname, 'assets/app/html/app.html')).then(() => {
      mainWindow.webContents.send('user', profile);
      mainWindow.webContents.send('accessToken', accessToken);
      console.log('\n Pseudo - ' + profile.name + "\n");
    });
  });
});
// When the game launch.
ipcMain.on('Play', (evt, data) => {
  let AppData = app.getPath("appData")
  if(!data.version) {
    data.version = "1.14.4"; // Default Version.
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
  .catch(() => {
    evt.sender.send("err", "Erreur lors du lancement")
  });
  evt.sender.send("msg", "Minecraft・Lancement du Jeu en cours.")
  Launcher.on('debug', (e) => console.log(e))
  Launcher.on('data', (e) => console.log(e));
});
// Logout.
ipcMain.on('logout', (evt, user) => {
  mainWindow.loadFile(path.join(__dirname, 'assets/app/html/login.html'))
    .catch(() => {
      evt.sender.send('err', 'Erreur lors de la déconnexion');
    });
  });