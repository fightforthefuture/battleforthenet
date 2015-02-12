var AJAX = require('./AJAX');
var GUID = require('./GUID');

function MotherShip() {
    this.referrer = document.referrer;
    this.referrerHost = null;

    if (this.hasValidReferrer()) {
        this.sendRequest();
    }
}

MotherShip.prototype.campaign = 'internetcountdown';
MotherShip.prototype.method = 'POST';
MotherShip.prototype.stat = 'click';
MotherShip.prototype.url = 'https://fftf-host-counter.herokuapp.com/log';

MotherShip.prototype.hasValidReferrer = function hasValidReferrer() {
    if (!this.referrer) {
        return false;
    }

    if (document.referrer.match('^' + location.href)) {
        return false;
    }

    if (document.referrer.match('^' + 'https://fightforthefuture.github.io/')) {
        return false;
    }

    this.referrerHost = this.getHostName(this.referrer);

    return true;
};

MotherShip.prototype.getHostName = function getHostName(url) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    return url.match(re)[1].toString();
}

MotherShip.prototype.sendRequest = function sendRequest() {
    new AJAX({
        data: {
            campaign: this.campaign,
            data: location.href,
            host: this.referrerHost,
            session: GUID(),
            stat: this.stat,
        },
        method: this.method,
        url: this.url
    });
};

module.exports = MotherShip;
