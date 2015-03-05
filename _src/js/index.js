var AJAX = require('./AJAX');
var Chartbeat = require('./Chartbeat');
var Countdown = require('./Countdown');
var DetectFeatures = require('./DetectFeatures');
var Fish = require('./Fish');
var GoogleAnalytics = require('./GoogleAnalytics');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var MobileMenu = require('./MobileMenu');
var Modals = require('./Modals');
var MotherShip = require('./MotherShip');
var OrganizationRotation = require('./OrganizationRotation');
var PetitionForm = require('./PetitionForm');
var Polyfills = require('./Polyfills');
var Queue = require('./Queue');
var ScrollDetection = require('./ScrollDetection');
var SimpleSection = require('./SimpleSection');
var TeamInternetSection = require('./TeamInternetSection');
var YourSenators = require('./YourSenators');


// Detect features & apply polyfills
(function(){
    new DetectFeatures();
    new Polyfills();
})();



// Design enhancements
(function(){
    // Cause baby you're a firework...
    if (global.isDesktop) {
        require('./Fireworks');
        new Fish();
    }

    // Preload the background
    setTimeout(function() {
        new ImagePreloader('./images/Imagesmall.jpg', function() {
            var background = document.getElementById('background');
            background.className += ' fadeIn ';
            background.style.backgroundImage = 'url(' + this.src + ')';
        });
    }, 128);

    setTimeout(function() {
        if (!global.fontsAreReady) {
            global.fontsAreReady = true;
            document.body.className += ' loaded slow ';
        }
    }, 256);

    // Let's bust the bfcache
    window.addEventListener('unload', function() {});

    // Analytics
    setTimeout(function() {
        new Chartbeat();
        new GoogleAnalytics();
        new MotherShip();
    }, 1200);
})();



// Load geography & politicians JSON
(function() {
    // Let's selectively bust browser caches
    var buster = '?buster=' + Date.now();

    var URLs = {
        geography: 'https://fftf-geocoder.herokuapp.com',
        politicians: 'https://cache.battleforthenet.com/politicians.json',
        politiciansOnGoogle: 'https://spreadsheets.google.com/feeds/list/12g70eNkGA2hhRYKSENaeGxsgGyFukLRMHCqrLizdhlw/default/public/values?alt=json'
    };

    new AJAX({
        url: 'templates/PetitionForm.html' + buster,
        success: function(e) {
            var pleaseWaitNode = document.querySelector('#battle .please-wait');
            pleaseWaitNode.parentNode.removeChild(pleaseWaitNode);

            var petitionForm = new PetitionForm({
                formTemplate: e.target.responseText,
                target: '#battle .form-wrapper'
            });

            if (global.experiments.alternatePetitionCTA1) {
                petitionForm.updateCTA('WRITE CONGRESS');
            }

            if (global.experiments.alternatePetitionCTA2) {
                petitionForm.updateCTA('WRITE CONGRESS NOW');
            }

            if (global.experiments.alternatePetitionCTA3) {
                petitionForm.updateCTA('WRITE THEM NOW');
            }

            if (global.experiments.alternatePetitionCTA4) {
                petitionForm.updateCTA('TAKE ACTION');
            }

            if (global.experiments.alternatePetitionCTA5) {
                petitionForm.updateCTA('WRITE YOUR SENATORS');
            }

            // Rotate organizations
            new OrganizationRotation();

            // Get geography
            new AJAX({
                url: URLs.geography,
                success: function(e) {
                    // Parse JSON
                    var response = JSON.parse(e.target.responseText);

                    // Save for later
                    global.ajaxResponses.geography = response;

                    // Update country field
                    petitionForm.setCountryCode(response.country.iso_code);

                    new YourSenators({
                        callback: loadMoreSections,
                        geography: response,
                        target: '.your-senators-target',
                        URLs: URLs
                    });
                }
            });
        }
    });

    function loadMoreSections() {
        new AJAX({
            url: 'templates/FCCSection.html' + buster,
            success: function(e) {
                new SimpleSection({
                    target: '.fcc-target',
                    template: e.target.responseText
                });
            }
        });

        new AJAX({
            url: 'templates/TeamInternetSection.html' + buster,
            success: function(e) {
                new TeamInternetSection({
                    target: '.team-internet-target',
                    template: e.target.responseText
                });
            }
        });

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
            }
        });


        new AJAX({
            url: 'templates/Modals.html' + buster,
            success: function(e) {
                global.modals = new Modals({
                    target: '.modals-target',
                    template: e.target.responseText
                });

                if (location.href.match(/sharing_modal=1/)) {
                    global.modals.display('call_modal');
                } else if (location.href.match(/twitter_modal=1/)) {
                    global.modals.display('twitter_modal');
                } else if (document.referrer.indexOf('//t.co') != -1) {
                    global.modals.display('twitter_modal');
                }
            }
        });

        var queue = [];

        queue.push(function() {
            new AJAX({
                url: 'templates/GrumpyCatSection.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.grumpy-cat-target',
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
        }

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
                url: 'templates/ExtraReading.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.extra-reading-target',
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

        new ScrollDetection({
            queue: queue
        });
    }
})();
