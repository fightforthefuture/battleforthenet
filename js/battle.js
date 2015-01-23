(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/index.js":[function(require,module,exports){
(function (global){
var AJAX = require('./AJAX');
var Chartbeat = require('./Chartbeat');
var Countdown = require('./Countdown');
var DetectFeatures = require('./DetectFeatures');
var GoogleAnalytics = require('./GoogleAnalytics');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var MobileMenu = require('./MobileMenu');
var OrganizationRotation = require('./OrganizationRotation');
var PetitionForm = require('./PetitionForm');
var Polyfills = require('./Polyfills');
var Queue = require('./Queue');
var SimpleSection = require('./SimpleSection');


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

    new AJAX({
        url: 'templates/PetitionForm.html' + buster,
        success: function(e) {
            var pleaseWaitNode = document.querySelector('#battle .please-wait');
            pleaseWaitNode.parentNode.removeChild(pleaseWaitNode);

            new PetitionForm({
                formTemplate: e.target.responseText,
                target: '#battle .form-wrapper'
            });

            // Rotate organizations
            new OrganizationRotation();

            // Add more sections
            setTimeout(loadMoreSections, 400);
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
                    new SimpleSection({
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\AJAX.js","./Chartbeat":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Chartbeat.js","./Countdown":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Countdown.js","./DetectFeatures":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\DetectFeatures.js","./GoogleAnalytics":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\GoogleAnalytics.js","./ImagePreloader":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\ImagePreloader.js","./LoadingIcon":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\LoadingIcon.js","./MobileMenu":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\MobileMenu.js","./OrganizationRotation":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\OrganizationRotation.js","./PetitionForm":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\PetitionForm.js","./Polyfills":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Polyfills.js","./Queue":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Queue.js","./SimpleSection":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\SimpleSection.js"}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\AJAX.js":[function(require,module,exports){
function AJAX(params) {
    this.async = params.async || true;
    this.error = params.error;
    this.method = params.method || 'GET';
    this.success = params.success;
    this.form = params.form;
    this.url = params.url;

    this.request = new XMLHttpRequest();
    this.request.open(this.method, this.url, this.async);

    if (this.success) {
        this.request.onload = this.success;
    }

    if (this.error) {
        this.request.onerror = this.error;
    }

    if (this.form) {
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Chartbeat.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Countdown.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\DetectFeatures.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\GoogleAnalytics.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\ImagePreloader.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\LoadingIcon.js":[function(require,module,exports){
var html = '<div class="timer-spinner"> <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> </div>';

function LoadingIcon(params) {
    var target = document.querySelector(params.target);
    target.innerHTML = html;
    target.className += ' fadeIn';
}

module.exports = LoadingIcon;

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\MobileMenu.js":[function(require,module,exports){
function MobileMenu() {
    this.root = document.getElementById('mobile-navigation');
    this.list = this.root.querySelector('ul');
    this.hamburger = this.root.querySelector('.hamburger');
    this.height = (this.list.children.length * 44);

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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\OrganizationRotation.js":[function(require,module,exports){
function OrganizationRotation() {
    this.addEventListeners();
}

OrganizationRotation.prototype.addEventListeners = function() {
    var loc = window.location.href;
    random_org = null;
    if (loc.indexOf('org=') == -1) {
        var coin_toss = Math.random();
        if (coin_toss < .20) {
            random_org = 'fp';
        } else if (coin_toss < .60) {
            random_org = 'dp';
        } else {
            random_org = 'fftf';
        }
    }

    if (loc.indexOf('org=fp') != -1 || random_org == 'fp') {
        document.getElementById('org').value = 'fp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fp_disclosure').style.display = 'block';
    } else if (loc.indexOf('org=dp') != -1 || random_org == 'dp') {
        document.getElementById('org').value = 'dp';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('dp_disclosure').style.display = 'block';
    } else if (loc.indexOf('org=fftf') != -1 || random_org == 'fftf') {
        document.getElementById('org').value = 'fftf';
        document.getElementById('randomize_disclosure').style.display = 'none';
        document.getElementById('fftf_disclosure').style.display = 'block';
    }
};

module.exports = OrganizationRotation;

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\PetitionForm.js":[function(require,module,exports){
var AJAX = require('./AJAX');
var Template = require('./Template');


function PetitionForm(params) {
    // Params
    this.formTemplate = params.formTemplate
    this.target = params.target;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

PetitionForm.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.formTemplate, {});
    this.DOMNode.className = this.DOMNode.className.replace(/loading/, ' ');
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
    var thanksNode = this.DOMNode.querySelector('.thanks');
    var phoneFormWasSkipped = false;

    petitionFormNode.style.display = 'none';
    phoneCallFormNode.querySelector('header').textContent = 'Call Congress and the FCC!';
    var alternativeCTA = phoneCallFormNode.querySelector('.alternative-cta');
    alternativeCTA.style.display = 'block';
    phoneCallFormNode.style.display = 'block';

    alternativeCTA.addEventListener('click', function(e) {
        e.preventDefault();

        petitionFormNode.style.display = 'block';
        phoneCallFormNode.style.display = 'none';
        phoneFormWasSkipped = true;
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

        if (!phoneFormWasSkipped) {
            petitionFormNode.style.display = 'none';
            phoneCallFormNode.style.display = 'block';
        } else {
            petitionFormNode.style.display = 'none';
            thanksNode.style.display = 'block';
        }

    }, false);

    phoneCallFormNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var campaignId = 'title-x-committees';

        var phoneNumber = phoneCallFormNode.elements.phone.value;
        var postalCode = petitionFormNode.elements.zip.value || '95051';

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

        var overlayNode = document.querySelector('.overlay');
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        thanksNode.style.display = 'block';
    }.bind(this), false);
};

module.exports = PetitionForm;

},{"./AJAX":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\AJAX.js","./Template":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Template.js"}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Polyfills.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Queue.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\SimpleSection.js":[function(require,module,exports){
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

},{"./Template":"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Template.js"}],"c:\\Users\\Chris\\projects\\battleforthenet\\_src\\js\\Template.js":[function(require,module,exports){
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

},{}]},{},["./js/index.js"]);
