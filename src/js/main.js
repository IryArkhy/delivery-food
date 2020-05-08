'use strict'

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const authButton = document.querySelector('.button-auth');
const authModal = document.querySelector('.modal-auth');
const authClose = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu')

let login = localStorage.getItem('userLogin');

function toggleModal() {
  modal.classList.toggle("is-open");
}
const toggleAuthModal = () => {
  authModal.classList.toggle('is-open');
  loginInput.style.borderColor = '';
};

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
    localStorage.removeItem('userLogin');
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

const createCardRestaurant = () => {
  const card = `
  <a class="card card-restaurant">
      <img src="img/tanuki/preview.jpg" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Тануки</h3>
        <span class="card-tag tag">60 мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 1 200 ₽</div>
        <div class="category">Суши, роллы</div>
      </div>
    </div>
  </a>
`;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

createCardRestaurant();
createCardRestaurant();

const createGoodCard = () => {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend',
    `
						<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Классика</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина,
									салями,
									грибы.
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">510 ₽</strong>
							</div>
						</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

const openGoods = ({ target }) => {
  const restaurant = target.closest('.card-restaurant');
  if (!restaurant) return;
  containerPromo.classList.add('hide');
  restaurants.classList.add('hide');
  menu.classList.remove('hide');
  cardsMenu.textContent = '';
  createGoodCard();
}
const returnToMain = () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', returnToMain);
