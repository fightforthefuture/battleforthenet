jQuery(function($) {
    setTimeout(function() {
        var baseline = 4400000;
        var calls = 80603;
        var comments = 451387;
        var numAnim = new countUp("animated-count", baseline, baseline + calls + comments, 0, 5.87);
        numAnim.start();
    }, 2500);
});
