'use strict';

var AJAX = require('./AJAX');
var Template = require('./Template');
var CallForm = require('./CallForm');
var UTM = require('./UTM');

function Modals(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

Modals.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});

    var buster = '?buster=' + Date.now();

    new AJAX({
      url: '/templates/CallForm.html' + buster,
      success: function(e) {
        new CallForm({
          target: '#thanks_modal main',
          template: e.target.responseText
        });
      }
    });

    if (location.href.match(/committees=1/))
        document.getElementById('call_script').textContent = 'Congress shouldn\'t politicize the issue of Net Neutrality in an attempt to score partisan points on an issue so crucial to the future of the Internet, and our country. Millions of people have called on the FCC to adopt strong rules backed by strong legal authority.  Congress should not try to block strong rules by pushing bad legislation, or hauling the FCC into hearings to defend the plan those millions of people called for. Thank you.';
    if (location.href.match(/title-x-committees=1/)) {
        document.getElementById('call_header').textContent = 'We\'ll connect you with Congress. When they answer, say:';
        document.getElementById('call_script').textContent = '"Let the FCC do its job and implement net neutrality rules. And do not support the Thune / Upton Proposal, which is just meant to confuse and undermine this process."';
    }
};

Modals.prototype.display = function(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.style.display = 'table';
    setTimeout(function() {
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');
    }, 50);
};
Modals.prototype.hide = function(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.className += 'invisible';
    setTimeout(function() {
        overlayNode.style.display = 'none';
    }, 400);
}

Modals.prototype.setUTMContent = function() {

}

Modals.prototype.addEventListeners = function() {
  // Hack to remove twitter-brigade modal from after-action flow
  if ((new UTM()).getSource() === 'etsy') {
    var twitterBrigadeEls = document.querySelectorAll('.twitter-brigade');

    for (var i = 0; i < twitterBrigadeEls.length; i++) {
      twitterBrigadeEls[i].classList.remove('twitter-brigade');
      twitterBrigadeEls[i].classList.add('twitter');
    }
  }

    var modals = document.getElementsByClassName('overlay');

    var reallyBindEvents = function(modal) {
        modal.querySelector('.gutter').addEventListener('click', function(e) {
            if (e.target === e.currentTarget) {
                e.preventDefault();
                this.hide(modal.id);
            }
        }.bind(this), false);

        modal.querySelector('.modal .close').addEventListener('click', function(e) {
            e.preventDefault();
            this.hide(modal.id);
        }.bind(this), false);

        if (modal.querySelector('.no_thanks'))
            modal.querySelector('.no_thanks').addEventListener('click', function(e) {
                e.preventDefault();
                this.hide(modal.id);
                if (ga) ga('send', 'event', 'button', 'click', 'dismiss_twitter');
            }.bind(this), false);

        if (modal.querySelector('.twitter'))
            modal.querySelector('.twitter').addEventListener('click', function(e) {
                if (ga) ga('send', 'event', 'button', 'click', 'share_twitter');
            }, false);

        if (modal.querySelector('.facebook'))
            modal.querySelector('.facebook').addEventListener('click', function(e) {
                if (ga) ga('send', 'event', 'button', 'click', 'share_facebook');
            }, false);

        if (modal.querySelector('.twitter-brigade'))
            modal.querySelector('.twitter-brigade').addEventListener('click', function(e) {
                this.hide(modal.id);
                this.display('twitter_modal');
            }.bind(this), false);
    }.bind(this);

    for (var i = 0; i < modals.length; i++) {
        reallyBindEvents(modals[i]);
    }
}

module.exports = Modals;
