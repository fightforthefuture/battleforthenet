var AJAX = require('./AJAX');
var Countdown = require('./Countdown');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var MobileMenu = require('./MobileMenu');
var OrganizationRotation = require('./OrganizationRotation');
var PetitionForm = require('./PetitionForm');
var Queue = require('./Queue');
var SimpleSection = require('./SimpleSection');



// Design enhancements
(function(){
    // Start the countdown
    setTimeout(function() {
        var countdownDelay = 0;
        if (!global.fontsAreReady) {
            countdownDelay = 1000;
        }

        setTimeout(function() {
            var countdown = new Countdown({
                date: new Date(Date.UTC(2015, 1, 26, 15, 30, 0)).getTime()
            });
        }, countdownDelay);
    }, 200);

    // Preload the background
    new ImagePreloader('./images/Imagesmall.jpg', function() {
        var background = document.getElementById('background');
        background.className += ' fadeIn ';
        background.style.backgroundImage = 'url(' + this.src + ')';
    });

    // Show the spinner
    new LoadingIcon({
        target: '#battle .spinner'
    });

    setTimeout(function() {
        if (!global.fontsAreReady) {
            global.fontsAreReady = true;
            document.body.className += ' loaded slow ';
        }
    }, 1200);

    // Enable mobile menu
    new MobileMenu();
})();



// Load geography & politicians JSON
(function() {
    global.ajaxResponses = {};
    var ajaxQueue = new Queue({
        callback: function() {
            var pleaseWaitNode = document.querySelector('#battle .please-wait');
            pleaseWaitNode.parentNode.removeChild(pleaseWaitNode);

            new PetitionForm({
                allPoliticians: global.ajaxResponses.politicians,
                formTemplate: global.ajaxResponses.formTemplate,
                geography: global.ajaxResponses.geography,
                target: '#battle .form-wrapper'
            });

            // Rotate organizations
            new OrganizationRotation();

            // Add more sections
            loadMoreSections();
        },
        remaining: 3
    });

    var LiveURLs = {
        geography: 'https://fftf-geocoder.herokuapp.com',
        politicians: 'https://s3.amazonaws.com/battleforthenet/scoreboard/current.json'
    };
    var DebugURLs = {
        geography: 'debug/geography.json',
        politicians: 'debug/politicians.json'
    };

    var URLs;
    if (location.href.match(/localhost/)) {
        URLs = DebugURLs;
    } else {
        URLs = LiveURLs;
    }

    new AJAX({
        url: URLs.geography,
        success: function(e) {
            var json = JSON.parse(e.target.responseText);
            global.ajaxResponses.geography = json;
            ajaxQueue.tick();
        }
    });

    new AJAX({
        url: URLs.politicians,
        success: function(e) {
            var json = JSON.parse(e.target.responseText);
            global.ajaxResponses.politicians = json.feed.entry;
            ajaxQueue.tick();
        }
    });

    // Let's selectively bust browser caches
    var buster = '?buster=' + Date.now();

    new AJAX({
        url: 'templates/PetitionForm.html' + buster,
        success: function(e) {
            global.ajaxResponses.formTemplate = e.target.responseText;
            ajaxQueue.tick();
        }
    });

    function loadMoreSections() {
        new AJAX({
            url: 'templates/TeamCableSection.html' + buster,
            success: function(e) {
                new SimpleSection({
                    target: '.team-cable-target',
                    template: e.target.responseText
                });
            }
        });

        new AJAX({
            url: 'templates/TeamInternetSection.html' + buster,
            success: function(e) {
                new SimpleSection({
                    target: '.team-internet-target',
                    template: e.target.responseText
                });
            }
        });

        new AJAX({
            url: 'templates/LearnMoreSection.html' + buster,
            success: function(e) {
                new SimpleSection({
                    target: '.learn-more-target',
                    template: e.target.responseText
                });
            }
        });

        new AJAX({
            url: 'templates/Footer.html' + buster,
            success: function(e) {
                new SimpleSection({
                    target: '.footer-target',
                    template: e.target.responseText
                });
            }
        });

        if (!navigator.userAgent.match(/mobile/i)) {
            new AJAX({
                url: 'templates/PoliticalScoreboardSection.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.scoreboard-target',
                        template: e.target.responseText
                    });

                    loadJS('js/scoreboard.js' + buster, true);
                }
            });
        }

        new AJAX({
            url: 'templates/Modals.html' + buster,
            success: function(e) {
                new SimpleSection({
                    target: '.modals-target',
                    template: e.target.responseText
                });

                // Shortcut
                var overlayNode = document.querySelector('.overlay');

                // Watch for testing URL
                if (location.href.match(/sharing_modal=1/)) {
                    overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');
                }

                overlayNode.querySelector('.gutter').addEventListener('click', function(e) {
                    if (e.target === e.currentTarget) {
                        e.preventDefault();
                        overlayNode.className += ' invisible ';
                    }
                }, false);

                overlayNode.querySelector('.modal .close').addEventListener('click', function(e) {
                    e.preventDefault();
                    overlayNode.className += ' invisible ';
                }, false);

                overlayNode.querySelector('.shareBtn.twitter').addEventListener('click', function(e) {
                    e.preventDefault();
                    window.open('https://twitter.com/intent/tweet?text='+ encodeURIComponent(GLOBAL_TWEET_TEXT) +'&related=fightfortheftr');
                }, false);
            }
        });
    }
})();
