var AJAX = require('./AJAX');
var Template = require('./Template');


function PetitionForm(params) {
    // Params
    this.formTemplate = params.formTemplate
    this.target = params.target;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

PetitionForm.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.formTemplate, {});
    this.DOMNode.className = this.DOMNode.className.replace(/loading/, ' ');
};

PetitionForm.prototype.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

PetitionForm.prototype.validatePhoneNumber = function(num) {
   num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
   num = num.replace("+", "").replace(/\-/g, '');

   if (num.charAt(0) == "1")
       num = num.substr(1);

   if (num.length != 10)
       return false;

   return num;
};

PetitionForm.prototype.addEventListeners = function() {
    var petitionFormNode = this.DOMNode.querySelector('#petition');
    var phoneCallFormNode = this.DOMNode.querySelector('#phone-call-form');
    var thanksNode = this.DOMNode.querySelector('.thanks');
    var phoneFormWasSkipped = false;

    petitionFormNode.style.display = 'none';
    phoneCallFormNode.querySelector('header').textContent = 'Call Congress and the FCC!';
    var alternativeCTA = phoneCallFormNode.querySelector('.alternative-cta');
    alternativeCTA.style.display = 'block';
    phoneCallFormNode.style.display = 'block';

    alternativeCTA.addEventListener('click', function(e) {
        e.preventDefault();

        petitionFormNode.style.display = 'block';
        phoneCallFormNode.style.display = 'none';
        phoneFormWasSkipped = true;
    }, false);

    petitionFormNode.querySelector('.right').addEventListener('click', function(e) {
        e.preventDefault();

        window.open('./letter/');
    }, false);

    // Petition Form: Submit event listener
    petitionFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var url = petitionFormNode.getAttribute('action');

        new AJAX({
            url: url,
            method: 'POST',
            form: petitionFormNode,
            success: function(e) {}
        });

        if (!phoneFormWasSkipped) {
            petitionFormNode.style.display = 'none';
            phoneCallFormNode.style.display = 'block';
        } else {
            petitionFormNode.style.display = 'none';
            thanksNode.style.display = 'block';
        }

    }, false);

    phoneCallFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var campaignId = 'title-x-committees';

        var phoneNumber = phoneCallFormNode.elements.phone.value;
        var postalCode = petitionFormNode.elements.zip.value || '95051';

        phoneNumber = this.validatePhoneNumber(phoneNumber);
        if (!phoneNumber) {
            return alert('Please enter a valid US phone number!');
        }

        var url =
            'https://call-congress.fightforthefuture.org/create?' +
            'campaignId=' + campaignId + '&' +
            'userPhone=' + phoneNumber + '&' +
            'zipcode=' + postalCode;

        new AJAX({
            url: url,
            success: function(e) {}
        });

        var overlayNode = document.querySelector('.overlay');
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        thanksNode.style.display = 'block';
    }.bind(this), false);
};

module.exports = PetitionForm;
