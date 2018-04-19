jQuery(function($) {
    
    // Waypoint Actions
    $('#what-to-do').waypoint(function(direction) {
        if (direction === "up") {
            $("#navigation ul li:last-child a").removeClass('highlight-green');
            $("#join-the-slowdown header a").removeClass('break');
        }
        
        if (direction === "down"){
            $("#navigation ul li:last-child a").addClass('highlight-green');
            $("#join-the-slowdown header a").addClass('break');
        }
    });

    $('section.wall').waypoint(function() {
        photoCloud.init();
        $('a.moar-people').click(function(e) {
          e.preventDefault();
          photoCloud.loadMore();
        });
    }, { offset: '100%', triggerOnce: true });

    
});