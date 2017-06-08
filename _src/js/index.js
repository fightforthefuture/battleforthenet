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
    document.querySelector('.battle > main > p').innerHTML = intro.innerHTML;

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
    var callTemplate = '/templates/CallForm.html';
    if (params.get('call').toLowerCase() === 'daily') {
      callTemplate = '/templates/CallFormDaily.html';
    }
    new AJAX({
      url: callTemplate + buster,
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
