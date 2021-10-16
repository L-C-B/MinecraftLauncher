// Importation des Modules.
const custombar = require("custom-electron-titlebar");
const ipc = require("electron").ipcRenderer;
const iziToast = require('izitoast');

// Ram & Version
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
function saveOptions() {
  iziToast.success({
      title: 'Succès !',
      message: 'Les paramètres sont sauvegardés.',
  });
  ipc.send("SaveSettings", {
      min: '1G',
      max: localStorage.getItem("ram"),
      width: '854',
      height: '480',
      version: localStorage.getItem("version"),
  });
};
// Title Bar.
let bar = new custombar.Titlebar({
  menu: null,
  backgroundColor: custombar.Color.TRANSPARENT,
  maximizable: false
});