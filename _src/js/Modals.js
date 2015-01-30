var Template = require('./Template');

function Modals(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

Modals.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});
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

Modals.prototype.addEventListeners = function() {

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

        if (modal.querySelector('.shareBtn.twitter'))
            modal.querySelector('.shareBtn.twitter').addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://twitter.com/intent/tweet?text='+ encodeURIComponent(GLOBAL_TWEET_TEXT) +'&related=fightfortheftr');
                if (ga) ga('send', 'event', 'button', 'click', 'share_twitter');
            }, false);

        if (modal.querySelector('.shareBtn.facebook'))
            modal.querySelector('.shareBtn.facebook').addEventListener('click', function(e) {
                if (ga) ga('send', 'event', 'button', 'click', 'share_facebook');
            }, false);
    }.bind(this);

    for (var i = 0; i < modals.length; i++) {
        reallyBindEvents(modals[i]);
    }
}

module.exports = Modals;
