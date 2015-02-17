var AJAX = require('./AJAX');
var Template = require('./Template');

function YourSenators(params) {
    this.callback = params.callback;
    this.geography = params.geography;
    this.politicians = [];
    this.target = params.target;
    this.URLs = params.URLs;

    this.DOMNode = document.querySelector(params.target);

    this.fetchPoliticiansFromBackup = this.fetchPoliticiansFromBackup.bind(this);

    this.fetchTemplate();
}

YourSenators.prototype.fetchTemplate = function() {
    new AJAX({
        url: 'templates/YourSenators.html' + '?buster=' + Date.now(),
        success: function(e) {
            this.formTemplate = e.target.responseText;
            this.fetchPoliticians();
        }.bind(this)
    });
};

YourSenators.prototype.fetchPoliticians = function() {
    new AJAX({
        url: this.URLs.politicians,
        success: function(e) {
            try {
                var json = JSON.parse(e.target.responseText);

                if (
                    window.global
                    &&
                    global.ajaxResponses
                ) {
                    global.ajaxResponses.politicians = json.feed.entry;
                }

                this.allPoliticians = json.feed.entry;

                this.selectPoliticians();
                this.render();
                this.callback();
            } catch (e) {
                this.fetchPoliticiansFromBackup();
            }
        }.bind(this),
        error: this.fetchPoliticiansFromBackup
    });
};

YourSenators.prototype.fetchPoliticiansFromBackup = function() {
    new AJAX({
        url: this.URLs.politiciansOnGoogle,
        success: function(e) {
            var json = JSON.parse(e.target.responseText);

            if (
                window.global
                &&
                global.ajaxResponses
            ) {
                global.ajaxResponses.politicians = json.feed.entry;
            }

            this.allPoliticians = json.feed.entry;

            this.selectPoliticians();
            this.render();
            this.callback();
        }.bind(this)
    });
};

YourSenators.prototype.selectPoliticians = function() {
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
            );
        });

        this.politicians = [];
        this.politicians[0] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        while (!this.politicians[1] || this.politicians[0] === this.politicians[1]) {
            this.politicians[1] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        }
    }
};

YourSenators.prototype.render = function() {
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
};

module.exports = YourSenators;
