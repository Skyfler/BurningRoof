"use strict";

var Helper = require('./helper');
var PopupSlide = require('./popupSlide');

function PopupSlideController(options) {
	Helper.call(this, options);

	this._onDocumentClick = this._onDocumentClick.bind(this);

	this._init();
}

PopupSlideController.prototype = Object.create(Helper.prototype);
PopupSlideController.prototype.constructor = PopupSlideController;

PopupSlideController.prototype.remove = function() {

	PopupSlideController.prototype.remove.apply(this, arguments);
};

PopupSlideController.prototype._init = function() {

	this._popups = {};
	this._openPopups = [];

	this._popups.menu = new PopupSlide({
		elem: document.querySelector('.menu_popup'),
		popupApperanceDirection: 'top',
		popupApperanceDuration: 500,
		animatedItemsApperanceDelay: 100,
		animatedItemsApperanceDuration: 500,
		animatedItemsApperanceStartOffset: -20
	});

	this._popups.contacts = new PopupSlide({
		elem: document.querySelector('.contact_popup'),
		popupApperanceDirection: 'right',
		popupApperanceDuration: 500,
		animatedItemsApperanceDelay: 100,
		animatedItemsApperanceDuration: 500,
		animatedItemsApperanceStartOffset: -20
	});

	this._popups.about_us = new PopupSlide({
		elem: document.querySelector('.about_us_popup'),
		popupApperanceDirection: 'bottom',
		popupApperanceDuration: 500,
		animatedItemsApperanceDelay: 100,
		animatedItemsApperanceDuration: 500,
		animatedItemsApperanceStartOffset: -20
	});

	var projectPopupsArr = document.querySelectorAll('.project_popup');
	this._projectPopupNameArr = [];
	if (projectPopupsArr.length > 0) {
		var projectName;
		for (var i = 0; i < projectPopupsArr.length; i++) {
			projectName = projectPopupsArr[i].dataset.popupName;

			if (this._popups[projectName]) {
				console.warn('PopupSlideController: found duplicate popup with name "' + projectName + '".');

			} else {
				this._popups[projectName] = new PopupSlide({
					elem: projectPopupsArr[i],
					popupApperanceDirection: 'bottom',
					popupApperanceDuration: 500,
					animatedItemsApperanceDelay: 100,
					animatedItemsApperanceDuration: 500,
					animatedItemsApperanceStartOffset: -20
				});

				this._projectPopupNameArr.push(projectName);
			}
		}
	}

	this._addListener(document, 'click', this._onDocumentClick);
};

PopupSlideController.prototype._onDocumentClick = function(e) {
	var target = e.target;

	this._manageClick(target, e);
};

PopupSlideController.prototype._manageClick = function(target, e) {
	var popupOpenControll = target.closest('[data-popup-open]');
	var popupCloseControll = target.closest('[data-popup-close]');

	if (!popupOpenControll && !popupCloseControll) return;

	var targetOpenPopup,
		targetClosePopup;

	if (popupOpenControll) {
		targetOpenPopup = popupOpenControll.dataset.popupOpen;
	}
	if (popupCloseControll) {
		targetClosePopup = popupCloseControll.dataset.popupClose;
	}
	if (!targetOpenPopup && !targetClosePopup) return;

	e.preventDefault();

	if (targetClosePopup === 'all' && this._openPopups.length > 0) {
		if (this._openPopups.length === 0) return;

		var topPopup = this._openPopups.pop();

		if (this._popups[topPopup].state === 'open') {
			this._popups[topPopup].closePopup();
		}

		for (var i = this._openPopups.length, popup; i > 0; i--) {
			popup = this._openPopups.pop();
			this._popups[popup].closePopup(true);
		}

	} else if (targetClosePopup && this._popups[targetClosePopup] && this._popups[targetClosePopup].state === 'open') {
		this._popups[targetClosePopup].closePopup();
		this._openPopups.splice(this._openPopups.indexOf(targetClosePopup), 1);

		for (var i = this._openPopups.length, popup; i > 0; i--) {
			popup = this._openPopups.pop();
			this._popups[popup].closePopup(true);
		}

	} else if (targetOpenPopup && this._popups[targetOpenPopup] && this._popups[targetOpenPopup].state === 'closed') {
		this._popups[targetOpenPopup].openPopup();
		window.scrollTo(0, 0);
		this._openPopups.push(targetOpenPopup);
	}

	var projPopupOpened = false;
	for (var i = 0; i < this._projectPopupNameArr.length && !projPopupOpened; i++) {
		if (this._openPopups.indexOf(this._projectPopupNameArr[i]) !== -1) {
			projPopupOpened = true;
		}
	}

	if (projPopupOpened && !document.body.classList.contains('project_modal_open')) {
		document.body.classList.add('project_modal_open');

	} else if (!projPopupOpened && document.body.classList.contains('project_modal_open')) {
		document.body.classList.remove('project_modal_open');

	}

	if (this._openPopups.length === 0 && document.body.classList.contains('modal_open')) {
		document.body.style.paddingRight = '';
		document.body.classList.remove('modal_open');
		if (document.body.classList.contains('logo_hidden_by_scroll')) {
			document.body.classList.remove('logo_hidden_by_scroll');
		}

	} else if (this._openPopups.length > 0 && !document.body.classList.contains('modal_open')) {
		var windowWidth = window.innerWidth;
		var bodyWidth = document.body.clientWidth;
		var scrollBarDif = windowWidth - bodyWidth;
//		console.log({
//			windowWidth: windowWidth,
//			bodyWidth: bodyWidth,
//			scrollBarDif: scrollBarDif
//		});
		if (scrollBarDif > 0) {
			document.body.style.paddingRight = scrollBarDif + 'px';
		}

		document.body.classList.add('modal_open');
	}
};

module.exports = PopupSlideController;
