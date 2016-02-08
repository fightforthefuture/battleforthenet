function ScrollDetection(params) {
    this.onScroll = this.onScroll.bind(this);
    this.padding = 900;
    this.queue = params.queue;
    this.showQueuedSections = this.showQueuedSections.bind(this);
    this.timeout = null;

    window.addEventListener('scroll', this.onScroll, false);

    this.showQueuedSections(); // # JL HACK ~ disabled scroll detection
}

ScrollDetection.prototype.showQueuedSections = function showQueuedSections() {
    // Has the user scrolled down enough?
    // JL HACK ~ disabled 2016-02-08 because we need inline links to work
    /*
    if ((innerHeight + scrollY + this.padding) < this.getDocumentHeight()) {
        return;
    }
    */

    window.removeEventListener('scroll', this.onScroll, false);

    if (this.queue.length > 0) {
        this.queue.shift()();
    }
};

ScrollDetection.prototype.getDocumentHeight = function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
};

ScrollDetection.prototype.onScroll = function onScroll(e) {
    clearTimeout(this.timeout);
    setTimeout(this.showQueuedSections, 100);
};

module.exports = ScrollDetection;
