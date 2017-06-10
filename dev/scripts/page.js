"use strict";

(function ready() {

	require('./polyfills').init();
	var Slider = require('./slider');
	var PopupSlideController = require('./popupSlideController');
	var ContactFormController = require('./contactFormController');
	var HideLogoOnScroll = require('./hideLogoOnScroll');

	var mainSliderElem = document.querySelector('#main_slider');
	if (mainSliderElem) {
		var mainSlider = new Slider({
			elem: mainSliderElem,
			delay: 0
		});
	}

	var popupSlideController = new PopupSlideController();

	var contactFormElem = document.querySelector('#contact_form');
	if (contactFormElem) {
//        console.log('========= CONTACT FORM =========');
		var contactForm = new ContactFormController({
			elem: contactFormElem
		});
	}

	var logoElem = document.querySelector('.logo_container');
	if (logoElem) {
		var hideLogoOnScroll = new HideLogoOnScroll({
			logo: logoElem
		});
	}

})();
