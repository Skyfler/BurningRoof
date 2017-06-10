"use strict";

var FormTemplate = require('./formTemplate');
var _ajax = require('./ajax');

function ContactFormController(options) {
    FormTemplate.call(this, options);

    this._loadImages('img/spinner.gif');

    this._succsessNotificationHTML = '<div class="success_notification">' +
        '<p>Thank you for fiiling up the form</p>' +
        '<p>We will contact You ASAP!</p>' +
        '</div>';

    this._onSubmit = this._onSubmit.bind(this);

    this._addListener(this._elem, 'submit', this._onSubmit);
}

ContactFormController.prototype = Object.create(FormTemplate.prototype);
ContactFormController.prototype.constructor = FormTemplate;

ContactFormController.prototype._onSubmit = function(e) {
    e.preventDefault();

    if (this._waitingForResponse) {
        // console.log('Already sent form!');
        return;
    }

    this._postForm();
};

ContactFormController.prototype._postForm = function() {
    var valuesObj = this._getUserInputValues();
    // console.log(valuesObj);
    if (!valuesObj || valuesObj.__validationFailed) return;

    var formData = this._createFormData(
        this._createPostDataObj(valuesObj)
    );

    this._waitingForResponse = true;
    this._elem.classList.add('waiting_for_response');

    _ajax.ajax("POST", "php/send.php", this._onReqEnd.bind(this), formData);
};

ContactFormController.prototype._createPostDataObj = function(valuesObj) {
    var res = {
        dataString: ''
    };

    for (var key in valuesObj) {
        res.dataString += '<p><strong>' + key +': </strong> '+ valuesObj[key] + '</p>';
        if (key === 'Email') {
            res.email = valuesObj[key];
        }
    }
    // console.log(res);
    return res;
};

ContactFormController.prototype._onReqEnd = function(xhr) {
    if (!this._elem) return;

    this._waitingForResponse = false;
    this._elem.classList.remove('waiting_for_response');

    var res;

    try {
        res = JSON.parse(xhr.responseText);
    } catch(e) {
        res = false;
    }

    if (xhr.status === 200 && res.success) {
        this._elem.innerHTML = this._succsessNotificationHTML;
    } else {
        this._showErrorNotification();
    }
};

module.exports = ContactFormController;
