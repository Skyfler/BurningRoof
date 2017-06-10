"use strict";

var Helper = require('./helper');

function HideLogoOnScroll(options) {
	Helper.call(this, options);

	this._logo = options.logo;

	this._onScroll = this._onScroll.bind(this);

	this._init();
}

HideLogoOnScroll.prototype = Object.create(Helper.prototype);
HideLogoOnScroll.prototype.constructor = HideLogoOnScroll;

HideLogoOnScroll.prototype._init = function() {
	var projectPopups = document.querySelectorAll('.project_popup');

	for (var i = 0; i < projectPopups.length; i++) {
		this._addListener(projectPopups[i], 'scroll', this._onScroll);
	}
};

HideLogoOnScroll.prototype._onScroll = function(e) {
	var target = e.target;

	if (!document.body.classList.contains('project_modal_open') || !target) return;

	if (target.scrollTop > 0 && !document.body.classList.contains('logo_hidden_by_scroll')) {
		document.body.classList.add('logo_hidden_by_scroll');

	} else if (target.scrollTop === 0 && document.body.classList.contains('logo_hidden_by_scroll')) {
		document.body.classList.remove('logo_hidden_by_scroll');

	}
};

module.exports = HideLogoOnScroll;
