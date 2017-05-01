(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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
//var EuropeEmailPetition = require('./EuropeEmailPetition');
var Polyfills = require('./Polyfills');
var Queue = require('./Queue');
var ScrollDetection = require('./ScrollDetection');
var SimpleSection = require('./SimpleSection');
var TeamInternetSection = require('./TeamInternetSection');
var TownHallSection = require('./TownHallSection');
var YourSenators = require('./YourSenators');


// Detect features & apply polyfills
(function(){
    new DetectFeatures();
    new Polyfills();
})();



// Design enhancements
(function(){
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
                new TeamInternetSection({
                    target: '.team-internet-target',
                    template: e.target.responseText
                });
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
                }
            }
        });

        var queue = [];

        queue.push(function() {
            new AJAX({
                url: 'templates/HowWeWonSection.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.how-we-won-target',
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
                url: 'templates/TownHallSection.html' + buster,
                success: function(e) {
                    new TownHallSection({
                        target: '.town-hall-target',
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

        /*
        queue.push(function() {
            new AJAX({
                url: 'templates/ZeroRatingSection.html' + buster,
                success: function(e) {
                    new SimpleSection({
                        target: '.zero-rating-target',
                        template: e.target.responseText
                    });

                    if (queue.length > 0) {
                        queue.shift()();
                    }
                }
            });
        });
        */
        

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

        new ScrollDetection({
            queue: queue
        });
    }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":2,"./Chartbeat":3,"./Countdown":4,"./DetectFeatures":5,"./GoogleAnalytics":7,"./ImagePreloader":8,"./LoadingIcon":9,"./MobileMenu":10,"./Modals":11,"./MotherShip":12,"./OrganizationRotation":13,"./PetitionForm":14,"./Polyfills":15,"./Queue":16,"./ScrollDetection":17,"./SimpleSection":18,"./TeamInternetSection":19,"./TownHallSection":21,"./YourSenators":22}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
        document.querySelector('#battle h1').textContent = 'The most important FCC vote of our lifetime is happening now.';
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
function GUID() {
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function _p8(s) {
    var p = (Math.random().toString(16)+"000000000").substr(2,8);
    return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
}

module.exports = GUID;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
var html = '<div class="timer-spinner"> <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> </div>';

function LoadingIcon(params) {
    var target = document.querySelector(params.target);
    target.innerHTML = html;
    target.className += ' fadeIn';
}

module.exports = LoadingIcon;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
    if (location.href.match(/title-x-committees=1/)) {
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

        if (modal.querySelector('.twitter'))
            modal.querySelector('.twitter').addEventListener('click', function(e) {
                if (ga) ga('send', 'event', 'button', 'click', 'share_twitter');
            }, false);

        if (modal.querySelector('.facebook'))
            modal.querySelector('.facebook').addEventListener('click', function(e) {
                if (ga) ga('send', 'event', 'button', 'click', 'share_facebook');
            }, false);

        if (modal.querySelector('.twitter-brigade'))
            modal.querySelector('.twitter-brigade').addEventListener('click', function(e) {
                this.hide(modal.id);
                this.display('twitter_modal');
            }.bind(this), false);
    }.bind(this);

    for (var i = 0; i < modals.length; i++) {
        reallyBindEvents(modals[i]);
    }
}

module.exports = Modals;

},{"./Template":20}],12:[function(require,module,exports){
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

},{"./AJAX":2,"./GUID":6}],13:[function(require,module,exports){
function OrganizationRotation() {
    this.addEventListeners();
}

OrganizationRotation.prototype.addEventListeners = function() {
    var loc = window.location.href;
    var randomOrg = null;
    var chosenOrg = null;
    if (loc.indexOf('org=') == -1) {
        var coin_toss = Math.random();
        //if (coin_toss < .20) {
        //    randomOrg = 'fp';
        //} else if (coin_toss < .60) {
        //if (coin_toss < .50) {
        //    randomOrg = 'dp';
        //} else {
            randomOrg = 'fftf';
        //}
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
    } else if (loc.indexOf('org=18mr') != -1 || randomOrg == '18mr') {
        document.getElementById('org').value = '18mr';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('a18mr_disclosure').style.display = 'block';

        chosenOrg = '18mr';
    }

    if (!randomOrg) {
        var donationLinks = document.querySelectorAll('header a.donate');
        for (var i = 0; i < donationLinks.length; i++) {
            donationLinks[i].href = donationLinks[i].getAttribute('href-' + chosenOrg);
        }
    }
};

module.exports = OrganizationRotation;

},{}],14:[function(require,module,exports){
(function (global){
var AJAX = require('./AJAX');
var Template = require('./Template');

var presetIntro = 'Last year the FCC protected the open Internet by passing strong Net Neutrality rules in response to the millions of people who spoke out. But now the same cable and phone companies that fought so hard to destroy Net Neutrality are creating harmful new schemes that pose a serious threat to the open Internet.';

var presetComplaints = {
    comcast: 'Comcast is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe Open Internet rules prevent ISPs from picking winners and losers online by slowing down some websites and applications while speeding up others. But now Comcast has found another way to pick winners and losers: it applies arbitrary data caps, but exempts its own video content while counting all competing video services toward those caps. This is a textbook case of an ISP abusing its power for its own competitive advantage. In addition, Comcast’s caps favor its own traditional cable service by discouraging customers from cutting the cord.\n\nI don’t want Comcast messing with my choice of video services by privileging its own content and punishing the rest. That hurts me, and it hurts the online video services I might use if they compete with Comcast by offering better price, quality and selection.\n\nThere’s no legitimate reason for data caps to exist at all. Comcast has admitted that its caps have nothing to do with managing congestion. Moreover, Comcast is limiting Internet use with data caps while charging a monthly fee for customers to get out from under those caps. This discourages broadband Internet use overall, and especially “cord-cutting” by users who’d rather give up their expensive cable TV packages and watch TV online.\n\nAs a Comcast customer, I should be able to choose freely whether I want to subscribe to Comcast’s traditional cable service or whether I want to watch video online instead— just as I should be able to choose which online video I want to watch. Comcast is interfering with these choices.\n\nAltogether, these practices prove what we’ve always known: Comcast hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by Comcast. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.',
    att:     'AT&T is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe Open Internet rules say that ISPs can’t charge websites and apps to be in the fast lane, so AT&T created another toll: they’re charging websites and apps to be exempted from customers’ data caps. Data shows that users find zero-rated content more attractive than content that counts against their caps. Thus, if web companies want to compete with those who pay, , they’ll need to enroll - for a fee - in AT&T’s sponsored data program. This creates a new toll for data traveling on the Internet and racks up charges for websites, applications, and content providers. Startups, small companies, and non-commercial speakers may face huge barriers if they can’t afford to pay new tolls and no longer have their fair shot at reaching people online. That’s not the kind of Internet I want to have.\n\nThese programs also create perverse incentives for AT&T to keep data caps low: The lower the caps, the more pressure on websites to pay up. Thus, these programs ultimately hurt Internet users like me who have less data to use on the apps they really want to use.\n\nFinally, these plans distort my ability to use the applications of my choice by pushing me and other Internet users toward sites with deep pockets and away from those who can’t afford the toll or don’t want to pay it. They effectively punish me for using sites that don’t pay the toll and unfairly raise the costs of the services that pay AT&T to be zero-rated (who then must pass that cost onto me).\n\nAs an AT&T customer, I don’t want AT&T to turn the Internet into a place where those without a lot of money can no longer compete on an equal footing. That would hurt our economy and our democracy. I request that the FCC investigate AT&T for using this zero rating scheme to skirt the Open Internet rules.\n\nAltogether, these practices prove what we’ve always known: AT&T hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by AT&T. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.',
    verizon: 'Verizon is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe Open Internet rules say that ISPs can’t charge websites and apps to be in the fast lane, so Verizon created another toll: they’re charging websites and apps to be exempted from customers’ data caps. Data shows that users find zero-rated content more attractive than content that counts against their caps. Thus, if web companies want to compete with those who pay, , they’ll need to enroll - for a fee - in Verizon’s sponsored data program. This creates a new toll for data traveling on the Internet and racks up charges for websites, applications, and content providers. Startups, small companies, and non-commercial speakers may face huge barriers if they can’t afford to pay new tolls and no longer have their fair shot at reaching people online. That’s not the kind of Internet I want to have.\n\nThese programs also create perverse incentives for Verizon to keep data caps low: The lower the caps, the more pressure on websites to pay up. Thus, these programs ultimately hurt Internet users like me who have less data to use on the apps they really want to use.\n\nFinally, these plans distort my ability to use the applications of my choice by pushing me and other Internet users toward sites with deep pockets and away from those who can’t afford the toll or don’t want to pay it. They effectively punish me for using sites that don’t pay the toll and unfairly raise the costs of the services that pay Verizon to be zero-rated (who then must pass that cost onto me).\n\nAs an Verizon customer, I don’t want Verizon to turn the Internet into a place where those without a lot of money can no longer compete on an equal footing. That would hurt our economy and our democracy. I request that the FCC investigate Verizon for using this zero rating scheme to skirt the Open Internet rules.\n\nAltogether, these practices prove what we’ve always known: Verizon hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by Verizon. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.',
    tmobile: 'T-Mobile is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe FCC rules say that ISPs can’t be gatekeepers online. T-Mobile exempts the content of select video providers from customers’ data caps as part of its Binge On program, but only if those video providers meet T-Mobile’s substantial technical requirements. This makes it difficult for many start-ups, small players, and non-commercial speakers to join. These exemptions are available for video only, so T-Mobile is favoring some kinds of uses over others.\n\nNot only that, T-Mobile is downgrading all video across its network just to pull off the plan, breaking video on the sites of many independent creators and small services by forcing viewers to sit through the infamous “spinning wheel of death” as videos load or buffer. After coming under fire for this controversy, T-Mobile gave video sites a way to opt out, but they still have to meet specific technical requirements to do that.\n\nThese requirements are a ridiculous and unsustainable burden for small sites, and the idea of requiring special deals to access customers flies in the face of the FCC’s net neutrality rules. Imagine an Internet where small websites had to enter into technical conversations with every single cellphone company in the world, just to make sure their videos were not interfered with!\n\nAltogether, these practices prove what we’ve always known: T-Mobile hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by T-Mobile. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.'
}

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
    var textareaNode = this.DOMNode.querySelector('textarea');
    var tabs = this.DOMNode.querySelectorAll('ul.tabs li a');

    senatorsNode.style.display = 'none'; // JL HACK ~

    if (
        location.href.match(/call_tool=1/)
        || location.href.match(/committees=1/)
        || location.href.match(/title-x-committees=1/)
        || location.href.match(/whitehouse_call=1/)
        ) {
        petitionFormNode.style.display = 'none';
        senatorsNode.style.display = 'none';

        phoneCallFormNode.style.display = 'block';
        disclaimerNode.style.display = 'none';
    }
    alternativeCTA.addEventListener('click', function(e) {
        e.preventDefault();

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        senatorsNode.style.display = 'none';
        thanksNode.style.display = 'block';
        global.modals.display('share_modal');
    }, false);

    textareaNode.addEventListener('click', function(e) {
        textareaNode.classList.add('expanded');
    }, false);

    var formChanged = false;

    textareaNode.addEventListener('change', function(e) {
        formChanged = true;
    });

    var clickTab = function(tab) {
        if (formChanged)
            if (!confirm('You\'ve already started editing your complaint. Are you sure you want to switch companies and start over?'))
                return;

        formChanged = false;

        for (var i = 0; i < tabs.length; i++)
            tabs[i].classList.remove('sel');
        
        var company = tab.className.trim();

        textareaNode.value = presetIntro + '\n\n' + presetComplaints[company];
        document.getElementById('contact_fcc_company').value = company;

        tab.classList.add('sel');
    };

    var bindTabListener = function(tab) {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            clickTab(tab);
        });
    };

    for (var i = 0; i < tabs.length; i++) {
        bindTabListener(tabs[i]);
    }

    clickTab(tabs[Math.floor(Math.random()*tabs.length)]);


    // Petition Form: Submit event listener
    petitionFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        if (document.getElementById('name').value.indexOf(' ') === -1)
            return alert('Please enter a first and last name.');

        var url = petitionFormNode.getAttribute('action');

        document.getElementById('subject').value = document.getElementById('name').value + "'s " + document.getElementById('subject').value

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

        petitionFormNode.style.opacity = 0;
        phoneCallFormNode.style.opacity = 0;

        setTimeout(function() {
            petitionFormNode.style.display = 'none';
            phoneCallFormNode.style.display = 'block';
            disclaimerNode.style.display = 'none';
            setTimeout(function() {
                phoneCallFormNode.style.opacity = 1;
            }, 50);
        }, 800);
        



        senatorsNode.style.display = 'none';
        thanksNode.style.display = 'none';


    }, false);

    phoneCallFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var postalCode = petitionFormNode.elements.zip.value || '';

        if (location.href.match(/title-x-committees=1/))
        {
            var campaignId = 'title-x-committees';
            var postalCode = '55419';
        }
        else if (location.href.match(/committees=1/))
        {
            var campaignId = 'stop-gop-fcc-investigation';
            var postalCode = '55419';
        }
        else if (location.href.match(/whitehouse_call=1/))
        {
            var campaignId = 'sneak-attack-3';
            var postalCode = '55419';
            document.getElementById('call_header').textContent = 'We\'ll connect you with key Senate offices and White House staffers. After each call, you can press * to move to the next office. When they answer, please be polite and say:'
            document.getElementById('call_script').textContent = '"Please do all in your power to make sure that anti-Net Neutrality language is not included in the budget.  To include it would undermine the Internet, the will of millions of Americans, and your political legacy."';
        }
        else {
            var campaignId = 'zero-rating';
            var postalCode = '55419';
        }

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
},{"./AJAX":2,"./Template":20}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
function ScrollDetection(params) {
    this.onScroll = this.onScroll.bind(this);
    this.padding = 900;
    this.queue = params.queue;
    this.showQueuedSections = this.showQueuedSections.bind(this);
    this.timeout = null;

    window.addEventListener('scroll', this.onScroll, false);

    this.showQueuedSections(); // # JL HACK ~ disabled scroll detection
}

ScrollDetection.prototype.showQueuedSections = function showQueuedSections() {
    // Has the user scrolled down enough?
    // JL HACK ~ disabled 2016-02-08 because we need inline links to work
    /*
    if ((innerHeight + scrollY + this.padding) < this.getDocumentHeight()) {
        return;
    }
    */

    window.removeEventListener('scroll', this.onScroll, false);

    if (this.queue.length > 0) {
        this.queue.shift()();
    }
};

ScrollDetection.prototype.getDocumentHeight = function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
};

ScrollDetection.prototype.onScroll = function onScroll(e) {
    clearTimeout(this.timeout);
    setTimeout(this.showQueuedSections, 100);
};

module.exports = ScrollDetection;

},{}],18:[function(require,module,exports){
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

},{"./Template":20}],19:[function(require,module,exports){
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
},{"./SimpleSection":18}],20:[function(require,module,exports){
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
        .replace(/'/g, "&apos;")
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

},{}],21:[function(require,module,exports){
var SimpleSection = require('./SimpleSection');

function TownHallSection(params) {
  this.target = params.target;
  this.template = params.template;

  this.render();
  this.addListeners();
}

TownHallSection.prototype.render = function render() {
  new SimpleSection({
    target: this.target,
    template: this.template
  });

  this.loadWidget();
};

TownHallSection.prototype.addListeners = function addListeners() {
   document.addEventListener('can_embed_loaded', function(e) {
     var zipSubmit = document.getElementById('form-zip_code-submit');

     if (zipSubmit) {
       zipSubmit.value = 'Find a Town Hall';
       zipSubmit.classList.add('text-visible');
     }

     var international = document.querySelector('.international_link-wrap');

     // Remove "Not in the US?" link
     while (international.firstChild) {
      international.removeChild(international.firstChild);
     }

     var meeting = document.createElement('a');
     meeting.classList.add('international_link', 'text-visible');
     meeting.textContent = "Can't attend a town hall this week or don't see a town hall near you? Click here to request a meeting with your lawmakers.";
     meeting.href = "https://actionnetwork.org/forms/request-a-meeting-with-your-lawmakers-to-defend-net-neutrality";
     meeting.target = "_blank";
     international.appendChild(meeting);
   });

   document.addEventListener('can_embed_submitted', function(e) {
     var thanksEl = document.getElementById('can_thank_you');

     if (thanksEl) {
       var share = document.querySelector('.shares-container').cloneNode(true);
       thanksEl.appendChild(share);
     }
   });
};

TownHallSection.prototype.loadWidget = function loadWidget() {
  var script = document.createElement('script');

  script.type = 'text/javascript';
  script.src = 'https://actionnetwork.org/widgets/v2/event_campaign/stand-up-for-net-neutrality-at-town-hall-events?format=js&source=widget&style=full';

  document.body.appendChild(script);
};

module.exports = TownHallSection;

},{"./SimpleSection":18}],22:[function(require,module,exports){
function YourSenators(params) {
    params.callback();
}

module.exports = YourSenators;

},{}]},{},[1]);
