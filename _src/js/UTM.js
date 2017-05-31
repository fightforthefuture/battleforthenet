'use strict';

function UTM() {
  this.params = new URLSearchParams(window.location.search.substring(1));
}

UTM.prototype.getSource = function() {
  return this.params.has('utm_source') ? this.params.get('utm_source') : '';
};

UTM.prototype.getCampaign = function() {
  return this.params.has('utm_campaign') ? this.params.get('utm_campaign') : '';
};

module.exports = UTM;
