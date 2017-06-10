"use strict";

var Helper = require('./helper');
var Animation = require('./animation');

function PopupSlide(options) {
	Helper.call(this, options);

	this._elem = options.elem;
	this._popupApperanceDirection = options.popupApperanceDirection || 'left';
	this._popupApperanceDuration = options.popupApperanceDuration || '500';
	this._animatedItemsApperanceDirection = options.animatedItemsApperanceDirection || this._popupApperanceDirection;
	this._animatedItemsApperanceDelay = options.animatedItemsApperanceDelay || '100';
	this._animatedItemsApperanceDuration = options.animatedItemsApperanceDuration || this._popupApperanceDuration;
	this._animatedItemsApperanceStartOffset = options.animatedItemsApperanceStartOffset || '-10';

	this._onWindowResize = this._onWindowResize.bind(this);

	this._init();
}

PopupSlide.prototype = Object.create(Helper.prototype);
PopupSlide.prototype.constructor = PopupSlide;

PopupSlide.prototype._init = function() {
	this._animateItemsArr = this._elem.querySelectorAll('.animate_item');
	this._animateItemsCount = this._animateItemsArr.length;

	switch (this._animatedItemsApperanceDirection) {
		case 'left':
			this._opositDirection = 'right';
			break;
		case 'right':
			this._opositDirection = 'left';
			break;
		case 'top':
			this._opositDirection = 'bottom';
			break;
		case 'bottom':
			this._opositDirection = 'top';
			break;
	}

	this.closePopup(true);

	this._addListener(window, 'resize', this._onWindowResize);
};

PopupSlide.prototype._preOpenInit = function() {
	this._animateItemsStartingPositionArr = [];
	this._animateItemsStartingPositionTypeArr = [];

	this._elem.scrollTop = 0;

	var position,
		initalOffset;

	for (var i = 0; i < this._animateItemsCount; i++) {
		position = getComputedStyle(this._animateItemsArr[i]).position;
		this._animateItemsStartingPositionTypeArr[i] = position;

		if (this._animateItemsStartingPositionTypeArr[i] === 'absolute') {
			this._animateItemsArr[i].style.position = 'absolute';
		} else {
			this._animateItemsArr[i].style.position = 'relative';
		}

		initalOffset = parseFloat(getComputedStyle(this._animateItemsArr[i])[this._animatedItemsApperanceDirection]);
		this._animateItemsStartingPositionArr[i] = initalOffset;

		this._animateItemsArr[i].style.opacity = '0';
		this._animateItemsArr[i].style[this._animatedItemsApperanceDirection] = this._animateItemsStartingPositionArr[i] + this._animatedItemsApperanceStartOffset + 'px';
		this._animateItemsArr[i].style[this._opositDirection] = 'auto';
	}
};

PopupSlide.prototype._onWindowResize = function() {
	if (this.state === 'closed' && !this._animationInProgress) {
		var popupEndPosition,
			popupSize,
			popupApperanceDirection;

		switch (this._popupApperanceDirection) {
			case 'left':
			case 'right':
				popupApperanceDirection = this._popupApperanceDirection;
				popupSize = this._elem.offsetWidth;
				break;
			case 'top':
				popupApperanceDirection = this._popupApperanceDirection;
				popupSize = this._elem.offsetHeight;
				break;
			case 'bottom':
				popupApperanceDirection = 'top';
				popupSize = -1 * this._elem.offsetHeight;
				break;
		}

		popupEndPosition = -1 * popupSize;

		this._elem.style[popupApperanceDirection] = popupEndPosition + 'px';
	}
};

PopupSlide.prototype.openPopup = function(noAnimation) {
	this.state = 'open';
	this._elem.classList.add('open');
//	this._elem.classList.add('popup_elem_shown');

	this._preOpenInit();

	var popupApperanceDirection;

	switch (this._popupApperanceDirection) {
		case 'left':
		case 'right':
		case 'top':
			popupApperanceDirection = this._popupApperanceDirection;
			break;
		case 'bottom':
			popupApperanceDirection = 'top';
			break;
	}

	if (noAnimation) {
		this._elem.style[popupApperanceDirection] = 0;
//		this._elem.classList.add('popup_elem_shown');
		this._showAnimatedItems();

	} else {
		var popupCurrentPosition = parseFloat(getComputedStyle(this._elem)[popupApperanceDirection]);

		this._animationInProgress = true;

		new Animation(
			function(timePassed) {
				this._elem.style[popupApperanceDirection] = (popupCurrentPosition + (((0 - popupCurrentPosition) / this._popupApperanceDuration) * timePassed)) + 'px';
			}.bind(this),
			this._popupApperanceDuration,
			function() {
//				this._elem.classList.add('popup_elem_shown');
				this._showAnimatedItems();
				this._animationInProgress = false;
			}.bind(this)
		)
	}
};

PopupSlide.prototype.closePopup = function(noAnimation) {
	this.state = 'closed';
	this._elem.classList.remove('open');

	var popupEndPosition,
		popupSize,
		popupApperanceDirection;

	switch (this._popupApperanceDirection) {
		case 'left':
		case 'right':
			popupApperanceDirection = this._popupApperanceDirection;
			popupSize = this._elem.offsetWidth;
			break;
		case 'top':
			popupApperanceDirection = this._popupApperanceDirection;
			popupSize = this._elem.offsetHeight;
			break;
		case 'bottom':
			popupApperanceDirection = 'top';
			popupSize = -1 * this._elem.offsetHeight;
			break;
	}

	popupEndPosition = -1 * popupSize;

	if (noAnimation) {
		this._elem.style[popupApperanceDirection] = popupEndPosition + 'px';
//		this._elem.classList.remove('popup_elem_shown');

	} else {
		var popupCurrentPosition = parseFloat(getComputedStyle(this._elem)[popupApperanceDirection]);

		new Animation(
			function(timePassed) {
				this._elem.style[popupApperanceDirection] = (popupCurrentPosition + (((popupEndPosition - popupCurrentPosition) / this._popupApperanceDuration) * timePassed)) + 'px';
			}.bind(this),
			this._popupApperanceDuration,
			function() {
//				this._elem.classList.remove('popup_elem_shown');
			}.bind(this)
		)

	}
};

PopupSlide.prototype._showAnimatedItems = function() {
	this._animateItemsAnimated = [];

	this._showAnimatedItem(0);
};

PopupSlide.prototype._showAnimatedItem = function(index) {
	if (!this._animateItemsArr[index]) {
		delete this._animateItemsAnimated;
		return;
	}

	this._animateItemsAnimated[index] = true;

	var startAnimationPosition = this._animateItemsStartingPositionArr[index] + this._animatedItemsApperanceStartOffset;

	new Animation(
		function(timePassed) {
			this._animateItemsArr[index].style[this._animatedItemsApperanceDirection] = (startAnimationPosition - timePassed * (this._animatedItemsApperanceStartOffset / this._animatedItemsApperanceDuration)) + 'px';
			this._animateItemsArr[index].style.opacity = (timePassed * (1 / this._animatedItemsApperanceDuration));

			if (timePassed >= this._animatedItemsApperanceDelay && this._animateItemsAnimated && !this._animateItemsAnimated[index + 1]) {
				this._showAnimatedItem(index + 1);
			}
		}.bind(this),
		this._animatedItemsApperanceDuration,
		function() {
			this._animateItemsArr[index].style.position = '';
			this._animateItemsArr[index].style.opacity = '';
			this._animateItemsArr[index].style[this._animatedItemsApperanceDirection] = '';
			this._animateItemsArr[index].style[this._opositDirection] = '';
			if (this._animatedItemsApperanceDelay > this._animatedItemsApperanceDuration) {
				setTimeout(
					this._showAnimatedItem.bind(this)(index + 1),
					this._animatedItemsApperanceDelay - this._animatedItemsApperanceDuration
				);
			}
		}.bind(this)
	);
};

module.exports = PopupSlide;
