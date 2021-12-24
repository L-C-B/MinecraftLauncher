// Import of Modules.
const ipc = require("electron").ipcRenderer;
const custombar = require("custom-electron-titlebar");
const shell = require("electron").shell;

// Global Variables.
let skin = document.getElementById("skin");
let deco = document.getElementById("deco");
let playbtn = document.getElementById("play");
let settings = document.getElementById("options");
let modal = document.getElementById("modal");
let save = document.getElementById("save");
// Title Bar.
let bar = new custombar.Titlebar({
  menu: null,
  backgroundColor: custombar.Color.fromHex("#161616"),
  maximizable: false
});
document.querySelectorAll(".window-maximize")[0].parentElement.remove()

// When the user clicks on the Logout button.
deco.addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  deco.disabled = true;
  ipc.send("logout", JSON.parse(localStorage.getItem("user")));
});
settings.addEventListener("click", () => {
  ipc.send("OpenSettingsPage");
});

ipc.on("accessToken",(evt, data) => {
  localStorage.setItem("accessToken", JSON.stringify(data));
});
// When the user has logged in.
ipc.on("user",(evt, user) => {
  localStorage.setItem("user", JSON.stringify(user));
  skin.src = `https://minotar.net/avatar/${user.name}/100.png`;
  playbtn.addEventListener('click', () => {
    playbtn.disabled = true;
    playbtn.classList.add("buttonLoading")
    ipc.send("Play", {
      user: JSON.parse(localStorage.getItem("user")),
      version: localStorage.getItem("version"),
      ram: localStorage.getItem("ram")
    }); 
  });
});
function getRam() {
  let ramlist = document.getElementById('ram')
  let ramselect = ramlist.options[ramlist.selectedIndex].text
  localStorage.setItem('ram', ramselect);
};
function getVersion() {
  let versionlist = document.getElementById('version')
  let versionselect = versionlist.options[versionlist.selectedIndex].text
  localStorage.setItem('version', versionselect);
};

settings.onclick = function() {
  modal.style.display = "block";
}
save.onclick = function() {
  modal.style.display = "none";
};
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
