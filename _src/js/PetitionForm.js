var AJAX = require('./AJAX');
var Template = require('./Template');


function PetitionForm(params) {
    // Params
    this.allPoliticians = params.allPoliticians;
    this.formTemplate = params.formTemplate;
    this.geography = params.geography;
    this.target = params.target;

    this.DOMNode = document.querySelector(this.target);

    this.selectPoliticians();
    this.render();
    this.addEventListeners();
}

PetitionForm.prototype.selectPoliticians = function() {
    this.politicians = [];

    if (
        this.geography.country.iso_code === 'US' &&
        this.geography.subdivisions &&
        this.geography.subdivisions[0] &&
        this.geography.subdivisions[0].names &&
        this.geography.subdivisions[0].names.en
    ) {
        var stateName = this.geography.subdivisions[0].names.en;
        this.politicians = this.allPoliticians.filter(function(politician) {
            return (
                (politician.gsx$state.$t === stateName)
                &&
                (politician.gsx$organization.$t === 'Senate')
            );
        });
    }

    if (this.politicians.length === 0) {
        var teamCable = this.allPoliticians.filter(function(politician) {
            return (
                (politician.gsx$team.$t === 'team-cable')
            )
        });

        this.politicians = [];
        this.politicians[0] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        while (!this.politicians[1] || this.politicians[0] === this.politicians[1]) {
            this.politicians[1] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        }
    }
};

PetitionForm.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.formTemplate, {
        politicians: this.politicians.map(function(politician) {
            var team = politician.gsx$team.$t;

            var stance = 'undecided';
            if (team === 'team-cable') {
                stance = 'anti internet';
            } else if (team === 'team-internet') {
                stance = 'pro internet';
            }

            var url = 'http://';
            if (politician.gsx$subdomain.$t) {
                url += politician.gsx$subdomain.$t;
            } else {
                url += politician.gsx$first.$t + politician.gsx$name.$t;
            }
            if (politician.gsx$team.$t.trim() === 'team-internet') {
                url += '.savesthe.net';
            } else {
                url += '.breaksthe.net';
            }
            url = url.toLowerCase();

            return {
                image: 'images/scoreboard/' + politician.gsx$imagepleasedontedit.$t,
                name: politician.gsx$name.$t,
                url: url,
                stance: stance,
                team: team
            };
        })
    });
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
    var politiciansNode = this.DOMNode.querySelector('.politicians');
    var thanksNode = this.DOMNode.querySelector('.thanks');
    var disclaimerNode = this.DOMNode.querySelector('.disclaimer_container');
    var alternativeCTA = phoneCallFormNode.querySelector('.alternative-cta');

    var politicians = this.DOMNode.getElementsByClassName('politician');
    var bindPoliticianEvents = function(politician) {
        politician.addEventListener('click', function(e) {
            if (ga) ga('send', 'event', 'button', 'click', 'individual_site');
        }, true);
    }
    for (var i = 0; i < politicians.length; i++)
        bindPoliticianEvents(politicians[i]);

    if (location.href.match(/call_tool=1/)) {
        petitionFormNode.style.display = 'none';
        politiciansNode.style.display = 'none';
        phoneCallFormNode.querySelector('header').textContent = 'Call Congress and the FCC!';
        phoneCallFormNode.style.display = 'block';
        disclaimerNode.style.display = 'none';
    }
    alternativeCTA.addEventListener('click', function(e) {
        e.preventDefault();

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        thanksNode.style.display = 'block';
        global.modals.display('share_modal');
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
        if (ga) ga('send', 'event', 'form', 'submit', 'email');
       
        petitionFormNode.style.display = 'none';
        politiciansNode.style.display = 'none';
        phoneCallFormNode.style.display = 'block';
        disclaimerNode.style.display = 'none';
      

    }, false);

    phoneCallFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var campaignId = 'jan14th';

        var phoneNumber = phoneCallFormNode.elements.phone.value;
        var postalCode = petitionFormNode.elements.zip.value || '';

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
        if (ga) ga('send', 'event', 'form', 'submit', 'call');

        global.modals.display('call_modal');

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        politiciansNode.style.display = 'none';
        thanksNode.style.display = 'block';
    }.bind(this), false);
};

module.exports = PetitionForm;
