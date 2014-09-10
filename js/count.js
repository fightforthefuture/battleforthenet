jQuery(function($) {
    setTimeout(function() {
        var baseline = 440000000;
        var calls = 80603;
        var comments = 451387;
        var numAnim = new countUp("animated-count", baseline, baseline + calls + comments, 0, 3.3);
        numAnim.start();
    }, 2500);
});
