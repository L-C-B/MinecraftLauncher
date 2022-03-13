// Importation des Modules.
const custombar = require("custom-electron-titlebar");
const ipc = require("electron").ipcRenderer;
const iziToast = require('izitoast');

// Title Bar.
let bar = new custombar.Titlebar({
  menu: null,
  backgroundColor: custombar.Color.TRANSPARENT,
  maximizable: false
});
document.querySelectorAll(".window-maximize")[0].parentElement.remove()
// Lorsque l'utilisateur clique sur le bouton Microsoft.
function loginMS(element) {
  element.classList.add('buttonLoading');
  ipc.send("LoginMicrosoft");
}
// Lorsque l'utilisateur tente de se connecter avec Mojang.
ipc.on("err", (event, errorMessage) => {
    document.querySelectorAll('#IIiiii')[0].classList.remove("buttonLoading")
});

if(localStorage.getItem('tokens')) { // En Développement.
    // Login Mojang avec les tokens.
    ipc.send('LoginMojangToken', JSON.parse(localStorage.getItem('user')));
};