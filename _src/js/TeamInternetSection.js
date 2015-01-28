var SimpleSection = require('./SimpleSection');

function TeamInternetSection(params) {
    this.target = params.target;
    this.template = params.template;

    this.render();
    this.wrapper = document.querySelector(this.target + ' .supporters');

    this.setBackgrounds();

    if (global.isDesktop) {
        this.quoteBubble = document.querySelector(this.target + ' .quote-bubble');

        this.onHoverEnd = this.onHoverEnd.bind(this);
        this.onHoverStart = this.onHoverStart.bind(this);

        this.quoteBubbleIsVisible = false;

        this.addQuoteBubble();
    }
}

TeamInternetSection.prototype.render = function render() {
    new SimpleSection({
        target: this.target,
        template: this.template
    });
};

TeamInternetSection.prototype.setBackgrounds = function setBackgrounds() {
    var icons = this.wrapper.querySelectorAll('li');
    var icon, pos;
    for (var i = 0; i < icons.length; i++) {
        icon = icons[i];
        pos = icon.getAttribute('pos') - 1;
        icon.style.backgroundPosition = '0 -' + (pos * 60) + 'px';
    }
};

TeamInternetSection.prototype.addQuoteBubble = function addQuoteBubble() {
    this.wrapper.addEventListener('mouseover', this.onHoverStart, false);
    this.wrapper.addEventListener('mouseout', this.onHoverEnd, false);
    window.addEventListener('resize', this.onHoverEnd, false);
    window.addEventListener('scroll', this.onHoverEnd, false);
};

TeamInternetSection.prototype.onHoverStart = function onHoverStart(e) {
    this.quoteBubbleIsVisible = true;

    this.quoteBubble.style.display = 'block';
    this.quoteBubble.querySelector('.name').textContent = e.target.getAttribute('name');
    this.quoteBubble.querySelector('.quote').textContent = e.target.getAttribute('quote');
};

TeamInternetSection.prototype.onHoverEnd = function onHoverEnd(e) {
    if (!this.quoteBubbleIsVisible) {
        return;
    }

    this.quoteBubbleIsVisible = false;

    this.quoteBubble.style.display = 'none';
};

module.exports = TeamInternetSection;
