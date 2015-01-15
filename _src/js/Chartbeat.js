function Chartbeat() {
    this.addGlobals();
    this.addScript();
}

Chartbeat.prototype.addGlobals = function addGlobals() {
    window._sf_startpt = Date.now();
    window._sf_endpt = Date.now();
    window._sf_async_config = {
        domain: 'battleforthenet.com',
        uid: 47331,
        useCanonical: true
    };
};

Chartbeat.prototype.addScript = function addScript() {
    var script = document.createElement('script');
    script.setAttribute('language', 'javascript');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src','//static.chartbeat.com/js/chartbeat.js');
    document.body.appendChild(script);
};

module.exports = Chartbeat;
