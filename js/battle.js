(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

(function() {
  var Polyfills = require('./Polyfills');
  var AJAX = require('./AJAX');
  var Chartbeat = require('./Chartbeat');
  var Countdown = require('./Countdown');
  var GoogleAnalytics = require('./GoogleAnalytics');
  var ImagePreloader = require('./ImagePreloader');
  var LoadingIcon = require('./LoadingIcon');
  var MobileMenu = require('./MobileMenu');
  var Modals = require('./Modals');
  var MotherShip = require('./MotherShip');
  var UTM = require('./UTM');
  var PetitionForm = require('./PetitionForm');
  var CallForm = require('./CallForm');
  var SimpleSection = require('./SimpleSection');
  var TeamInternetSection = require('./TeamInternetSection');
  var TownHallSection = require('./TownHallSection');

  // Let's selectively bust browser caches
  var buster = '?buster=' + Date.now();

  // Analytics
  setTimeout(function() {
    new Chartbeat();
    new GoogleAnalytics();
    new MotherShip();
  }, 1200);

  var utmParams = new UTM();
  if (utmParams.getSource() === 'etsy') {
    var intro = document.createElement('p');
    intro.textContent = "FCC Chairman Pai wants to repeal existing net neutrality rules that allow Etsy sellers to turn their creative passion into a business. Without these protections, Etsy sellers will be forced to choose between paying for priority access or losing sales in the internet slow lane. ";

    var strong = document.createElement('strong');
    strong.textContent = "Send a message to the FCC and Congress urging them to protect net neutrality and microbusinesses.";
    intro.appendChild(strong);

    // Update intro paragraph copy
    document.querySelector('#battle > p').innerHTML = intro.innerHTML;

    var link = 'https://www.battleforthenet.com/?utm_source=etsy';

    // Update Facebook og:url tag
    document.querySelector('meta[property="og:url"]').setAttribute('content', link);

    // Override Free Progress with useCapture and stopPropagation
	document.addEventListener('click', function(e) {
	  var el = e.target;
      var properties = 'width=500, height=300, toolbar=no, status=no, menubar=no';

	  while (el && el !== document) {
		if (el.matches('a.facebook, button.facebook')) {
		  e.preventDefault();
		  e.stopPropagation();

          var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link);

          window.open(url, 'share_fb', properties);
        } else if (el.matches('a.twitter, button.twitter')) {
		  e.preventDefault();
		  e.stopPropagation();

          var tweet = 'Without #NetNeutrality, my @Etsy shop would lose out on economic opportunities. Tell @FCC to protect microbusinesses';
          var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet) + '&url=' + encodeURIComponent(link);

          window.open(url, 'share_tw', properties);
		}

		el = el.parentNode;
	  }
	}, true);
  }

  var params = new URLSearchParams(window.location.search.substring(1));
  if (params.get('call') || document.querySelector('.form-wrapper').classList.contains('call')) {
    new AJAX({
      url: '/templates/CallForm.html' + buster,
      success: function(e) {
        new CallForm({
          target: '.form-wrapper',
          template: e.target.responseText
        });
      }
    });
  } else if (document.body.classList.contains('day-of-action')) {
    new AJAX({
      url: '/templates/SignupForm.html' + buster,
      success: function(e) {
        new PetitionForm({
          target: '.form-wrapper',
          template: e.target.responseText
        });
      }
    });
  } else {
    new AJAX({
      url: '/templates/PetitionForm.html' + buster,
      success: function(e) {
        new PetitionForm({
          target: '.form-wrapper',
          template: e.target.responseText
        });
      }
    });
  }

  new AJAX({
    url: '/templates/VideoEmbed.html' + buster,
    success: function(e) {
      new SimpleSection({
        target: '.video-embed-target',
        template: e.target.responseText
      });
    }
  });

  new AJAX({
    url: '/templates/TeamCableSection.html' + buster,
    success: function(e) {
      new SimpleSection({
        target: '.team-cable-target',
        template: e.target.responseText
      });
    }
  });

  new AJAX({
    url: '/templates/TeamInternetSection.html' + buster,
    success: function(e) {
      new TeamInternetSection({
        target: '.team-internet-target',
        template: e.target.responseText
      });
    }
  });

  new AJAX({
    url: '/templates/Modals.html' + buster,
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

  new AJAX({
    url: '/templates/HowWeWonSection.html' + buster,
    success: function(e) {
      new SimpleSection({
        target: '.how-we-won-target',
        template: e.target.responseText
      });
    }
  });

  new AJAX({
    url: '/templates/TownHallSection.html' + buster,
    success: function(e) {
      new TownHallSection({
        target: '.town-hall-target',
        template: e.target.responseText
      });
    }
  });

  new AJAX({
    url: '/templates/LearnMoreSection.html' + buster,
    success: function(e) {
      new SimpleSection({
        target: '.learn-more-target',
        template: e.target.responseText
      });
    }
  });

  new AJAX({
    url: '/templates/ExtraReading.html' + buster,
    success: function(e) {
      new SimpleSection({
        target: '.extra-reading-target',
        template: e.target.responseText
      });
    }
  });

  new AJAX({
    url: '/templates/Countdown.html' + buster,
    success: function(e) {
      new Countdown({
        target: '.countdown-target',
        template: e.target.responseText,
        date: new Date('July 17, 2017')
      });
    }
  });
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":2,"./CallForm":3,"./Chartbeat":4,"./Countdown":5,"./GoogleAnalytics":7,"./ImagePreloader":8,"./LoadingIcon":9,"./MobileMenu":10,"./Modals":11,"./MotherShip":12,"./PetitionForm":14,"./Polyfills":15,"./SimpleSection":16,"./TeamInternetSection":17,"./TownHallSection":19,"./UTM":20}],2:[function(require,module,exports){
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
(function (global){
var Template = require('./Template');

function CallForm(params) {
  this.target = params.target;
  this.template = params.template;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.render();
    this.addEventListeners();
  }
}

CallForm.prototype.render = function() {
  this.DOMNode.innerHTML = Template(this.template, {});
};

CallForm.prototype.validatePhoneNumber = function(phone) {
  // Remove spaces, parentheses, dashes
  phone = phone.replace(/\s/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\-/g, '');

  // Remove country code
  // TODO: Add support for non-US country codes on backend?
  phone = phone.replace('+', '')
  if (phone.charAt(0) == '1') phone = phone.substr(1);

  // Return formatted phone number if valid
  return phone.length == 10 ? phone : false;
};

CallForm.prototype.logStatus = function(e) {
  var xhr = e.currentTarget;

  switch (xhr.status) {
    case 0:
      // TODO: display error modal here instead
      alert('If you are using Privacy Badger or another ad blocker, please allow requests to https://call-congress.fightforthefuture.org and try again.')
    default:
      console.log(xhr.status, xhr.statusText);
  }
};

CallForm.prototype.addEventListeners = function() {
  var form = this.DOMNode.querySelector('form');
  var campaignId = form.querySelector('input[name=campaignId]').value;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var phone = this.validatePhoneNumber(this.DOMNode.querySelector('input[type=tel]').value);

    if (!phone) return alert('Please enter a valid US phone number!');

    var data = new FormData();
    data.append('campaignId', campaignId);
    data.append('userPhone', phone);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', this.logStatus);
    xhr.addEventListener('error', this.logStatus);

    xhr.open('post', form.action, true);
    xhr.send(data);

    global.modals.hide('thanks_modal');
    global.modals.display('call_modal');
  }.bind(this));
};

module.exports = CallForm;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Template":18}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var Template = require('./Template');

// Constants
var DAY = (1000 * 60 * 60 * 24);
var HOUR = (1000 * 60 * 60);
var MINUTE = (1000 * 60);
var SECOND = (1000);

function Countdown(params) {
  this.target = params.target;
  this.template = params.template;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.date = params.date;
    this.interval = null;
    this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    this.tick = this.tick.bind(this);

    this.render();
    this.start();
  }
}

Countdown.prototype.render = function() {
  this.DOMNode.innerHTML = Template(this.template, {});
};

Countdown.prototype.destroy = function() {
  this.stop();

  delete this.date;
  delete this.tick;
};

Countdown.prototype.pad = function(num) {
  return num > 9 ? num : '0' + num;
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

Countdown.prototype.tick = function() {
  var now = Date.now();
  var diff = Math.max(0, this.date - now);

  this.updateDates(diff);

  if (diff === 0) {
    this.destroy();
    return;
  }
};

Countdown.prototype.updateDates = function(diff) {
  var days = Math.floor(diff / DAY);
  diff -= days * DAY;

  var hours = Math.floor(diff / HOUR);
  diff -= hours * HOUR;

  var minutes = Math.floor(diff / MINUTE);
  diff -= minutes * MINUTE;

  var seconds = Math.floor(diff / SECOND);
  diff -= seconds * SECOND;

  this.DOMNode.querySelector('.days').textContent = this.pad(days);
  this.DOMNode.querySelector('.hours').textContent = this.pad(hours);
  this.DOMNode.querySelector('.minutes').textContent = this.pad(minutes);
  this.DOMNode.querySelector('.seconds').textContent = this.pad(seconds);
};

module.exports = Countdown;

},{"./Template":18}],6:[function(require,module,exports){
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

  if (ga) {
    ga('create', 'UA-26576645-20', 'auto');
    ga('send', 'pageview');
  }
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
'use strict';

var AJAX = require('./AJAX');
var Template = require('./Template');
var CallForm = require('./CallForm');
var UTM = require('./UTM');

function Modals(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

Modals.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});

    var buster = '?buster=' + Date.now();

    if (document.body.classList.contains('battle')) {
      new AJAX({
        url: '/templates/CallForm.html' + buster,
        success: function(e) {
          new CallForm({
            target: '#thanks_modal main',
            template: e.target.responseText
          });
        }
      });
    }

    if (document.body.classList.contains('day-of-action')) {
      this.DOMNode.querySelector('#thanks_modal header > h3').textContent = "Thanks! We'll be in touch. For now, can you help spread the word?";
    }

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
};

Modals.prototype.addEventListeners = function() {
  // Hack to remove twitter-brigade modal from after-action flow
  if ((new UTM()).getSource() === 'etsy') {
    var twitterBrigadeEls = document.querySelectorAll('.twitter-brigade');

    for (var i = 0; i < twitterBrigadeEls.length; i++) {
      twitterBrigadeEls[i].classList.remove('twitter-brigade');
      twitterBrigadeEls[i].classList.add('twitter');
    }
  }

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
};

module.exports = Modals;

},{"./AJAX":2,"./CallForm":3,"./Template":18,"./UTM":20}],12:[function(require,module,exports){
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
    var re = new RegExp('^.*?\://([^/]+)', 'im');
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
'use strict';

function OrganizationRotation(params) {
  this.target = params.target;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.addEventListeners();
  }
}

OrganizationRotation.prototype.addEventListeners = function() {
  var params = new URLSearchParams(window.location.search.substring(1));
  var org;

  if (params.get('org')) {
    org = params.get('org') || 'fftf';

    // Don't show donate links for non-referral visits
    var donationLinks = document.querySelectorAll('header a.donate');
    for (var i = 0; i < donationLinks.length; i++) {
      donationLinks[i].href = donationLinks[i].getAttribute('href-' + org);
    }
  } else {
    var coinToss = Math.random();

    if (coinToss < .20) {
      org = 'fp';
    } else if (coinToss < .60) {
      org = 'dp';
    } else {
      org = 'fftf';
    }
  }

  var orgInputEl = this.DOMNode.querySelector('[name="org"]');

  if (orgInputEl) {
    orgInputEl.value = org;
  }

  // Show org disclaimer
  var disclaimers = this.DOMNode.querySelector('.disclaimer')
    .querySelectorAll('.org')

  for (var i = 0; i < disclaimers.length; i++) {
    var classList = disclaimers[i].classList;
    classList.contains(org) ? classList.remove('hidden') : classList.add('hidden');
  }
};

module.exports = OrganizationRotation;

},{}],14:[function(require,module,exports){
(function (global){
'use strict';

var AJAX = require('./AJAX');
var Template = require('./Template');
var OrganizationRotation = require('./OrganizationRotation');
var UTM = require('./UTM');
var YourSenators = require('./YourSenators');

function PetitionForm(params) {
  this.target = params.target;
  this.template = params.template;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.render();

    if (!document.body.classList.contains('day-of-action')) {
      this.setOrganization();
    }

    this.setUTMContent();
    this.addEventListeners();
  }
}

PetitionForm.prototype.render = function() {
  this.DOMNode.innerHTML = Template(this.template, {});
  this.DOMNode.className = this.DOMNode.className.replace(/loading/, ' ');
};

PetitionForm.prototype.setOrganization = function() {
  new OrganizationRotation({
    target: this.target
  });
};

// Adapt petition form for different sources or campaigns depending on UTM params
PetitionForm.prototype.setUTMContent = function() {
  var utmParams = new UTM();

  if (utmParams.getSource() === 'etsy') {
    var shopInput = document.createElement('input');
    shopInput.setAttribute('name', 'etsy_shop');
    shopInput.setAttribute('placeholder', 'Etsy Shop Link');

    this.DOMNode.querySelector('form .left').appendChild(shopInput);

    this.DOMNode.querySelector('form textarea').value = "Chairman Pai's proposed plan to repeal net neutrality protections would put a huge burden on microbusinesses like mine.\n\nAs an Etsy seller, net neutrality is essential to the success of my business and my ability to care for myself and my family. The FCC needs to ensure equal opportunities for microbusinesses to compete with larger and more established brands by upholding net neutrality protections.\n\nEtsy has opened the door for me and 1.8 million other sellers to turn our passion into a business by connecting us to a global market of buyers. For 32% of creative entrepreneurs on the platform, our creative business is our sole occupation. A decrease in sales in the internet slow lane or higher cost to participate in Chairman Pai's pay-to-play environment would create significant obstacles for me and other Etsy sellers to care for ourselves and our families.\n\nMoreover, 87% of Etsy sellers in the U.S. are women, and most run their microbusinesses out of their homes. By rolling back the bright line rules that ensure net neutrality, Chairman Pai is not only taking away our livelihood, he is also putting up barriers to entrepreneurship for a whole cohort of Americans.\n\nMy business growth depends on equal access to consumers. Any rule that allows broadband providers to negotiate special deals with some companies would undermine my ability to compete online.\n\nWe need a free and open internet that works for everyone, not just telecom companies that stand to benefit from the FCC's proposed rules.\n\nI'm sending this to the FCC's open proceeding and to my members of Congress. Please publicly support the FCC's existing net neutrality rules based on Title II and microbusinesses like mine.\n\nThank you!";

    // Show opt-out checkbox
    var disclaimer = document.querySelector('.disclaimer');

    var optInEls = disclaimer.querySelectorAll('.opt-in');
    for (var i = 0; i < optInEls.length; i++) {
      optInEls[i].classList.remove('hidden');
    }

    disclaimer.querySelector('.no-opt-in').classList.add('hidden');
  }
};

// Load geography & politicians JSON
PetitionForm.prototype.geocode = function() {
  var URLs = {
      geography: 'https://fftf-geocoder.herokuapp.com',
      politicians: 'https://cache.battleforthenet.com/politicians.json',
      politiciansOnGoogle: 'https://spreadsheets.google.com/feeds/list/12g70eNkGA2hhRYKSENaeGxsgGyFukLRMHCqrLizdhlw/default/public/values?alt=json'
  };

  new AJAX({
    url: URLs.geography,
    success: function(e) {
      var response = JSON.parse(e.target.responseText);

      // Update country field
      if (response &&
          response.hasOwnProperty('country') &&
          response.country.hasOwnProperty('iso_code')) {
        this.setCountryCode(response.country.iso_code);
      }

      new YourSenators({
        callback: loadMoreSections,
        geography: response,
        target: '.your-senators-target',
        URLs: URLs
      });
    }
  });
};

PetitionForm.prototype.setCountryCode = function(countryCode) {
  this.DOMNode.querySelector('[name="member[country]"]').value = countryCode;
};

PetitionForm.prototype.addEventListeners = function() {
  var form = this.DOMNode.querySelector('form');
  var submitted = false;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (submitted) return;

    submitted = true;

    var xhr = new XMLHttpRequest();
    var formData;

	var utmParams = new UTM();
	if (utmParams.getSource() === 'etsy') {
      var etsyLink = form.querySelector('input[name="etsy_shop"]').value;

      formData = new FormData();

      // Manually build the FormData object because Safari doesn't support 
      // FormData.set for updating action_comment
      var inputs = form.querySelectorAll('input');
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type !== 'checkbox') {
          formData.append(inputs[i].name, form.querySelector('input[name="' + inputs[i].name + '"]').value);
        }
      }

      // Append honeypot checkbox values
      formData.append('hp_enabled', 'on');

      // Prepend Etsy Shop link if field is not blank
      formData.append('action_comment', (etsyLink ? ('Etsy Shop ' + etsyLink + '\n\n') : '') + form.querySelector('textarea[name="action_comment"]').value);

      if (!form.querySelector('input[name="opt_in"]').checked) {
        formData.append('opt_out', 1);
      }
	} else {
      formData = new FormData(form);
    }

    function handleHelperError(e) {
      /**
       * @param {event|XMLHttpRequest} e - Might be an event, might be a 
       * failed XMLHttpRequest
       * */

      // global.modals.display('error_modal');
    }

    function loadHelperResponse() {
      // Submission complete, allow retry
      submitted = false;

      if (200 <= xhr.status < 400) {
        global.modals.display('thanks_modal');
      } else {
        handleHelperError(xhr);
      }
    }

    xhr.open(form.getAttribute('method'), form.getAttribute('action'), true);
    xhr.addEventListener('error', handleHelperError);
    xhr.addEventListener('load', loadHelperResponse);
    xhr.send(formData);
  });

  var textarea;

  if (document.body.classList.contains('battle')) {
    textarea = form.querySelector('textarea[name="action_comment"]');
    var placeholder = 'Dear FCC,\n\n';
    textarea.placeholder = textarea.value;

    form.querySelector('.edit').addEventListener('click', function(e) {
      e.preventDefault();

      textarea.value = placeholder;
      textarea.focus();
    });

    textarea.addEventListener('blur', function(e) {
      var val = textarea.value.trim();
      if (val == placeholder.trim() || val == '') {
        textarea.value = textarea.placeholder;
      }
    });
  } else if (document.body.classList.contains('day-of-action')) {
    form.querySelector('input[name="volunteer"]').addEventListener('click', function(e) {
      if (e.currentTarget.checked) {
        form.querySelector('.comment').classList.remove('hidden');
      } else {
        form.querySelector('.comment').classList.add('hidden');
      }
    });
  }

  /*
    var petitionFormNode = this.DOMNode.querySelector('#petition');
    var senatorsNode = this.DOMNode.querySelector('.your-senators-target');
    var thanksNode = this.DOMNode.querySelector('.thanks');
    var disclaimerNode = this.DOMNode.querySelector('.disclaimer_container');
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
    */
};

module.exports = PetitionForm;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":2,"./OrganizationRotation":13,"./Template":18,"./UTM":20,"./YourSenators":21}],15:[function(require,module,exports){
// Polyfill URLSearchParams
function URLSearchParams(queryString) {
  this.queryObj = queryString.split('&').reduce(function(obj, val) {
    var parts = val.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    return obj;
  }, {});
}

URLSearchParams.prototype.has = function has(key) {
  return this.queryObj.hasOwnProperty(key);
}

URLSearchParams.prototype.get = function get(key) {
  return this.queryObj[key];
}

window.URLSearchParams = window.URLSearchParams || URLSearchParams;

// Polyfill matches selector
Element.prototype.matches = Element.prototype.matches ||
  Element.prototype.matchesSelector || 
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector || 
  Element.prototype.oMatchesSelector || 
  Element.prototype.webkitMatchesSelector ||
  function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
      i = matches.length;
    while (--i >= 0 && matches.item(i) !== this) {}
    return i > -1;            
  };

},{}],16:[function(require,module,exports){
var Template = require('./Template');

function SimpleSection(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    if (this.DOMNode) this.render();
}

SimpleSection.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});
};

module.exports = SimpleSection;

},{"./Template":18}],17:[function(require,module,exports){
(function (global){
var SimpleSection = require('./SimpleSection');

function TeamInternetSection(params) {
    this.target = params.target;
    this.template = params.template;
    this.timeout = null;
    this.timeoutDuration = 32;

    this.render();
    this.wrapper = document.querySelector(this.target + ' .supporters');

    if (this.wrapper) {
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
},{"./SimpleSection":16}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
var SimpleSection = require('./SimpleSection');

function TownHallSection(params) {
  this.target = params.target;
  this.template = params.template;

  this.DOMNode = document.querySelector(this.target);

  if (this.DOMNode) {
    this.render();
    this.addListeners();
  }
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

},{"./SimpleSection":16}],20:[function(require,module,exports){
'use strict';

function UTM() {
  this.params = new URLSearchParams(window.location.search.substring(1));
}

UTM.prototype.getSource = function() {
  return this.params.has('utm_source') ? this.params.get('utm_source') : '';
};

UTM.prototype.getCampaign = function() {
  return this.params.has('utm_campaign') ? this.params.get('utm_campaign') : '';
};

module.exports = UTM;

},{}],21:[function(require,module,exports){
function YourSenators(params) {
    params.callback();
}

module.exports = YourSenators;

},{}]},{},[1]);
