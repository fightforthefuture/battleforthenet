function OrganizationRotation() {
    this.addEventListeners();
}

OrganizationRotation.prototype.addEventListeners = function() {
    var loc = window.location.href;
    var randomOrg = null;
    var chosenOrg = null;
    if (loc.indexOf('org=') == -1) {
        var coin_toss = Math.random();
        //if (coin_toss < .20) {
        //    randomOrg = 'fp';
        //} else if (coin_toss < .60) {
        //if (coin_toss < .50) {
        //    randomOrg = 'dp';
        //} else {
            randomOrg = 'fftf';
        //}
    }

    if (loc.indexOf('org=fp') != -1 || randomOrg == 'fp') {
        document.getElementById('org').value = 'fp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fp_disclosure').style.display = 'block';

        chosenOrg = 'fp';
    } else if (loc.indexOf('org=dp') != -1 || randomOrg == 'dp') {
        document.getElementById('org').value = 'dp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('dp_disclosure').style.display = 'block';

        chosenOrg = 'dp';
    } else if (loc.indexOf('org=fftf') != -1 || randomOrg == 'fftf') {
        document.getElementById('org').value = 'fftf';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fftf_disclosure').style.display = 'block';

        chosenOrg = 'fftf';
    } else if (loc.indexOf('org=18mr') != -1 || randomOrg == '18mr') {
        document.getElementById('org').value = '18mr';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('a18mr_disclosure').style.display = 'block';

        chosenOrg = '18mr';
    }

    if (!randomOrg) {
        var donationLinks = document.querySelectorAll('header a.donate');
        for (var i = 0; i < donationLinks.length; i++) {
            donationLinks[i].href = donationLinks[i].getAttribute('href-' + chosenOrg);
        }
    }
};

module.exports = OrganizationRotation;
