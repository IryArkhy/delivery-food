'use strict'

const cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  authButton = document.querySelector('.button-auth'),
  authModal = document.querySelector('.modal-auth'),
  authClose = document.querySelector('.close-auth'),
  loginForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  passwordInput = document.querySelector('#password'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu'),
  restaurantTitle = document.querySelector('.restaurant-title'),
  rating = document.querySelector('.rating'),
  minPrice = document.querySelector('.price'),
  category = document.querySelector('.category'),
  cartBody = document.querySelector('.modal-body'),
  priceTag = document.querySelector('.modal-pricetag'),
  clearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('userLogin');
const cart = [];

const getData = async (url) => {
  const response = await fetch(url);
  const { ok, status } = response;
  if (!ok) throw new Error(`Error for address ${url}, status ${status}`)
  return await response.json();

};


function toggleModal() {
  modal.classList.toggle("is-open");
}
const validateLogin = (str) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regex.test(str);
}
const toggleAuthModal = () => {
  authModal.classList.toggle('is-open');
  loginInput.style.borderColor = '';
};
const returnToMain = () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

const whenNotAuthorized = () => {
  const logIn = (evt) => {
    evt.preventDefault();
    login = loginInput.value.trim();
    if (!login.length || !validateLogin(login)) return loginInput.style.borderColor = 'red';
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
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnToMain();
  }
  userName.textContent = login;
  authButton.style.display = 'none';
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
};

const checkAuth = () => {
  if (login) return whenAuthorized();
  return whenNotAuthorized();
}

checkAuth();


//На одно событие несколько ф-й (раньше так делали)
// authButton.onclick = function () { func1(), func2()};

const createCardRestaurant = (restaurant) => {
  const { name, time_of_delivery: delivery, stars, price, kitchen, image, products } = restaurant;
  const card = `
  <a class="card card-restaurant" data-products="${products}" data-info="${[name, price, stars, kitchen]}">
      <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${delivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
`;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

const createGoodCard = (goods) => {
  const { description, id, image, name, price } = goods;
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend',
    `
						<img src="${image}" alt="image" class="card-image" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

const openGoods = ({ target }) => {
  const restaurant = target.closest('.card-restaurant');
  const [name, price, stars, ...kitchen] = restaurant.dataset.info.split(",");
  // console.log('restaurantInfo: ', kitchen.join());
  if (!restaurant) return;
  if (!login) return toggleAuthModal();
  containerPromo.classList.add('hide');
  restaurants.classList.add('hide');
  menu.classList.remove('hide');
  cardsMenu.textContent = '';
  restaurantTitle.textContent = name;
  rating.textContent = stars;
  minPrice.textContent = ` От ${price} ₽`;
  category.textContent = kitchen.join();

  getData(`./db/${restaurant.dataset.products}`).then(data => {
    data.forEach(createGoodCard);
  });

}

const addToCart = ({ target }) => {
  const btnAddToCart = target.closest('.button-add-cart');
  if (btnAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const price = card.querySelector('.card-price').textContent;
    const idBtn = btnAddToCart.id;
    const food = cart.find(el => el.id == idBtn);
    if (food) return food.count += 1;
    cart.push({

      id: idBtn, title, price, count: 1
    });

  }
};


const renderCart = () => {
  cartBody.textContent = '';
  cart.forEach(({ id, title, price, count }) => {
    const itemCart = `
  <div class="food-row">
    <span class="food-name">${title}</span>
    <strong class="food-price">${price}</strong>
    <div class="food-counter">
      <button class="counter-button count-minus" data-id="${id}">-</button>
      <span class="counter">${count}</span>
      <button class="counter-button count-plus" data-id="${id}">+</button>
    </div>
  </div>
`
    cartBody.insertAdjacentHTML('afterbegin', itemCart)
  });
  const totalPrice = cart.reduce((result, el) => {

    // result += (Number(el.price.split(" ")[0]) * el.count);
    result += (parseFloat(el.price) * el.count);
    return result;
  }, 0);
  priceTag.textContent = `${totalPrice} ₽`;
}

const changeCount = ({ target }) => {

  const food = cart.find(el => el.id === target.dataset.id);
  if (target.classList.contains('counter-button')) {
    if (target.classList.contains('count-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    };
    if (target.classList.contains('count-plus')) food.count++;
    renderCart();
  };
};
const emptyCart = () => {
  cart.length = 0;
  renderCart();
}
const formCart = () => {
  renderCart()
  toggleModal();
}

function init() {
  getData('./db/partners.json').then(data => {
    data.forEach(createCardRestaurant);
  });
  cartButton.addEventListener("click", formCart);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', returnToMain);
  cardsMenu.addEventListener('click', addToCart);
  cartBody.addEventListener('click', changeCount);
  clearCart.addEventListener('click', emptyCart)

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000
    }
  });
}

init();