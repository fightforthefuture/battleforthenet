function OrganizationRotation() {
  this.addEventListeners();
}

OrganizationRotation.prototype.addEventListeners = function() {
  var params = window.location.search.substring(1).split('&')
    .reduce(function(res, val) {
      var parts = val.split('=');
      res[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      return res;
    }, {});

  var org;

  if (params.hasOwnProperty('org')) {
    org = params['org'] || 'fftf';

    // Don't show donate links for non-referral visits
    var donationLinks = document.querySelectorAll('header a.donate');
    for (var i = 0; i < donationLinks.length; i++) {
      donationLinks[i].href = donationLinks[i].getAttribute('href-' + org);
    }
  } else {
    var coinToss = Math.random();

    if (coinToss < .20) {
      org = 'fp';
    } else if (coinToss < .60) {
      org = 'dp';
    } else {
      org = 'fftf';
    }
  }

  document.getElementById('org').value = org;

  // Show org disclaimer
  var disclaimers = document.querySelector('.call-to-action .disclaimer')
    .querySelectorAll('.org')

  for (var i = 0; i < disclaimers.length; i++) {
    var classList = disclaimers[i].classList;
    classList.contains(org) ? classList.remove('hidden') : classList.add('hidden');
  }
};

module.exports = OrganizationRotation;
