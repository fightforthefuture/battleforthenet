var SimpleSection = require('./SimpleSection');

function TownHallSection(params) {
  this.target = params.target;
  this.template = params.template;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.render();
    this.addListeners();
  }
}

TownHallSection.prototype.render = function render() {
  new SimpleSection({
    target: this.target,
    template: this.template
  });

  this.loadWidget();
};

TownHallSection.prototype.addListeners = function addListeners() {
   document.addEventListener('can_embed_loaded', function(e) {
     var zipSubmit = document.getElementById('form-zip_code-submit');

     if (zipSubmit) {
       zipSubmit.value = 'Find a Town Hall';
       zipSubmit.classList.add('text-visible');
     }

     var international = document.querySelector('.international_link-wrap');

     // Remove "Not in the US?" link
     while (international.firstChild) {
      international.removeChild(international.firstChild);
     }

     var meeting = document.createElement('a');
     meeting.classList.add('international_link', 'text-visible');
     meeting.textContent = "Can't attend a town hall this week or don't see a town hall near you? Click here to request a meeting with your lawmakers.";
     meeting.href = "https://actionnetwork.org/forms/request-a-meeting-with-your-lawmakers-to-defend-net-neutrality";
     meeting.target = "_blank";
     international.appendChild(meeting);
   });

   document.addEventListener('can_embed_submitted', function(e) {
     var thanksEl = document.getElementById('can_thank_you');

     if (thanksEl) {
       var share = document.querySelector('.shares-container').cloneNode(true);
       thanksEl.appendChild(share);
     }
   });
};

TownHallSection.prototype.loadWidget = function loadWidget() {
  var script = document.createElement('script');

  script.type = 'text/javascript';
  script.src = 'https://actionnetwork.org/widgets/v2/event_campaign/stand-up-for-net-neutrality-at-town-hall-events?format=js&source=widget&style=full';

  document.body.appendChild(script);
};

module.exports = TownHallSection;
