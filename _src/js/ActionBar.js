var Template = require('./Template');

function ActionBar(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.animateIn();
    this.addEventListeners();
}

ActionBar.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});
};

ActionBar.prototype.animateIn = function() {
    setTimeout(function() {
        var bar = document.querySelector('.action-bar');
        bar.className += ' visible';
        
    }, 100);
}

ActionBar.prototype.addEventListeners = function() {
    var closeNode = this.DOMNode.querySelector('.x');
    closeNode.addEventListener('click', function(e) {
        e.preventDefault();

        var bar = document.querySelector('.action-bar');
        bar.className = bar.className.replace('visible', '');
    });

    document.getElementById('join-tw').addEventListener('click', function(e) {
        e.preventDefault();
        global.modals.display('twitter_modal');
    })
}

module.exports = ActionBar;
