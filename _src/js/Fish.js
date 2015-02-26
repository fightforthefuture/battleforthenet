function Fish() {
    this.spawn();

    this.moveTail = this.moveTail.bind(this);
    this.moveTailDelay = 160;
    this.moveTailPhase = 0;
    this.moveTailInterval = setInterval(this.moveTail, this.moveTailDelay);

    this.moveFishRandomly = this.moveFishRandomly.bind(this);
    this.moveFishRandomlyInterval = setInterval(this.moveFishRandomly, 6400);
}

Fish.prototype.spawn = function() {
    this.element = document.createElement('div');
    this.element.id = 'fish';
    this.element.title = 'We won!';
    this.element.style.top = '-100px';
    this.element.style.right = (((outerWidth - 860) / 2) + (Math.random() * 64)) + 'px';

    this.body = document.createElement('div');
    this.body.className = 'body';
    this.element.appendChild(this.body);

    this.tail = document.createElement('div');
    this.tail.className = 'tail';
    this.element.appendChild(this.tail);

    document.body.appendChild(this.element);
};

Fish.prototype.moveFishRandomly = function() {
    this.element.style.right = (((outerWidth - 860) / 2) + (Math.random() * 64)).toFixed(4) + 'px';
    this.element.style.top = (94 + (Math.random() * 32)).toFixed(4) + 'px';
};

Fish.prototype.moveTail = function() {
    this.moveTailPhase++;
    if (this.moveTailPhase > 2) {
        this.moveTailPhase = 0;
    }

    this.tail.style.left = (76 - (this.moveTailPhase * 2)) + 'px';
};

module.exports = Fish;
