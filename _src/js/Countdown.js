var Template = require('./Template');

// Constants
var DAY = (1000 * 60 * 60 * 24);
var HOUR = (1000 * 60 * 60);
var MINUTE = (1000 * 60);
var SECOND = (1000);

function Countdown(params) {
  this.target = params.target;
  this.template = params.template;

  this.DOMNode = document.querySelector(this.target);

  this.date = params.date;
  this.interval = null;
  this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
  this.tick = this.tick.bind(this);

  this.render();
  this.start();
}

Countdown.prototype.render = function() {
  this.DOMNode.innerHTML = Template(this.template, {});
};

Countdown.prototype.destroy = function() {
  this.stop();

  delete this.date;
  delete this.tick;
};

Countdown.prototype.pad = function(num) {
  return num > 9 ? num : '0' + num;
};

Countdown.prototype.requestAnimationFrame = function() {
  var request = window.requestAnimationFrame || setTimeout;
  request(this.tick);
};

Countdown.prototype.start = function() {
  this.stop();
  this.requestAnimationFrame();
  this.interval = setInterval(this.requestAnimationFrame, 1000);
};

Countdown.prototype.stop = function() {
  clearInterval(this.interval);
};

Countdown.prototype.tick = function() {
  var now = Date.now();
  var diff = Math.max(0, this.date - now);

  this.updateDates(diff);

  if (diff === 0) {
    this.destroy();
    return;
  }
};

Countdown.prototype.updateDates = function(diff) {
  var days = Math.floor(diff / DAY);
  diff -= days * DAY;

  var hours = Math.floor(diff / HOUR);
  diff -= hours * HOUR;

  var minutes = Math.floor(diff / MINUTE);
  diff -= minutes * MINUTE;

  var seconds = Math.floor(diff / SECOND);
  diff -= seconds * SECOND;

  this.DOMNode.querySelector('.days').textContent = this.pad(days);
  this.DOMNode.querySelector('.hours').textContent = this.pad(hours);
  this.DOMNode.querySelector('.minutes').textContent = this.pad(minutes);
  this.DOMNode.querySelector('.seconds').textContent = this.pad(seconds);
};

module.exports = Countdown;
