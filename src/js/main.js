'use strict'
// const { authElems } = require('./constants');
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//Day 1: Authorization


const authButton = document.querySelector('.button-auth');
const authModal = document.querySelector('.modal-auth');
const authClose = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');



const toggleAuthModal = () => {
  authModal.classList.toggle('is-open')
  loginInput.style.borderColor = '';
};
let login = localStorage.getItem('userLogin');


const whenNotAuthorized = () => {
  const logIn = (evt) => {
    evt.preventDefault();
    if (!loginInput.value.trim().length) return loginInput.style.borderColor = 'red';
    login = loginInput.value.trim();
    localStorage.setItem('userLogin', login)
    toggleAuthModal();
    authButton.removeEventListener("click", toggleAuthModal);
    authClose.removeEventListener("click", toggleAuthModal);
    loginForm.removeEventListener("submit", logIn);
    loginForm.reset();
    checkAuth();
  };
  authButton.addEventListener("click", toggleAuthModal);
  authClose.addEventListener("click", toggleAuthModal);
  loginForm.addEventListener("submit", logIn);
};
const whenAuthorized = () => {
  const logOut = (evt) => {
    login = null;
    localStorage.removeItem('userLogin')
    authButton.style.display = '';
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }
  userName.textContent = login;
  authButton.style.display = 'none';
  userName.style.display = "inline";
  buttonOut.style.display = "block";
  buttonOut.addEventListener("click", logOut);
};

const checkAuth = () => {
  if (login) return whenAuthorized();
  return whenNotAuthorized();
}

checkAuth();


//На одно событие несколько ф-й (раньше так делали)
// authButton.onclick = function () { func1(), func2()};