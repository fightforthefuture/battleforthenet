var Template = require('./Template');

function CallForm(params) {
  this.target = params.target;
  this.template = params.template;
  this.campaign = params.campaign;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.render();
    this.addEventListeners();
  }
}

CallForm.prototype.render = function() {
  var data;

  switch (this.campaign) {
    case 'daily':
      data = {
        action: 'https://demandprogress.callpower.org/call/create',
        campaignId: '1'
      }
      break;
    default:
      data = {
        action: 'https://call-congress.fightforthefuture.org/create',
        campaignId: 'battleforthenet-2017'
      }
  }

  this.DOMNode.innerHTML = Template(this.template, data);
};

CallForm.prototype.validatePhoneNumber = function(phone) {
  // Remove spaces, parentheses, dashes
  phone = phone.replace(/\s/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\-/g, '');

  // Remove country code
  // TODO: Add support for non-US country codes on backend?
  phone = phone.replace('+', '')
  if (phone.charAt(0) == '1') phone = phone.substr(1);

  // Return formatted phone number if valid
  return phone.length == 10 ? phone : false;
};

CallForm.prototype.logStatus = function(e) {
  var xhr = e.currentTarget;

  switch (xhr.status) {
    case 0:
      // TODO: display error modal here instead
      alert('If you are using Privacy Badger or another ad blocker, please allow requests to https://call-congress.fightforthefuture.org and try again.')
    default:
      console.log(xhr.status, xhr.statusText);
  }
};

CallForm.prototype.addEventListeners = function() {
  var form = this.DOMNode.querySelector('form');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var phone = this.validatePhoneNumber(form.querySelector('input[type=tel]').value);

    if (!phone) return alert('Please enter a valid US phone number!');

    var data = new FormData();
    data.append('userPhone', phone);
    data.append('campaignId', form.querySelector('input[name="campaignId"]').value);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', this.logStatus);
    xhr.addEventListener('error', this.logStatus);

    xhr.open('post', form.action, true);
    xhr.send(data);

    global.modals.hide('thanks_modal');
    global.modals.display('call_modal');
  }.bind(this));
};

module.exports = CallForm;
