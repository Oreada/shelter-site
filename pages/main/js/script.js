"use strict";

// убираю placeholder при фокусе -----------------------------------------------------------

// const form = document.forms[0];
// const input = form.elements.inputEmail;
// const inputPlaceholder = input.placeholder;

// input.addEventListener("focus", function (event) {

//     input.placeholder = "";
// });

// input.addEventListener("blur", function (event) {

//     input.placeholder = inputPlaceholder;
// });


//! ============================================================================================

//! -------- Меню Бургер -------------------------------------------------------------------------

const iconMenu = document.querySelector(".menu__icon");
const bodyMenu = document.querySelector(".menu__body");
const menuLogo = document.querySelector(".menu__logo");
// const overlay = document.querySelector('.overlay');
// const logoLink = document.querySelector('.logo__link');

if (iconMenu) {
	iconMenu.addEventListener("click", function () {
		document.body.classList.toggle("_lock"); //! добавляем класс "_lock" в SCSS для запрета прокрутки при активном меню-бургере
		iconMenu.classList.toggle("_active");
		bodyMenu.classList.toggle("_active");
		menuLogo.classList.toggle("_active-logo");
		// overlay.classList.toggle("_active");
		// logoLink.classList.toggle("_none");
	});
};

if (bodyMenu) {
	bodyMenu.addEventListener("click", function (event) {
		if (event.target.className === "menu__link" && bodyMenu.classList.contains("_active")) {
			document.body.classList.remove("_lock");
			iconMenu.classList.remove("_active");
			bodyMenu.classList.remove("_active");
			menuLogo.classList.remove("_active-logo");
			// overlay.classList.remove("_active");
			// logoLink.classList.remove("_none");
		};
	});
};

// overlay.addEventListener("click", function (event) {

// 	if (overlay.classList.contains("_active")) {
// 		document.body.classList.remove("_lock");
// 		iconMenu.classList.remove("_active");
// 		bodyMenu.classList.remove("_active");
// 		menuLogo.classList.remove("_active-logo");
// 		overlay.classList.remove("_active");
// 		logoLink.classList.remove("_none");
// 	}
// });

document.body.addEventListener("click", function (event) {
	console.log(event.target);

	if (iconMenu.classList.contains("_active") &&
		(event.target !== iconMenu) &&
		!event.target.classList.contains("menu__icon-span") &&
		!event.target.classList.contains("menu__list") &&
		!event.target.classList.contains("menu__item")
	) {
		document.body.classList.remove("_lock");
		iconMenu.classList.remove("_active");
		bodyMenu.classList.remove("_active");
		menuLogo.classList.remove("_active-logo");
		// overlay.classList.remove("_active");
		// logoLink.classList.remove("_none");
	};
});


//! -------- Получение карточек -------------------------------------------------------------------------

const localUrl = '../../assets/pets.json';
let petsList = [];

async function getData() {
	const result = await fetch(localUrl);
	const data = await result.json();
	// console.log(data);  // (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
	return data;
}

async function getList() {
	petsList = await getData();
	// console.log(petsList);  // (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
}

getList();


//! -------- Слайдер -------------------------------------------------------------------------

const carouselLeftBtn = document.querySelector('.carousel__left-arrow');
const carouselRightBtn = document.querySelector('.carousel__right-arrow');
const carouselList = document.querySelector('.carousel__list');
const item1 = document.querySelector('#item1');
const item2 = document.querySelector('#item2');
const item3 = document.querySelector('#item3');
const item4 = document.querySelector('#item4');
const item5 = document.querySelector('#item5');
const item6 = document.querySelector('#item6');
const item7 = document.querySelector('#item7');
const item8 = document.querySelector('#item8');
const item9 = document.querySelector('#item9');

let currentIndexes = [];
let lastIndexes = [0, 1, 2];
if (window.matchMedia('(max-width: 767px)').matches) {
	lastIndexes = [6];
} else if (window.matchMedia('(max-width: 1279px)').matches) {
	lastIndexes = [4, 0];
};

function getRandomIndex(num) {
	while (currentIndexes.length < num && petsList.length > 0) {
		let index = Math.floor(Math.random() * petsList.length);
		if (!lastIndexes.includes(index) && !currentIndexes.includes(index)) {
			currentIndexes.push(index);
		};
	};
};

function createCard(cardData, place) {
	place.textContent = '';
	place.insertAdjacentHTML('afterbegin', `
							<div class="carousel__card card" data-id="${cardData.id}">
								<div class="card__image-wrapper">
									<img src="${cardData.img}"
										alt="${cardData.alt}" class="card__image" width="270"
										height="270">
								</div>
						
								<div class="card__words">
									<h4 class="card__title-name">${cardData.name}</h4>
									<button class="card__button btn">Learn more</button>
								</div>
							</div>	
							`);
};

function renderCard(indexes) {
	getRandomIndex(indexes.length);

	for (let i in indexes) {
		let cardDataRandom = petsList[currentIndexes[i]];
		createCard(cardDataRandom, document.querySelector(`#item${indexes[i]}`));
	}

	lastIndexes.splice(0, indexes.length, ...currentIndexes);
	currentIndexes.splice(0, indexes.length);
};

function moveLeft() {
	if (window.matchMedia('(max-width: 767px)').matches) {
		renderCard([1]);
	} else if (window.matchMedia('(max-width: 1279px)').matches) {
		renderCard([1, 2]);
	} else {
		renderCard([1, 2, 3]);
	};
	carouselList.classList.add('transition-left');
	carouselLeftBtn.removeEventListener('click', moveLeft);
	carouselRightBtn.removeEventListener('click', moveRight);
};

function moveRight() {
	if (window.matchMedia('(max-width: 767px)').matches) {
		renderCard([3]);
	} else if (window.matchMedia('(max-width: 1279px)').matches) {
		renderCard([5, 6]);
	} else {
		renderCard([7, 8, 9]);
	};
	carouselList.classList.add('transition-right');
	carouselRightBtn.removeEventListener('click', moveRight);
	carouselLeftBtn.removeEventListener('click', moveLeft);
};

carouselLeftBtn.addEventListener('click', moveLeft);
carouselRightBtn.addEventListener('click', moveRight);

carouselList.addEventListener('animationend', function (event) {
	carouselList.classList.remove('transition-left');
	carouselList.classList.remove('transition-right');

	//! проработать смену карточек для адаптива! if (event.animationName === 'move-left-768') и if (event.animationName === 'move-left-320')
	if (event.animationName === 'move-left-1280') {
		item4.innerHTML = item1.innerHTML;
		item5.innerHTML = item2.innerHTML;
		item6.innerHTML = item3.innerHTML;
	} else if (event.animationName === 'move-right-1280') {
		item4.innerHTML = item7.innerHTML;
		item5.innerHTML = item8.innerHTML;
		item6.innerHTML = item9.innerHTML;
	} else if (event.animationName === 'move-left-768') {
		item3.innerHTML = item1.innerHTML;
		item4.innerHTML = item2.innerHTML;
	} else if (event.animationName === 'move-right-768') {
		item3.innerHTML = item5.innerHTML;
		item4.innerHTML = item6.innerHTML;
	} else if (event.animationName === 'move-left-320') {
		item2.innerHTML = item1.innerHTML;
	} else if (event.animationName === 'move-right-320') {
		item2.innerHTML = item3.innerHTML;
	}

	carouselLeftBtn.addEventListener('click', moveLeft);
	carouselRightBtn.addEventListener('click', moveRight);
});


//! -------- Модальное окно -------------------------------------------------------------------------

const carouselItems = document.querySelectorAll('.carousel__item');
const popupWhole = document.querySelector('.popup');  //! часть с затемнением
const popupPadding = document.querySelector('.popup__body');  //! по сути только часть с паддингом, она тоже замемнена
const modalWindow = document.querySelector('.popup__content');  //! только видимая светлая часть
const popupButton = document.querySelector('.popup__button');  //! кнопка-крестик

function closeModalWindow(event) {
	if (event.target == popupWhole || event.target == popupPadding || event.currentTarget == popupButton) {
		document.body.classList.remove('_lock'); //! добавляем класс "_lock" в SCSS для запрета прокрутки при активном модальном окне
		popupWhole.classList.remove('_open');
	};
};

function createModalWindow(id) {
	let cardData = petsList[id];

	if (window.matchMedia('(min-width: 768px)').matches) {
		document.querySelector('.popup__image').src = cardData.img;
	};

	document.querySelector('.profile__title').textContent = cardData.name;
	document.querySelector('.profile__subtitle').textContent = cardData.type + ' - ' + cardData.breed;
	document.querySelector('.profile__description').textContent = cardData.description;
	document.querySelector('.details__item_age').textContent = cardData.age;
	document.querySelector('.details__item_inoculations').textContent = cardData.inoculations;
	document.querySelector('.details__item_diseases').textContent = cardData.diseases;
	document.querySelector('.details__item_parasites').textContent = cardData.parasites;
};

for (let item of carouselItems) {
	item.addEventListener('click', function (event) {
		if (event.currentTarget == item) {
			createModalWindow(event.currentTarget.querySelector('.card').dataset.id);
			document.body.classList.toggle('_lock'); //! добавляем класс "_lock" в SCSS для запрета прокрутки при активном модальном окне
			popupWhole.classList.toggle('_open');
		};
	});
};

popupWhole.addEventListener('click', closeModalWindow);

popupButton.addEventListener('click', closeModalWindow);







