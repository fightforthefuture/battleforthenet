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
  var PetitionForm = require('./PetitionForm');
  var CallForm = require('./CallForm');
  var SimpleSection = require('./SimpleSection');
  var TeamInternetSection = require('./TeamInternetSection');
  var TownHallSection = require('./TownHallSection');

  // Let's selectively bust browser caches
  var buster = '?buster=' + Date.now();

  // Preload the background
  setTimeout(function() {
    new ImagePreloader('/images/Imagesmall.jpg', function() {
      var background = document.getElementById('background');
      background.classList.add('fadeIn');
      background.style.backgroundImage = 'url(' + this.src + ')';
    });
  }, 128);

  // Prevent Typekit flash of unstyled content?
  setTimeout(function() {
    if (!global.fontsAreReady) {
      global.fontsAreReady = true;
      document.body.classList.add('loaded', 'slow');
    }
  }, 256);

  // Analytics
  setTimeout(function() {
    new Chartbeat();
    new GoogleAnalytics();
    new MotherShip();
  }, 1200);

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
})();
