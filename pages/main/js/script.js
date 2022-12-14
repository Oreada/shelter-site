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
	};
});
