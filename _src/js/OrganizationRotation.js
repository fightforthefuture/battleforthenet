'use strict';

function OrganizationRotation(params) {
  this.target = params.target;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.addEventListeners();
  }
}

OrganizationRotation.prototype.addEventListeners = function() {
  var params = new URLSearchParams(window.location.search.substring(1));
  var org;

  if (params.get('org')) {
    org = params.get('org') || 'fftf';

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

  var orgInputEl = this.DOMNode.querySelector('[name="org"]');

  if (orgInputEl) {
    orgInputEl.value = org;
  }

  // Show org disclaimer
  var disclaimers = this.DOMNode.querySelector('.disclaimer')
    .querySelectorAll('.org')

  for (var i = 0; i < disclaimers.length; i++) {
    var classList = disclaimers[i].classList;
    classList.contains(org) ? classList.remove('hidden') : classList.add('hidden');
  }
};

module.exports = OrganizationRotation;
