var SimpleSection = require('./SimpleSection');

function TeamInternetSection(params) {
    this.target = params.target;
    this.template = params.template;
    this.timeout = null;
    this.timeoutDuration = 32;

    this.render();
    this.wrapper = document.querySelector(this.target + ' .supporters');

    if (this.wrapper) {
      this.setBackgrounds();

      if (!window.navigator.userAgent.match(/mobile/i)) {
          this.quoteBubble = document.querySelector(this.target + ' .quote-bubble');
          this.arrowWrapper = this.quoteBubble.querySelector('.arrow-wrapper');

          this.onHoverEnd = this.onHoverEnd.bind(this);
          this.onHoverStart = this.onHoverStart.bind(this);
          this.onHoverBubbleStart = this.onHoverBubbleStart.bind(this);
          this.onHoverBubbleEnd = this.onHoverBubbleEnd.bind(this);
          this.hideBubble = this.hideBubble.bind(this);

          this.quoteBubbleIsVisible = false;

          this.addQuoteBubble();
      }
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
    this.quoteBubble.addEventListener('mouseover', this.onHoverBubbleStart, false);
    this.quoteBubble.addEventListener('mouseout', this.onHoverBubbleEnd, false);
    window.addEventListener('resize', this.onHoverEnd, false);
    window.addEventListener('scroll', this.onHoverEnd, false);
};

TeamInternetSection.prototype.onHoverStart = function onHoverStart(e) {
    var name = e.target.getAttribute('name');
    var quote = e.target.getAttribute('quote');

    if (!name || !quote) {
        return;
    }

    clearTimeout(this.timeout);
    this.quoteBubbleIsVisible = true;

    this.quoteBubble.style.display = 'block';
    this.quoteBubble.querySelector('.name').textContent = name;
    this.quoteBubble.querySelector('.quote').textContent = quote;

    var logoRect = e.target.getBoundingClientRect();
    var bubbleRect = this.quoteBubble.getBoundingClientRect();

    var minLeft = 10;
    var maxLeft = document.body.clientWidth - bubbleRect.width - minLeft;
    var targetCenter = logoRect.left + (logoRect.width / 2);
    var targetLeft = targetCenter - (bubbleRect.width / 2);
    var safeLeft = Math.max(minLeft, Math.min(maxLeft, targetLeft));
    var differenceLeft = targetLeft - safeLeft;

    var minTop = 10;
    var maxTop = document.body.clientHeight - bubbleRect.height - minTop;
    var targetTop = logoRect.top - bubbleRect.height;

    this.arrowWrapper.style.marginLeft = (115 + differenceLeft) + 'px';
    this.quoteBubble.style.left = safeLeft + 'px';
    this.quoteBubble.style.top = targetTop + 'px';
};

TeamInternetSection.prototype.onHoverEnd = function onHoverEnd(e) {
    if (!this.quoteBubbleIsVisible) {
        return;
    }

    this.timeout = setTimeout(this.hideBubble, this.timeoutDuration);
};

TeamInternetSection.prototype.onHoverBubbleStart = function onHoverBubbleStart() {
    clearTimeout(this.timeout);
};

TeamInternetSection.prototype.onHoverBubbleEnd = function onHoverBubbleEnd() {
    this.timeout = setTimeout(this.hideBubble, this.timeoutDuration);
};

TeamInternetSection.prototype.hideBubble = function hideBubble() {
    clearTimeout(this.timeout);
    this.quoteBubbleIsVisible = false;
    this.quoteBubble.style.display = 'none';
};

module.exports = TeamInternetSection;
