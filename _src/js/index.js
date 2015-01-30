var ActionBar = require('./ActionBar');
var AJAX = require('./AJAX');
var Chartbeat = require('./Chartbeat');
var Countdown = require('./Countdown');
var DetectFeatures = require('./DetectFeatures');
var GoogleAnalytics = require('./GoogleAnalytics');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var MobileMenu = require('./MobileMenu');
var Modals = require('./Modals');
var OrganizationRotation = require('./OrganizationRotation');
var PetitionForm = require('./PetitionForm');
var Polyfills = require('./Polyfills');
var Queue = require('./Queue');
var SimpleSection = require('./SimpleSection');
var TeamInternetSection = require('./TeamInternetSection');


// Detect features & apply polyfills
(function(){
    new DetectFeatures();
    new Polyfills();
})();


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

    setTimeout(function() {
        if (!global.fontsAreReady) {
            global.fontsAreReady = true;
            document.body.className += ' loaded slow ';
        }
    }, 300);

    // Enable mobile menu
    new MobileMenu();

    // Analytics
    setTimeout(function() {
        new Chartbeat();
        new GoogleAnalytics();
    }, 1200);
})();



// Load geography & politicians JSON
(function() {
    // Let's selectively bust browser caches
    var buster = '?buster=' + Date.now();

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
            setTimeout(loadMoreSections, 400);
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

    new AJAX({
        url: 'templates/PetitionForm.html' + buster,
        success: function(e) {
            global.ajaxResponses.formTemplate = e.target.responseText;
            ajaxQueue.tick();
        }
    });

    function loadMoreSections() {
        var queue = [];

        queue.push(function() {
            new AJAX({
                url: 'templates/TeamCableSection.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.team-cable-target',
                        template: e.target.responseText
                    });

                    if (queue.length > 0) {
                        queue.shift()();
                    }
                }
            });
        });

        queue.push(function() {
            new AJAX({
                url: 'templates/TeamInternetSection.html' + buster,
                success: function(e) {
                    new TeamInternetSection({
                        target: '.team-internet-target',
                        template: e.target.responseText
                    });

                    if (queue.length > 0) {
                        queue.shift()();
                    }
                }
            });
        });

        queue.push(function() {
            new AJAX({
                url: 'templates/LearnMoreSection.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.learn-more-target',
                        template: e.target.responseText
                    });

                    if (queue.length > 0) {
                        queue.shift()();
                    }
                }
            });
        });

        queue.push(function() {
            new AJAX({
                url: 'templates/Footer.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.footer-target',
                        template: e.target.responseText
                    });

                    if (queue.length > 0) {
                        queue.shift()();
                    }
                }
            });
        });

        if (global.isDesktop) {
            queue.push(function() {
                new AJAX({
                    url: 'templates/ActionBar.html' + buster,
                    success: function(e) {
                        new ActionBar({
                            target: '.actionbar-target',
                            template: e.target.responseText
                        });

                        if (queue.length > 0) {
                            queue.shift()();
                        }
                    }
                });
            });

            queue.push(function() {
                new AJAX({
                    url: 'templates/PoliticalScoreboardSection.html' + buster,
                    success: function(e) {
                        new SimpleSection({
                            target: '.scoreboard-target',
                            template: e.target.responseText
                        });

                        loadJS('js/scoreboard.js' + buster, true);

                        if (queue.length > 0) {
                            queue.shift()();
                        }
                    }
                });
            });

            queue.push(function() {
                new AJAX({
                    url: 'templates/ShareButtons.html' + buster,
                    success: function(e) {
                        new SimpleSection({
                            target: '.share-buttons-target',
                            template: e.target.responseText
                        });

                        document.querySelector('.sharing-buttons').querySelector('.twitter').addEventListener('click', function(e) {
                            e.preventDefault();
                            window.open('https://twitter.com/intent/tweet?text='+ encodeURIComponent(GLOBAL_TWEET_TEXT) +'&related=fightfortheftr');
                            if (ga) ga('send', 'event', 'button', 'click', 'share_twitter');
                        }, false);

                        document.querySelector('.sharing-buttons').querySelector('.facebook').addEventListener('click', function(e) {
                            if (ga) ga('send', 'event', 'button', 'click', 'share_facebook');
                        }, false);

                        if (queue.length > 0) {
                            queue.shift()();
                        }
                    }
                });
            });
        }

        queue.push(function() {
            new AJAX({
                url: 'templates/Modals.html' + buster,
                success: function(e) {
                    global.modals = new Modals({
                        target: '.modals-target',
                        template: e.target.responseText
                    });

                    if (location.href.match(/sharing_modal=1/)) {
                        global.modals.display('call_modal');
                    }
                    if (location.href.match(/twitter_modal=1/)) {
                        global.modals.display('twitter_modal');
                    }

                    if (document.referrer.indexOf('//t.co') != -1)
                        global.modals.display('twitter_modal');

                    if (queue.length > 0) {
                        queue.shift()();
                    }
                }
            });
        });


        queue.push(function() {
            // Show the spinner
            new LoadingIcon({
                target: '#battle .spinner'
            });
        });

        // Start queue
        queue.shift()();
    }
})();
