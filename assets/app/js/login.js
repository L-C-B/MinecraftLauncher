// Import of Modules.
const custombar = require("custom-electron-titlebar");
const ipc = require("electron").ipcRenderer;
const iziToast = require('izitoast');

// Global Variables.
let inputPseudo = document.getElementById("pseudo");
let inputMdp = document.getElementById("mdp");
let LoginMojang = document.getElementById("LoginMojang");
let LoginMicrosoft = document.getElementById("LoginMicrosoft");
// Title Bar.
let bar = new custombar.Titlebar({
  menu: null,
  backgroundColor: custombar.Color.TRANSPARENT,
  maximizable: false
});
document.querySelectorAll(".window-maximize")[0].parentElement.remove()
// When the user clicks the Microsoft button.
LoginMicrosoft.addEventListener("click", () => {
  LoginMojang.classList.add('buttonLoading');
  ipc.send("LoginMicrosoft");
});
// When the user tries to login with the Mojang account.
LoginMojang.addEventListener("click",() => {
  LoginMojang.classList.add('buttonLoading');
  if(inputPseudo.value && inputMdp.value) {
    LoginMojang.disabled = true;
    ipc.send("LoginMojang", {
      user: inputPseudo.value,
      pass: inputMdp.value
   });
  };
  if(!inputPseudo.value && !inputMdp.value) {
    LoginMojang.disabled = false,
    setTimeout(()=> {
      iziToast.info({
        message: "Veuillez entrer vos identifiants",
        transitionIn: "fadeInDown",
      });
      LoginMojang.classList.remove("buttonLoading");
    }, 500);
  };
});
ipc.on("err", (event, errorMessage) => {
  setTimeout(() => {
    iziToast.error({
      id: "error",
      title: "Erreur",
      message: errorMessage,
      position: "bottomRight",
    });
      LoginMojang.classList.remove("buttonLoading");
    }, 1200);
    LoginMojang.disabled = false;
  });
  if(localStorage.getItem('MojangTokens')) {
    // Login Mojang with tokens.
    ipc.send('LoginMojangToken', JSON.parse(localStorage.getItem('user')));
  };