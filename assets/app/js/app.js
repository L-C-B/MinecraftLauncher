// Importation des Modules.
const ipc = require("electron").ipcRenderer;
const custombar = require("custom-electron-titlebar");
const shell = require("electron").shell;

// Variables Globales.
let site = document.getElementById("site");
let skin = document.getElementById("skin");
let deco = document.getElementById("deco");
let playbtn = document.getElementById("play");
let discord = document.getElementById("discord")
let github = document.getElementById("github");
// Title Bar.
let bar = new custombar.Titlebar({
menu: null,
backgroundColor: custombar.Color.fromHex("#161616"),
});

// Lorsque l'utilisateur clique sur le bouton de Déconnexion.
deco.addEventListener("click", () => {
  localStorage.clear()
  deco.disabled = true;
  ipc.send("logout", JSON.parse(localStorage.getItem("user")));
});
// Liens (Discord, Site, GitHub).
site.addEventListener("click", () => {
  site.disabled = false;
  event.preventDefault();
  shell.openExternal("http://spectreclient.fr/");
});
github.addEventListener("click", () => {
  site.disabled = false;
  event.preventDefault();
  shell.openExternal("https://github.com/L-C-B");
});
discord.addEventListener("click", () => {
  discord.disabled = false;
  event.preventDefault();
  shell.openExternal("https://discord.gg/qHwGDUN");
});

// Quand l'utilisateur s'est connecté avec un compte Microsoft.
ipc.on("profile",(evt, user) => {
  localStorage.setItem("profile", JSON.stringify(user));
  skin.src = `https://minotar.net/avatar/${user.name}/100.png`;
  playbtn.addEventListener('click', () => {
    playbtn.classList.add('buttonLoading');
    playbtn.disabled = true;
    ipc.send("PlayMicrosoft", JSON.parse(localStorage.getItem("user"))); 
  });
});
// Quand l'utilisateur s'est connecté un compte Mojang.
ipc.on("user",(evt, user) => {
  localStorage.setItem("user", JSON.stringify(user));
  skin.src = `https://minotar.net/avatar/${user.name}/100.png`;
  playbtn.addEventListener('click', () => {
  event.preventDefault();
  playbtn.disabled = true;
  ipc.send("PlayMojang", JSON.parse(localStorage.getItem("user"))); 
});
});