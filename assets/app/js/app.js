// Importation des Modules.
const ipc = require("electron").ipcRenderer;
const custombar = require("custom-electron-titlebar");
const shell = require("electron").shell;

// Variables Globales.
let skin = document.getElementById("skin");
let deco = document.getElementById("deco");
let playbtn = document.getElementById("play");
let settings = document.getElementById("options");
// Title Bar.
let bar = new custombar.Titlebar({
  menu: null,
  backgroundColor: custombar.Color.fromHex("#161616"),
  maximizable: false
});
document.querySelectorAll(".window-maximize")[0].parentElement.remove()

// Lorsque l'utilisateur clique sur le bouton de Déconnexion.
deco.addEventListener("click", () => {
  localStorage.clear()
  deco.disabled = true;
  ipc.send("logout", JSON.parse(localStorage.getItem("user")));
});
settings.addEventListener("click", () => {
  ipc.send("OpenSettingsPage");
});

ipc.on("accessToken",(evt, data) => {
  localStorage.setItem("accessToken", JSON.stringify(data));
});
// Quand l'utilisateur s'est connecté.
ipc.on("user",(evt, user) => {
  localStorage.setItem("user", JSON.stringify(user));
  skin.src = `https://minotar.net/avatar/${user.name}/100.png`;
  playbtn.addEventListener('click', () => {
    playbtn.disabled = true;
    playbtn.classList.add("buttonLoading")
    ipc.send("Play", JSON.parse(localStorage.getItem("user"))); 
  });
});