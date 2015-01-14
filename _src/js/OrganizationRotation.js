function OrganizationRotation() {
    this.addEventListeners();
}

OrganizationRotation.prototype.addEventListeners = function() {
    var loc = window.location.href;
    random_org = null;
    if (loc.indexOf('org=') == -1) {
        var coin_toss = Math.random();
        if (coin_toss < .20) {
            random_org = 'fp';
        } else if (coin_toss < .60) {
            random_org = 'dp';
        } else {
            random_org = 'fftf';
        }
    }

    if (loc.indexOf('org=fp') != -1 || random_org == 'fp') {
        document.getElementById('org').value = 'fp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fp_disclosure').style.display = 'block';
    } else if (loc.indexOf('org=dp') != -1 || random_org == 'dp') {
        document.getElementById('org').value = 'dp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('dp_disclosure').style.display = 'block';
    } else if (loc.indexOf('org=fftf') != -1 || random_org == 'fftf') {
        document.getElementById('org').value = 'fftf';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fftf_disclosure').style.display = 'block';
    }
};

module.exports = OrganizationRotation;
