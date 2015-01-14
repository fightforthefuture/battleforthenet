var AJAX = require('./AJAX');
var Template = require('./Template');


function PetitionForm(params) {
    // Params
    this.allPoliticians = params.allPoliticians;
    this.formTemplate = params.formTemplate
    this.geography = params.geography;
    this.target = params.target;

    this.DOMNode = document.querySelector(this.target);

    this.selectPoliticians();
    this.render();
    this.addEventListeners();
}

PetitionForm.prototype.selectPoliticians = function() {
    if (this.geography.country.iso_code === 'US') {
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
            return {
                image: 'images/scoreboard/' + politician.gsx$imagepleasedontedit.$t,
                name: politician.gsx$name.$t,
                stance: stance,
                team: team
            };
        })
    });
    this.DOMNode.className = this.DOMNode.className.replace(/loading/, ' ');
};

PetitionForm.prototype.addEventListeners = function() {
    var petitionFormNode = this.DOMNode.querySelector('#petition');
    var phoneCallFormNode = this.DOMNode.querySelector('#phone-call-form');
    var politiciansNode = this.DOMNode.querySelector('.politicians');

    petitionFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        petitionFormNode.style.display = 'none';
        politiciansNode.style.display = 'none';

        phoneCallFormNode.style.display = 'block';

        var url = petitionFormNode.getAttribute('action');
        new AJAX({
            url: url,
            method: 'POST',
            form: petitionFormNode,
            success: function(e) {
                var json = JSON.parse(e.target.responseText);
                console.log('Petition response:', json);
            }
        });

    }, false);

    phoneCallFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var campaignId = 'jan14th';
        var phoneNumber = phoneCallFormNode.querySelector('#phone').value;
        var postalCode = petitionFormNode.querySelector('#zip');

        var url =
            'https://call-congress.fightforthefuture.org/create?' +
            'campaignId=' + campaignId + '&' +
            'userPhone=' + phoneNumber + '&' +
            'zipcode=' + postalCode;

        new AJAX({
            url: url,
            success: function(e) {
            }
        });

        $('.overlay').removeClass('invisible');
    }, false);
};

module.exports = PetitionForm;
