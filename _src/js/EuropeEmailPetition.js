var AJAX = require('./AJAX');
var Template = require('./Template');


function EuropeEmailPetition(params) {
    // Params
    this.formTemplate = params.formTemplate;
    this.target = params.target;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();

    document.getElementById('fftf_disclosure').style.display = 'block';
}

EuropeEmailPetition.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.formTemplate, {});
    this.DOMNode.className = this.DOMNode.className.replace(/loading/, ' ');

};

EuropeEmailPetition.prototype.setCountryCode = function(countryCode) {
    this.DOMNode.querySelector('[name="member[country]"]').value = countryCode;
};

EuropeEmailPetition.prototype.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

EuropeEmailPetition.prototype.validatePhoneNumber = function(num) {
   num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
   num = num.replace("+", "").replace(/\-/g, '');

   if (num.charAt(0) == "1")
       num = num.substr(1);

   if (num.length != 10)
       return false;

   return num;
};

EuropeEmailPetition.prototype.addEventListeners = function() {
    var petitionFormNode = this.DOMNode.querySelector('#petition');
    var thanksNode = this.DOMNode.querySelector('.thanks');
    var disclaimerNode = this.DOMNode.querySelector('.disclaimer_container');

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
        if (ga) ga('send', 'event', 'form', 'submit', 'email');
        if (optimizely.push) {
            optimizely.push(['trackEvent', 'form-submit-email']);
        }

        petitionFormNode.style.display = 'none';
        disclaimerNode.style.display = 'none';
        thanksNode.style.display = 'block';

    }, false);

    
};

EuropeEmailPetition.prototype.updateCTA = function updateCTA(cta) {
    this.DOMNode.querySelector('button[type="submit"]').textContent = cta;
};

module.exports = EuropeEmailPetition;
