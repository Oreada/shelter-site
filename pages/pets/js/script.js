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


//! ===============================================================================================

//! -------- меню Бургер -------------------------------------------------------------------------

const iconMenu = document.querySelector(".menu__icon");
const bodyMenu = document.querySelector(".menu__body");
const menuLogo = document.querySelector(".menu__logo");

if (iconMenu) {
	iconMenu.addEventListener("click", function () {
		document.body.classList.toggle("_lock"); //! добавляем класс "_lock" в SCSS для запрета прокрутки при активном меню-бургере
		iconMenu.classList.toggle("_active");
		bodyMenu.classList.toggle("_active");
		menuLogo.classList.toggle("_active-logo");
	});
};

if (bodyMenu) {
	bodyMenu.addEventListener("click", function (event) {
		if (event.target.className === "menu__link" && bodyMenu.classList.contains("_active")) {
			document.body.classList.remove("_lock");
			iconMenu.classList.remove("_active");
			bodyMenu.classList.remove("_active");
			menuLogo.classList.remove("_active-logo");
		};
	});
};


document.body.addEventListener("click", function (event) {
	// console.log(event.target);

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
	};
});


//! -------- Пагинация -------------------------------------------------------------------------

const localUrl = '../../assets/pets.json';
let petsArray = [];
let dataPets = [];
let dataPetsShuffled;
let paginationState = {
	current: 0,
	max: 0,
};

const petsList = document.querySelector('.pets__list');
const doubleLeftBtn = document.querySelector('.pagination__double-left');
const singleLeftBtn = document.querySelector('.pagination__single-left');
const numberPage = document.querySelector('.pagination__number');
const singleRightBtn = document.querySelector('.pagination__single-right');
const doubleRightBtn = document.querySelector('.pagination__double-right');

function shuffleArray(arr) {
	let currentIndex = arr.length;
	let randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[arr[currentIndex], arr[randomIndex]] = [
			arr[randomIndex], arr[currentIndex]];
	};

	return arr;
};

function nestedCopy(array) {
	return JSON.parse(JSON.stringify(array));
};

function arrayReplicate(arr, times) {
	let result = [];
	for (let i = 0; i < times; i++) {
		result = result.concat(nestedCopy(arr));
	}
	return result;
};

function splitArrayToPages(arr, pages, elements) {
	let result = [];
	for (let i = 0; i < pages; i++) {
		result.push([]);
		for (let j = 0; j < elements; j++) {
			result[i].push(arr[i * elements + j]);
		}
		result[i] = shuffleArray(result[i]);
	}
	return result;
}

async function getData() {
	const result = await fetch(localUrl);
	const data = await result.json();
	// console.log(data);  // (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
	return data;
};

function getPet(id) {
	for (let pet of petsArray) {
		if (pet.id == id) {
			return pet;
		};
	};
};

async function getList() {
	petsArray = await getData();

	let allPets = arrayReplicate(shuffleArray(petsArray), 6);
	if (window.matchMedia('(max-width: 767px)').matches) {
		dataPets = splitArrayToPages(allPets, 16, 3);
	} else if (window.matchMedia('(max-width: 1279px)').matches) {
		dataPets = splitArrayToPages(allPets, 8, 6);
	} else {
		dataPets = splitArrayToPages(allPets, 6, 8);
	};
	testPage(dataPets);  //! тест для проверки количества выводимых на страницу питомцев и отсутствия повторов
	// console.log(dataPets);

	paginationState.max = dataPets.length - 1;
	renderPage();
};

//! тест для проверки количества выводимых на страницу питомцев и отсутствия повторов
function testPage(result) {
	let sum = 0;
	let pets = {};
	for (let aaa of result) {
		let cur = [];
		let sumcur = 0;
		for (let bbb of aaa) {
			if (typeof pets[bbb.id] == 'undefined') {
				pets[bbb.id] = 0;
			};
			pets[bbb.id]++;
			sum += bbb.id;
			sumcur += bbb.id;
			if (cur.includes(bbb.id)) {
				debugger;
			};
			cur.push(bbb.id);
		};
		console.log(cur);
		console.log(sumcur);
	};
	console.log('sum=' + sum);
	console.log('pets=' + JSON.stringify(pets));
};

function splitToPages(arr, pages, numPerPage) {
	let result = [], resultIds = [];
	for (let pageNum = 0; pageNum < pages; pageNum++) {
		result.push([]);
		resultIds.push([]);
		let shift = 0;
		for (let pageCard = 0; pageCard < numPerPage; pageCard++) {
			let card = arr[shift];
			if (!resultIds[pageNum].includes(card.id)) {
				result[pageNum].push(card);
				resultIds[pageNum].push(card.id);
				arr.splice(0, 1);
				shift = 0;
			} else {
				pageCard--;
				shift++;
			};
		};
	};

	return result;
};

function renderPage() {
	petsList.textContent = '';

	const cards = dataPets[paginationState.current].map((obj) => createCard(obj));

	petsList.append(...cards);
};

function createCard(cardData) {
	const petsItem = document.createElement('li');  //! т.к. каждая карточка является пунктом списка ".pets__list"
	petsItem.classList.add('pets__item');

	petsItem.insertAdjacentHTML('afterbegin', `
								<div class="pets__card card" data-id="${cardData.id}">
									<div class="card__image-wrapper">
										<img src="${cardData.img}" alt="${cardData.alt}" class="card__image"
											width="270" height="270">
									</div>

									<div class="card__words">
										<h4 class="card__title-name">${cardData.name}</h4>
										<button class="card__button btn">Learn more</button>
									</div>
								</div>
								`);

	petsItem.addEventListener('click', function (event) {
		if (event.currentTarget.classList.contains('pets__item')) {
			createModalWindow(event.currentTarget.querySelector('.card').dataset.id);
			document.body.classList.toggle('_lock'); //! добавляем класс "_lock" в SCSS для запрета прокрутки при активном модальном окне
			popupWhole.classList.toggle('_open');
		};
	});

	return petsItem;
};

function firstPage(event) {

	if (event.currentTarget.classList.contains('btn_disabled')) {
		return;
	};

	paginationState.current = 0;
	numberPage.textContent = paginationState.current + 1;

	if (paginationState.current > 0) {
		doubleLeftBtn.classList.remove('btn_disabled');
		singleLeftBtn.classList.remove('btn_disabled');
	} else {
		doubleLeftBtn.classList.add('btn_disabled');
		singleLeftBtn.classList.add('btn_disabled');
	};

	if (paginationState.current === paginationState.max) {
		singleRightBtn.classList.add('btn_disabled');
		doubleRightBtn.classList.add('btn_disabled');
	} else {
		singleRightBtn.classList.remove('btn_disabled');
		doubleRightBtn.classList.remove('btn_disabled');
	};

	renderPage();
};

function previousPage(event) {

	if (event.currentTarget.classList.contains('btn_disabled')) {
		return;
	};

	paginationState.current -= 1;
	numberPage.textContent = paginationState.current + 1;

	if (paginationState.current > 0) {
		doubleLeftBtn.classList.remove('btn_disabled');
		singleLeftBtn.classList.remove('btn_disabled');
	} else {
		doubleLeftBtn.classList.add('btn_disabled');
		singleLeftBtn.classList.add('btn_disabled');
	};

	if (paginationState.current === paginationState.max) {
		singleRightBtn.classList.add('btn_disabled');
		doubleRightBtn.classList.add('btn_disabled');
	} else {
		singleRightBtn.classList.remove('btn_disabled');
		doubleRightBtn.classList.remove('btn_disabled');
	};

	renderPage();
};

function nextPage(event) {

	if (event.currentTarget.classList.contains('btn_disabled')) {
		return;
	};

	paginationState.current += 1;
	numberPage.textContent = paginationState.current + 1;

	if (paginationState.current > 0) {
		doubleLeftBtn.classList.remove('btn_disabled');
		singleLeftBtn.classList.remove('btn_disabled');
	}

	if (paginationState.current === paginationState.max) {
		singleRightBtn.classList.add('btn_disabled');
		doubleRightBtn.classList.add('btn_disabled');
	};

	renderPage();
};

function lastPage(event) {

	if (event.currentTarget.classList.contains('btn_disabled')) {
		return;
	};

	paginationState.current = paginationState.max;
	numberPage.textContent = paginationState.current + 1;

	if (paginationState.current > 0) {
		doubleLeftBtn.classList.remove('btn_disabled');
		singleLeftBtn.classList.remove('btn_disabled');
	}

	if (paginationState.current === paginationState.max) {
		singleRightBtn.classList.add('btn_disabled');
		doubleRightBtn.classList.add('btn_disabled');
	};

	renderPage();
};

doubleLeftBtn.addEventListener('click', firstPage);
singleLeftBtn.addEventListener('click', previousPage);
singleRightBtn.addEventListener('click', nextPage);
doubleRightBtn.addEventListener('click', lastPage);

getList();

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
	let cardData = getPet(id);

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

// for (let item of carouselItems) {
// 	item.addEventListener('click', function (event) {
// 		if (event.currentTarget == item) {
// 			createModalWindow(event.currentTarget.querySelector('.card').dataset.id);
// 			document.body.classList.toggle('_lock'); //! добавляем класс "_lock" в SCSS для запрета прокрутки при активном модальном окне
// 			popupWhole.classList.toggle('_open');
// 		};
// 	});
// };

popupWhole.addEventListener('click', closeModalWindow);

popupButton.addEventListener('click', closeModalWindow);


//! ============================================================================================
