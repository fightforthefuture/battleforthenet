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
// var PetitionForm = require('./PetitionForm');
// var EuropeEmailPetition = require('./EuropeEmailPetition');
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
        new ImagePreloader('/images/Imagesmall.jpg', function() {
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

    /*
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
    */

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
},{"./AJAX":2,"./Chartbeat":3,"./Countdown":4,"./DetectFeatures":5,"./GoogleAnalytics":7,"./ImagePreloader":8,"./LoadingIcon":9,"./MobileMenu":10,"./Modals":11,"./MotherShip":12,"./OrganizationRotation":13,"./Polyfills":14,"./Queue":15,"./ScrollDetection":16,"./SimpleSection":17,"./TeamInternetSection":18,"./TownHallSection":20,"./YourSenators":21}],2:[function(require,module,exports){
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

},{"./Template":19}],12:[function(require,module,exports){
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
  var params = window.location.search.substring(1).split('&')
    .reduce(function(res, val) {
      var parts = val.split('=');
      res[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      return res;
    }, {});

  var org;

  if (params.hasOwnProperty('org')) {
    org = params['org'] || 'fftf';

    // Don't show donate links for non-referral visits
    var donationLinks = document.querySelectorAll('header a.donate');
    for (var i = 0; i < donationLinks.length; i++) {
      donationLinks[i].href = donationLinks[i].getAttribute('href-' + org);
    }
  } else {
    var coinToss = Math.random();

    if (coinToss < .20) {
      // org = 'fp';
      org = 'fftf';
    } else if (coinToss < .60) {
      org = 'dp';
    } else {
      org = 'fftf';
    }
  }

  document.getElementById('org').value = org;

  // Show org disclaimer
  var disclaimers = document.querySelector('.disclaimer')
    .querySelectorAll('.org')

  for (var i = 0; i < disclaimers.length; i++) {
    var classList = disclaimers[i].classList;
    classList.contains(org) ? classList.remove('hidden') : classList.add('hidden');
  }
};

module.exports = OrganizationRotation;

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{"./Template":19}],18:[function(require,module,exports){
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
},{"./SimpleSection":17}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{"./SimpleSection":17}],21:[function(require,module,exports){
function YourSenators(params) {
    params.callback();
}

module.exports = YourSenators;

},{}]},{},[1]);
