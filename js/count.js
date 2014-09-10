jQuery(function($) {
    setTimeout(function() {
        var numAnim = new countUp("animated-count", 100000000, 440000000, 0, 3.3);
        numAnim.start();
    }, 1000);
});
