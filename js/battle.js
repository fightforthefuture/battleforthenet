(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/index.js":[function(require,module,exports){
(function (global){
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
var MotherShip = require('./MotherShip');
var OrganizationRotation = require('./OrganizationRotation');
var PetitionForm = require('./PetitionForm');
var Polyfills = require('./Polyfills');
var Queue = require('./Queue');
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
    if (global.experiments.alternateHeadline1) {
        document.getElementById('battle').className += ' experiment-alternate-headline-1 ';
        document.querySelector('#battle h1').textContent = '...Until the most important FCC vote of our lifetime.';
    }

    if (global.experiments.alternateExplanation1) {
        document.querySelector('#battle p').textContent = 'The FCC votes February 26th. They\'re planning to *prohibit* ISPs like Comcast from messing with the sites you love. But Comcast\'s friends in Congress want to block the FCC, with fake legislation written... by Comcast. Tell Congress: "Back off, and let the FCC do net neutrality right."';
    }

    if (global.experiments.alternateExplanation2) {
        document.querySelector('#battle p').textContent = 'The FCC is about to listen to the voices of over 4 million Americans and pass strong net neutrality. But Comcast\'s friends in Congress are threatening to block it. Can you contact Congress now?';
    }

    if (global.experiments.removeExplanation) {
        document.querySelector('#battle p').textContent = '';
    }

    if (global.experiments.removeTimer) {
        document.getElementById('battle').className += ' experiment-remove-timer ';
    }

    if (global.experiments.removeHeadline) {
        document.querySelector('#battle h1').textContent = '';
    }

    if (global.experiments.removeNavigation) {
        document.body.className += ' experiment-remove-navigation ';
    }

    // Start the countdown
    setTimeout(function() {
        var countdownDelay = 0;
        if (!global.fontsAreReady) {
            countdownDelay = 128;
        }

        setTimeout(function() {
            var countdown = new Countdown({
                date: new Date(Date.UTC(2015, 1, 26, 15, 30, 0)).getTime()
            });

            new LoadingIcon({
                target: '#battle .spinner'
            });
        }, countdownDelay);
    }, 128);

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

    // Enable mobile menu
    new MobileMenu();

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

    // allPoliticians: global.ajaxResponses.politicians,
    // geography: global.ajaxResponses.geography,

    var LiveURLs = {
        geography: 'https://fftf-geocoder.herokuapp.com',
        politicians: 'https://s3.amazonaws.com/battleforthenet/scoreboard/current.json',
        politiciansOnGoogle: 'https://spreadsheets.google.com/feeds/list/12g70eNkGA2hhRYKSENaeGxsgGyFukLRMHCqrLizdhlw/default/public/values?alt=json'
    };
    var DebugURLs = {
        geography: 'debug/geography.json',
        politicians: 'debug/politicians.json'
    };

    var URLs = LiveURLs;
    // if (location.href.match(/localhost/)) {
    //     URLs = DebugURLs;
    // }

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

            // Experiment: Remove Letter Preview
            if (global.experiments.removeLetterPreview) {
                document.getElementById('battle').className += ' experiment-remove-letter-preview ';
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

        if (
            global.isDesktop
        ) {
            if (
                // Experiment: Remove ActionBar
                !global.experiments.removeActionBar
            ) {
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
            }

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

        // Start queue
        queue.shift()();
    }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/AJAX.js","./ActionBar":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/ActionBar.js","./Chartbeat":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Chartbeat.js","./Countdown":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Countdown.js","./DetectFeatures":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/DetectFeatures.js","./GoogleAnalytics":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/GoogleAnalytics.js","./ImagePreloader":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/ImagePreloader.js","./LoadingIcon":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/LoadingIcon.js","./MobileMenu":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/MobileMenu.js","./Modals":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Modals.js","./MotherShip":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/MotherShip.js","./OrganizationRotation":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/OrganizationRotation.js","./PetitionForm":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/PetitionForm.js","./Polyfills":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Polyfills.js","./Queue":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Queue.js","./SimpleSection":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/SimpleSection.js","./TeamInternetSection":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/TeamInternetSection.js","./YourSenators":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/YourSenators.js"}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/AJAX.js":[function(require,module,exports){
function AJAX(params) {
    this.async = params.async || true;
    this.data = params.data;
    this.error = params.error;
    this.form = params.form;
    this.method = params.method || 'GET';
    this.success = params.success;
    this.url = params.url;

    this.request = new XMLHttpRequest();
    this.request.open(this.method, this.url, this.async);

    if (this.success) {
        this.request.onload = this.success;
    }

    if (this.error) {
        this.request.onerror = this.error;
    }

    if (this.data) {
        var params = '';
        for (var key in this.data) {
            if (params.length !== 0) {
                params += '&';
            }

            params += key + '=' + this.data[key];
        }

        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.request.send(params);
    } else if (this.form) {
        var params = this.serializeForm(this.form);

        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.request.send(params);
    } else {
        this.request.send();
    }

}

AJAX.prototype.serializeForm = function(form) {
    if (!form || form.nodeName !== "FORM") {
        return;
    }

    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue;
        }
        switch (form.elements[i].nodeName) {
        case 'INPUT':
            switch (form.elements[i].type) {
            case 'text':
            case 'hidden':
            case 'password':
            case 'button':
            case 'reset':
            case 'submit':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'checkbox':
            case 'radio':
                if (form.elements[i].checked) {
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                }
                break;
            case 'file':
                break;
            }
            break;
        case 'TEXTAREA':
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
            break;
        case 'SELECT':
            switch (form.elements[i].type) {
            case 'select-one':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'select-multiple':
                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                    if (form.elements[i].options[j].selected) {
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                    }
                }
                break;
            }
            break;
        case 'BUTTON':
            switch (form.elements[i].type) {
            case 'reset':
            case 'submit':
            case 'button':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            }
            break;
        }
    }

    return q.join("&");
};

module.exports = AJAX;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/ActionBar.js":[function(require,module,exports){
(function (global){
var Template = require('./Template');

function ActionBar(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.animateIn();
    this.addEventListeners();
}

ActionBar.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});
};

ActionBar.prototype.animateIn = function() {
    setTimeout(function() {
        var bar = document.querySelector('.action-bar');
        bar.className += ' visible';
        
    }, 100);
}

ActionBar.prototype.addEventListeners = function() {
    var closeNode = this.DOMNode.querySelector('.x');
    closeNode.addEventListener('click', function(e) {
        e.preventDefault();

        var bar = document.querySelector('.action-bar');
        bar.className = bar.className.replace('visible', '');
    });

    document.getElementById('join-tw').addEventListener('click', function(e) {
        e.preventDefault();
        global.modals.display('twitter_modal');
        if (ga) ga('send', 'event', 'button', 'click', 'connect_twitter');
    })
}

module.exports = ActionBar;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Template":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Template.js"}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Chartbeat.js":[function(require,module,exports){
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

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Countdown.js":[function(require,module,exports){
function Countdown(params) {
    this.date = params.date;
    this.interval = null;
    this.introWasShown = false;
    this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    this.targets = {};
    this.tick = this.tick.bind(this);

    this.gatherTargets();
    this.start();
}

Countdown.prototype.constants = {
    day: (1000 * 60 * 60 * 24),
    hour: (1000 * 60 * 60),
    minute: (1000 * 60),
    second: (1000)
};

Countdown.prototype.destroy = function() {
    this.stop();

    delete this.date;
    delete this.targets;
    delete this.tick;
};

Countdown.prototype.gatherTargets = function() {
    this.targets.timer = document.querySelector('#battle .timer');
    this.targets.days = this.targets.timer.querySelector('.days .number');
    this.targets.hours = this.targets.timer.querySelector('.hours .number');
    this.targets.minutes = this.targets.timer.querySelector('.minutes .number');
    this.targets.seconds = this.targets.timer.querySelector('.seconds .number');
};

Countdown.prototype.padNumber = function(number) {
    if (number > 9) {
        return number;
    } else {
        return '0' + number;
    }
};

Countdown.prototype.requestAnimationFrame = function() {
    var request = window.requestAnimationFrame || setTimeout;
    request(this.tick);
};

Countdown.prototype.start = function() {
    this.stop();
    this.requestAnimationFrame();
    this.interval = setInterval(this.requestAnimationFrame, 1000);
};

Countdown.prototype.stop = function() {
    clearInterval(this.interval);
};

Countdown.prototype.showIntro = function() {
    this.targets.timer.className += ' loaded ';
    this.introWasShown = true;
};

Countdown.prototype.tick = function() {
    var now = Date.now();
    var difference = Math.max(0, this.date - now);

    this.updateDates(difference);

    if (!this.introWasShown) {
        this.showIntro();
    }

    if (difference === 0) {
        document.querySelector('#battle h1').textContent = 'The most important FCC vote of our lifetime just happened.';
        this.destroy();
        return;
    }
};

Countdown.prototype.updateDates = function(difference) {
    var days = Math.floor(difference / this.constants.day);
    difference -= days * this.constants.day;

    var hours = Math.floor(difference / this.constants.hour);
    difference -= hours * this.constants.hour;

    var minutes = Math.floor(difference / this.constants.minute);
    difference -= minutes * this.constants.minute;

    var seconds = Math.floor(difference / this.constants.second);
    difference -= seconds * this.constants.second;

    this.targets.days.textContent = this.padNumber(days);
    this.targets.hours.textContent = this.padNumber(hours);
    this.targets.minutes.textContent = this.padNumber(minutes);
    this.targets.seconds.textContent = this.padNumber(seconds);
};

module.exports = Countdown;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/DetectFeatures.js":[function(require,module,exports){
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

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/GUID.js":[function(require,module,exports){
function GUID() {
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function _p8(s) {
    var p = (Math.random().toString(16)+"000000000").substr(2,8);
    return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
}

module.exports = GUID;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/GoogleAnalytics.js":[function(require,module,exports){
function GoogleAnalytics() {
    this.addScript();
}

GoogleAnalytics.prototype.addScript = function addScript() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-26576645-20', 'auto');
    ga('send', 'pageview');
};

module.exports = GoogleAnalytics;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/ImagePreloader.js":[function(require,module,exports){
function ImagePreloader(src, callback) {
    this.callback = callback;
    this.src = src;

    this.img = new Image();
    this.img.src = this.src;
    this.img.onload = this.onLoad.bind(this);
}

ImagePreloader.prototype.onLoad = function(e) {
    this.callback.call(this, this.src);
};

module.exports = ImagePreloader;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/LoadingIcon.js":[function(require,module,exports){
var html = '<div class="timer-spinner"> <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> </div>';

function LoadingIcon(params) {
    var target = document.querySelector(params.target);
    target.innerHTML = html;
    target.className += ' fadeIn';
}

module.exports = LoadingIcon;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/MobileMenu.js":[function(require,module,exports){
function MobileMenu() {
    this.root = document.getElementById('mobile-navigation');
    this.list = this.root.querySelector('ul');
    this.hamburger = this.root.querySelector('.hamburger');
    this.height = (this.list.children.length * 42);

    this.list.expanded = false;

    this.hamburger.addEventListener('click', function(e) {
        e.preventDefault();

        this.list.expanded = !this.list.expanded;
        this.updateExpansionStyles();
    }.bind(this), false);

    this.list.addEventListener('click', function(e) {
        this.list.expanded = false;
        this.updateExpansionStyles();
    }.bind(this), false);
}

MobileMenu.prototype.updateExpansionStyles = function updateExpansionStyles() {
    if (this.list.expanded) {
        this.list.style.height = this.height + 'px';
        this.root.className += ' expanded ';
    } else {
        this.list.style.height = '0';
        this.root.className = this.root.className.replace(/ expanded /, '');
    }
};

module.exports = MobileMenu;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Modals.js":[function(require,module,exports){
var Template = require('./Template');

function Modals(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

Modals.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});

    if (location.href.match(/committees=1/))
        document.getElementById('call_script').textContent = 'Congress shouldn\'t politicize the issue of Net Neutrality in an attempt to score partisan points on an issue so crucial to the future of the Internet, and our country. Millions of people have called on the FCC to adopt strong rules backed by strong legal authority.  Congress should not try to block strong rules by pushing bad legislation, or hauling the FCC into hearings to defend the plan those millions of people called for. Thank you.';
    if (location.href.match(/pia=1/)) {
        document.getElementById('call_header').textContent = 'We\'ll connect you with Congress. When they answer, say:';
        document.getElementById('call_script').textContent = '"Let the FCC do its job and implement net neutrality rules. And do not support the Thune / Upton Proposal, which is just meant to confuse and undermine this process."';
    }
};

Modals.prototype.display = function(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.style.display = 'table';
    setTimeout(function() {
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');
    }, 50);
};
Modals.prototype.hide = function(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.className += 'invisible';
    setTimeout(function() {
        overlayNode.style.display = 'none';
    }, 400);
}

Modals.prototype.addEventListeners = function() {

    var modals = document.getElementsByClassName('overlay');

    var reallyBindEvents = function(modal) {
        modal.querySelector('.gutter').addEventListener('click', function(e) {
            if (e.target === e.currentTarget) {
                e.preventDefault();
                this.hide(modal.id);
            }
        }.bind(this), false);

        modal.querySelector('.modal .close').addEventListener('click', function(e) {
            e.preventDefault();
            this.hide(modal.id);
        }.bind(this), false);

        if (modal.querySelector('.no_thanks'))
            modal.querySelector('.no_thanks').addEventListener('click', function(e) {
                e.preventDefault();
                this.hide(modal.id);
                if (ga) ga('send', 'event', 'button', 'click', 'dismiss_twitter');
            }.bind(this), false);

        if (modal.querySelector('.shareBtn.twitter'))
            modal.querySelector('.shareBtn.twitter').addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://twitter.com/intent/tweet?text='+ encodeURIComponent(GLOBAL_TWEET_TEXT) +'&related=fightfortheftr');
                if (ga) ga('send', 'event', 'button', 'click', 'share_twitter');
            }, false);

        if (modal.querySelector('.shareBtn.facebook'))
            modal.querySelector('.shareBtn.facebook').addEventListener('click', function(e) {
                if (ga) ga('send', 'event', 'button', 'click', 'share_facebook');
            }, false);
    }.bind(this);

    for (var i = 0; i < modals.length; i++) {
        reallyBindEvents(modals[i]);
    }
}

module.exports = Modals;

},{"./Template":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Template.js"}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/MotherShip.js":[function(require,module,exports){
var AJAX = require('./AJAX');
var GUID = require('./GUID');

function MotherShip() {
    this.referrer = document.referrer;
    this.referrerHost = null;

    if (this.hasValidReferrer()) {
        this.sendRequest();
    }
}

MotherShip.prototype.campaign = 'internetcountdown';
MotherShip.prototype.method = 'POST';
MotherShip.prototype.stat = 'click';
MotherShip.prototype.url = 'https://fftf-host-counter.herokuapp.com/log';

MotherShip.prototype.hasValidReferrer = function hasValidReferrer() {
    if (!this.referrer) {
        return false;
    }

    if (document.referrer.match('^' + location.href)) {
        return false;
    }

    if (document.referrer.match('^' + 'https://fightforthefuture.github.io/')) {
        return false;
    }

    this.referrerHost = this.getHostName(this.referrer);

    return true;
};

MotherShip.prototype.getHostName = function getHostName(url) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    var host = url.match(re)[1].toString();
    return host.replace(/^www\./, '');
}

MotherShip.prototype.sendRequest = function sendRequest() {
    new AJAX({
        data: {
            campaign: this.campaign,
            data: location.href,
            host: this.referrerHost,
            session: GUID(),
            stat: this.stat,
        },
        method: this.method,
        url: this.url
    });
};

module.exports = MotherShip;

},{"./AJAX":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/AJAX.js","./GUID":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/GUID.js"}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/OrganizationRotation.js":[function(require,module,exports){
function OrganizationRotation() {
    this.addEventListeners();
}

OrganizationRotation.prototype.addEventListeners = function() {
    var loc = window.location.href;
    var randomOrg = null;
    var chosenOrg = null;
    if (loc.indexOf('org=') == -1) {
        var coin_toss = Math.random();
        if (coin_toss < .20) {
            randomOrg = 'fp';
        } else if (coin_toss < .60) {
            randomOrg = 'dp';
        } else {
            randomOrg = 'fftf';
        }
    }

    if (loc.indexOf('org=fp') != -1 || randomOrg == 'fp') {
        document.getElementById('org').value = 'fp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fp_disclosure').style.display = 'block';

        chosenOrg = 'fp';
    } else if (loc.indexOf('org=dp') != -1 || randomOrg == 'dp') {
        document.getElementById('org').value = 'dp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('dp_disclosure').style.display = 'block';

        chosenOrg = 'dp';
    } else if (loc.indexOf('org=fftf') != -1 || randomOrg == 'fftf') {
        document.getElementById('org').value = 'fftf';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fftf_disclosure').style.display = 'block';

        chosenOrg = 'fftf';
    }

    if (!randomOrg) {
        var donationLinks = document.querySelectorAll('header a.donate');
        for (var i = 0; i < donationLinks.length; i++) {
            donationLinks[i].href = donationLinks[i].getAttribute('href-' + chosenOrg);
        }
    }
};

module.exports = OrganizationRotation;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/PetitionForm.js":[function(require,module,exports){
(function (global){
var AJAX = require('./AJAX');
var Template = require('./Template');


function PetitionForm(params) {
    // Params
    this.formTemplate = params.formTemplate;
    this.target = params.target;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

PetitionForm.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.formTemplate, {});
    this.DOMNode.className = this.DOMNode.className.replace(/loading/, ' ');

};

PetitionForm.prototype.setCountryCode = function(countryCode) {
    this.DOMNode.querySelector('[name="member[country]"]').value = countryCode;
};

PetitionForm.prototype.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

PetitionForm.prototype.validatePhoneNumber = function(num) {
   num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
   num = num.replace("+", "").replace(/\-/g, '');

   if (num.charAt(0) == "1")
       num = num.substr(1);

   if (num.length != 10)
       return false;

   return num;
};

PetitionForm.prototype.addEventListeners = function() {
    var petitionFormNode = this.DOMNode.querySelector('#petition');
    var phoneCallFormNode = this.DOMNode.querySelector('#phone-call-form');
    var senatorsNode = this.DOMNode.querySelector('.your-senators-target');
    var thanksNode = this.DOMNode.querySelector('.thanks');
    var disclaimerNode = this.DOMNode.querySelector('.disclaimer_container');
    var alternativeCTA = phoneCallFormNode.querySelector('.alternative-cta');

    if (
        location.href.match(/call_tool=1/)
        || location.href.match(/committees=1/)
        || location.href.match(/pia=1/)
        ) {
        petitionFormNode.style.display = 'none';
        senatorsNode.style.display = 'none';
        if (location.href.match(/call_tool=1/))
            phoneCallFormNode.querySelector('header').textContent = 'Call Congress and the FCC!';
        else
            phoneCallFormNode.querySelector('header').textContent = 'Can you call Congress now? Enter your number. We\'ll call you back with the script. (We won\'t use your number for anything else)';

        phoneCallFormNode.style.display = 'block';
        disclaimerNode.style.display = 'none';
    }
    alternativeCTA.addEventListener('click', function(e) {
        e.preventDefault();

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        thanksNode.style.display = 'block';
        global.modals.display('share_modal');
    }, false);

    petitionFormNode.querySelector('.right').addEventListener('click', function(e) {
        e.preventDefault();

        window.open('./letter/');
    }, false);

    // Petition Form: Submit event listener
    petitionFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var url = petitionFormNode.getAttribute('action');

        new AJAX({
            url: url,
            method: 'POST',
            form: petitionFormNode,
            success: function(e) {}
        });
        if (ga) ga('send', 'event', 'form', 'submit', 'email');
        if (optimizely.push) {
            optimizely.push(['trackEvent', 'form-submit-email']);
        }

        petitionFormNode.style.display = 'none';
        senatorsNode.style.display = 'none';
        phoneCallFormNode.style.display = 'block';
        disclaimerNode.style.display = 'none';


    }, false);

    phoneCallFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var postalCode = petitionFormNode.elements.zip.value || '';

        if (location.href.match(/committees=1/))
        {
            var campaignId = 'stop-gop-fcc-investigation';
            var postalCode = '55419';
        }
        else if (location.href.match(/pia=1/))
            var campaignId = 'title-x-committees-pia';
        else
            var campaignId = 'jan14th';

        var phoneNumber = phoneCallFormNode.elements.phone.value;

        phoneNumber = this.validatePhoneNumber(phoneNumber);
        if (!phoneNumber) {
            return alert('Please enter a valid US phone number!');
        }

        var url =
            'https://call-congress.fightforthefuture.org/create?' +
            'campaignId=' + campaignId + '&' +
            'userPhone=' + phoneNumber + '&' +
            'zipcode=' + postalCode;

        new AJAX({
            url: url,
            success: function(e) {}
        });
        if (ga) ga('send', 'event', 'form', 'submit', 'call');
        if (optimizely.push) {
            optimizely.push(['trackEvent', 'form-submit-call']);
        }

        global.modals.display('call_modal');

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        senatorsNode.style.display = 'none';
        thanksNode.style.display = 'block';
    }.bind(this), false);
};

PetitionForm.prototype.updateCTA = function updateCTA(cta) {
    this.DOMNode.querySelector('button[type="submit"]').textContent = cta;
};

module.exports = PetitionForm;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/AJAX.js","./Template":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Template.js"}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Polyfills.js":[function(require,module,exports){
function Polyfills() {
    this.bind();
}

Polyfills.prototype.bind = function() {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
};

module.exports = Polyfills;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Queue.js":[function(require,module,exports){
function Queue(params) {
    this.callback = params.callback;
    this.context = params.context || this;
    this.remaining = params.remaining;
}

Queue.prototype.tick = function() {
    this.remaining--;

    if (this.remaining === 0) {
        this.callback.call(this.context);
        this.destroy();
    }
};

Queue.prototype.destroy = function() {
    delete this.callback;
    delete this.context;
};

module.exports = Queue;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/SimpleSection.js":[function(require,module,exports){
var Template = require('./Template');

function SimpleSection(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
}

SimpleSection.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});
};

module.exports = SimpleSection;

},{"./Template":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Template.js"}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/TeamInternetSection.js":[function(require,module,exports){
(function (global){
var SimpleSection = require('./SimpleSection');

function TeamInternetSection(params) {
    this.target = params.target;
    this.template = params.template;
    this.timeout = null;
    this.timeoutDuration = 32;

    this.render();
    this.wrapper = document.querySelector(this.target + ' .supporters');

    this.setBackgrounds();

    if (global.isDesktop) {
        this.quoteBubble = document.querySelector(this.target + ' .quote-bubble');
        this.arrowWrapper = this.quoteBubble.querySelector('.arrow-wrapper');

        this.onHoverEnd = this.onHoverEnd.bind(this);
        this.onHoverStart = this.onHoverStart.bind(this);
        this.onHoverBubbleStart = this.onHoverBubbleStart.bind(this);
        this.onHoverBubbleEnd = this.onHoverBubbleEnd.bind(this);
        this.hideBubble = this.hideBubble.bind(this);

        this.quoteBubbleIsVisible = false;

        this.addQuoteBubble();
    }
}

TeamInternetSection.prototype.render = function render() {
    new SimpleSection({
        target: this.target,
        template: this.template
    });
};

TeamInternetSection.prototype.setBackgrounds = function setBackgrounds() {
    var icons = this.wrapper.querySelectorAll('li');
    var icon, pos;
    for (var i = 0; i < icons.length; i++) {
        icon = icons[i];
        pos = icon.getAttribute('pos') - 1;
        icon.style.backgroundPosition = '0 -' + (pos * 60) + 'px';
    }
};

TeamInternetSection.prototype.addQuoteBubble = function addQuoteBubble() {
    this.wrapper.addEventListener('mouseover', this.onHoverStart, false);
    this.wrapper.addEventListener('mouseout', this.onHoverEnd, false);
    this.quoteBubble.addEventListener('mouseover', this.onHoverBubbleStart, false);
    this.quoteBubble.addEventListener('mouseout', this.onHoverBubbleEnd, false);
    window.addEventListener('resize', this.onHoverEnd, false);
    window.addEventListener('scroll', this.onHoverEnd, false);
};

TeamInternetSection.prototype.onHoverStart = function onHoverStart(e) {
    var name = e.target.getAttribute('name');
    var quote = e.target.getAttribute('quote');

    if (!name || !quote) {
        return;
    }

    clearTimeout(this.timeout);
    this.quoteBubbleIsVisible = true;

    this.quoteBubble.style.display = 'block';
    this.quoteBubble.querySelector('.name').textContent = name;
    this.quoteBubble.querySelector('.quote').textContent = quote;

    var logoRect = e.target.getBoundingClientRect();
    var bubbleRect = this.quoteBubble.getBoundingClientRect();

    var minLeft = 10;
    var maxLeft = document.body.clientWidth - bubbleRect.width - minLeft;
    var targetCenter = logoRect.left + (logoRect.width / 2);
    var targetLeft = targetCenter - (bubbleRect.width / 2);
    var safeLeft = Math.max(minLeft, Math.min(maxLeft, targetLeft));
    var differenceLeft = targetLeft - safeLeft;

    var minTop = 10;
    var maxTop = document.body.clientHeight - bubbleRect.height - minTop;
    var targetTop = logoRect.top - bubbleRect.height;

    this.arrowWrapper.style.marginLeft = (115 + differenceLeft) + 'px';
    this.quoteBubble.style.left = safeLeft + 'px';
    this.quoteBubble.style.top = targetTop + 'px';
};

TeamInternetSection.prototype.onHoverEnd = function onHoverEnd(e) {
    if (!this.quoteBubbleIsVisible) {
        return;
    }

    this.timeout = setTimeout(this.hideBubble, this.timeoutDuration);
};

TeamInternetSection.prototype.onHoverBubbleStart = function onHoverBubbleStart() {
    clearTimeout(this.timeout);
};

TeamInternetSection.prototype.onHoverBubbleEnd = function onHoverBubbleEnd() {
    this.timeout = setTimeout(this.hideBubble, this.timeoutDuration);
};

TeamInternetSection.prototype.hideBubble = function hideBubble() {
    clearTimeout(this.timeout);
    this.quoteBubbleIsVisible = false;
    this.quoteBubble.style.display = 'none';
};

module.exports = TeamInternetSection;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./SimpleSection":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/SimpleSection.js"}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Template.js":[function(require,module,exports){
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
var cache = {};

var Template = function template(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
    cache[str] = cache[str] ||
    Template(document.getElementById(str).innerHTML) :

    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

    // Introduce the data as local variables using with(){}
    "with(obj){p.push('" +

    // Convert the template into pure JavaScript
    str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
            + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
};

module.exports = Template;

},{}],"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/YourSenators.js":[function(require,module,exports){
(function (global){
var AJAX = require('./AJAX');
var Template = require('./Template');

function YourSenators(params) {
    this.callback = params.callback;
    this.geography = params.geography;
    this.politicians = [];
    this.target = params.target;
    this.URLs = params.URLs;

    this.DOMNode = document.querySelector(params.target);

    this.fetchPoliticiansFromBackup = this.fetchPoliticiansFromBackup.bind(this);

    this.fetchTemplate();
}

YourSenators.prototype.fetchTemplate = function() {
    new AJAX({
        url: 'templates/YourSenators.html' + '?buster=' + Date.now(),
        success: function(e) {
            this.formTemplate = e.target.responseText;
            this.fetchPoliticians();
        }.bind(this)
    });
};

YourSenators.prototype.fetchPoliticians = function() {
    new AJAX({
        url: this.URLs.politiciansOnGoogle,
        success: function(e) {
            try {
                var json = JSON.parse(e.target.responseText);

                if (
                    window.global
                    &&
                    global.ajaxResponses
                ) {
                    global.ajaxResponses.politicians = json.feed.entry;
                }

                this.allPoliticians = json.feed.entry;

                this.selectPoliticians();
                this.render();
                this.callback();
            } catch (e) {
                this.fetchPoliticiansFromBackup();
            }
        }.bind(this),
        error: this.fetchPoliticiansFromBackup
    });
};

YourSenators.prototype.fetchPoliticiansFromBackup = function() {
    new AJAX({
        url: this.URLs.politicians,
        success: function(e) {
            var json = JSON.parse(e.target.responseText);

            if (
                window.global
                &&
                global.ajaxResponses
            ) {
                global.ajaxResponses.politicians = json.feed.entry;
            }

            this.allPoliticians = json.feed.entry;

            this.selectPoliticians();
            this.render();
            this.callback();
        }.bind(this)
    });
};

YourSenators.prototype.selectPoliticians = function() {
    if (
        this.geography.country.iso_code === 'US' &&
        this.geography.subdivisions &&
        this.geography.subdivisions[0] &&
        this.geography.subdivisions[0].names &&
        this.geography.subdivisions[0].names.en
    ) {
        var stateName = this.geography.subdivisions[0].names.en;
        this.politicians = this.allPoliticians.filter(function(politician) {
            return (
                (politician.gsx$state.$t === stateName)
                &&
                (politician.gsx$organization.$t === 'Senate')
            );
        });
    }

    if (this.politicians.length === 0) {
        var teamCable = this.allPoliticians.filter(function(politician) {
            return (
                (politician.gsx$team.$t === 'team-cable')
            );
        });

        this.politicians = [];
        this.politicians[0] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        while (!this.politicians[1] || this.politicians[0] === this.politicians[1]) {
            this.politicians[1] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        }
    }
};

YourSenators.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.formTemplate, {
        politicians: this.politicians.map(function(politician) {
            var team = politician.gsx$team.$t;

            var stance = 'undecided';
            if (team === 'team-cable') {
                stance = 'anti internet';
            } else if (team === 'team-internet') {
                stance = 'pro internet';
            }

            var url = 'http://';
            if (politician.gsx$subdomain.$t) {
                url += politician.gsx$subdomain.$t;
            } else {
                url += politician.gsx$first.$t + politician.gsx$name.$t;
            }
            if (politician.gsx$team.$t.trim() === 'team-internet') {
                url += '.savesthe.net';
            } else {
                url += '.breaksthe.net';
            }
            url = url.toLowerCase();

            return {
                image: 'images/scoreboard/' + politician.gsx$imagepleasedontedit.$t,
                name: politician.gsx$name.$t,
                url: url,
                stance: stance,
                team: team
            };
        })
    });
};

module.exports = YourSenators;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/AJAX.js","./Template":"/home/jeff/Documents/htdocs/battleforthenet-www/_src/js/Template.js"}]},{},["./js/index.js"]);
