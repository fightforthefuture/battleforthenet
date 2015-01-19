function DetectFeatures() {
    this.detectSVG();
}

DetectFeatures.prototype.detectSVG = function detectSVG() {
    var feature = 'http://www.w3.org/TR/SVG11/feature#Image';
    var version = '1.1';
    if (document.implementation.hasFeature(feature, version)) {
        document.body.className += ' svg ';
    }
};

module.exports = DetectFeatures;
