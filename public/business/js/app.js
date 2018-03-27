document.addEventListener("DOMContentLoaded", function() {
  var STATES = {
    "Alabama": "AL",
    "Alaska": "AK",
    "American Samoa": "AS",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District Of Columbia": "DC",
    "Federated States Of Micronesia": "FM",
    "Florida": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Marshall Islands": "MH",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Mariana Islands": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Palau": "PW",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virgin Islands": "VI",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
  };

  var TWEETS = [
    "Hi @[NAME], I’m working to save #NetNeutrality, especially because losing it will hurt businesses like you. Will you join other businesses in your area by signing this letter?",
    "Hey @[NAME], We're reaching out to businesses across the country to sign on to our letter to congress. Can you join other businesses and help save #NetNeutrality by signing this letter?",
    "Hi @[NAME], Would you like to help save #NetNeutrality? Join other businesses in your area by signing this letter!",
    "Hello @[NAME], We need businesses like yours to reach out to congress and stick up for #NetNeutrality. Could you please sign this letter and show your support?",
    "Hey @[NAME], We're calling on all businesses big and small to sign onto our letter urging congress to save #NetNeutrality. Want to join?",
    "Hi @[NAME], Can you join other businesses in your area by signing on to a letter to congress urging support for #NetNeutrality?",
    "Hi @[NAME], Members of Congress can save #NetNeutrality, but they need to hear from businesses like you.  Will you let them know where you stand?",
    "Hi @[NAME], Without #NetNeutrality, local businesses will suffer.  Will you sign this letter to Congress to remind them how important you are to the economy?",
    "Hi @[NAME], #NetNeutrality helps small businesses find customers and compete in the marketplace.  Will you tell Congress to support Net Neutrality and businesses like you?",
    "Hi @[NAME], Over a thousand small businesses have signed a letter to Congress in support of #NetNeutrality.  Will you join and let Congress know that the internet is important to your business?"
  ];

  var formatNumber = function(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
  };

  var pluralize = function(number, singular, plural){
    if (parseFloat(number) === 1.0) {
      return number + ' ' + singular;
    }
    else {
      if (!plural) {
        plural = singular + 's';
      }

      return formatNumber(number) + ' ' + plural;
    }
  };

  var shuffle = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  var getMetaContent = function(name) {
    var el = document.querySelector('meta[name="' + name + '"]') || document.querySelector('meta[property="' + name + '"]');
    
    if (el) {
      return el.getAttribute('content');
    }

    return null;
  };

  var openPopup = function(url, title, w, h) {
    if (!title) {
      title = 'popup';
    }

    if (!w) {
      w = 600;
    }

    if (!h) {
      h = 500;
    }

    // Fixes dual-screen position
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  };

  // send event to Google Analytics
  function trackEvent(category, action, label, value) {
    if (window.ga) {
      var params = {
        hitType: 'event',
        eventCategory: category,
        eventAction: action
      };

      if (label) {
        params.eventLabel = label;
      }

      if (value) {
        params.eventValue = value;
      }

      window.ga('send', params);
    }
  }

  Vue.filter('formatNumber', formatNumber);
  Vue.filter('pluralize', pluralize);

  var app = new Vue({
    el: '#app',

    data: function() {
      return {
        states: STATES,
        selectedState: null,
        isLoading: false,
        localBusinesses: [],
        priorityBusinesses: [],
        tweetCount: 0,
        name: null,
        email: null,
        zipCode: null,
        phone: null,
        hasLargeAudience: false,
        actionComment: null,
        isSubmittingForm: false,
        formMessage: null,
        modalVisible: false
      }
    },

    watch: {
      selectedState: function(newValue) {
        if (newValue) {
          this.fetchLocalBusinesses();
          localStorage.setItem('selectedState', newValue);
        }
        else {
          this.localBusinesses = [];
          localStorage.removeItem('selectedState');
        }
      }
    },

    created: function() {
      this.fetchPriorityBusinesses();

      var savedState = localStorage.getItem('selectedState');

      if (savedState) {
        this.selectedState = savedState;
      }
      else {
        this.geocodeSelectedState();
      }
    },

    methods: {
      geocodeSelectedState: function() {
        var self = this;
        self.$http.get('https://fftf-geocoder.herokuapp.com').then(function(response){
          if (response.ok) {
            var geo = response.body;

            if (
              geo.country.iso_code === 'US' &&
              geo.subdivisions &&
              geo.subdivisions[0] &&
              geo.subdivisions[0].names &&
              geo.subdivisions[0].names.en
            ) {
              self.selectedState = geo.subdivisions[0].iso_code;
            }
          }
        });
      },

      uniqueifyBusinesses: function(businesses) {
        var uids = [];
        var uniqueishBusinesses = [];
        
        for (var i = 0; i < businesses.length; i++) {
          var biz = businesses[i];
          var uid = biz.twitter + biz.state;

          if (uids.indexOf(uid) === -1) {
            uids.push(uid);
            uniqueishBusinesses.push(biz);
          }
        }

        return uniqueishBusinesses;
      },

      fetchLocalBusinesses: function() {
        var self = this;
        self.isLoading = true;
        self.$http.get('https://data.battleforthenet.com/businesses/' + self.selectedState.toLowerCase() + '.json').then(function(response){
          if (response.ok) {
            var businesses = self.uniqueifyBusinesses(response.body);
            shuffle(businesses);
            self.localBusinesses = businesses.slice(0, 20);
            self.isLoading = false;
          }
        });
      },

      fetchPriorityBusinesses: function() {
        var self = this;
        self.$http.get('https://data.battleforthenet.com/businesses/priority.json').then(function(response){
          if (response.ok) {
            var businesses = response.body;
            shuffle(businesses);
            self.priorityBusinesses = businesses.slice(0, 12);
          }
        });
      },

      showModal: function() {
        this.modalVisible = true;
        document.querySelector('body').classList.add('modal-open');
      },

      hideModal: function() {
        this.modalVisible = false;
        document.querySelector('body').classList.remove('modal-open');
      },

      shareOnFacebook: function() {
        var url = getMetaContent('og:url');
        openPopup('https://www.facebook.com/sharer.php?u=' + encodeURIComponent(url), 'facebook');
      },

      shareOnTwitter: function() {
        var tweetText = getMetaContent('twitter:description') + ' ' + getMetaContent('twitter:url');
        openPopup('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText), 'twitter');
      },

      submitForm: function() {
        var self = this;
        self.isSubmittingForm = true;
        self.$http.post('https://queue.fightforthefuture.org/action', {
          member: {
            first_name: self.name,
            email: self.email,
            postcode: self.zipCode,
            phone_number: self.phone,
            country: 'US'
          },
          hp_enabled: 'true',
          guard: '',
          contact_congress: 0,
          org: 'fftf',
          an_tags: "[\"net-neutrality\"]",
          an_petition_id: '11f84b38-e65b-4259-b0ae-e879a4044ca9',
          volunteer: self.hasLargeAudience,
          action_comment: self.actionComment
        }, { emulateJSON: true })
        .then(function(response){
          self.isSubmittingForm = false;

          if (response.ok) {
            self.resetForm();
            self.showModal();
            trackEvent('signup', 'success', 'Step 4 - Sign Up');
          }
          else {
            self.formMessage = "That didn't work for some reason :(";
          }
        })
        .catch(function(error){
          self.isSubmittingForm = false;
          self.formMessage = "That didn't work for some reason :(";
        })
      },

      resetForm() {
        this.phone = null;
        this.name = null;
        this.email = null;
        this.zipCode = null;
        this.hasLargeAudience = false;
        this.actionComment = null;
        this.formMessage = null;
      },

      openSpreadsheet() {
        window.open('https://docs.google.com/spreadsheets/d/12MkAWz8VGyIIiCgVdGXWfLKROBegZNew8-xKyPVv6vU/edit#gid=0', '_blank');
        trackEvent('button', 'click', 'Step 5 - Get Started');
      }
    }
  });

  Vue.component('business-card', {
    template: '#business-card-template',
    
    props: {
      business: {
        type: Object
      },
      national: {
        type: Boolean,
        default: false
      }
    },
    
    computed: {
      tweetURL: function() {
        var randomIndex = Math.floor(Math.random() * Math.floor(TWEETS.length-1));
        var template = TWEETS[randomIndex];
        var tweetText = template.replace('@[NAME]', '@' + this.business.twitter);
        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText) + '&url=' + encodeURIComponent('https://www.businessesfornetneutrality.com');
      },

      locationString: function() {
        if (this.business.city && this.business.state) {
          return [this.business.city, this.business.state].join(', ');
        }
        else if (this.business.city) {
          return this.business.city;
        }
        else if (this.business.state) {
          return this.business.state;
        }
      },

      logo: function() {
        if (this.business.twitter) {
          return 'https://data.battleforthenet.com/images/twitter/' + this.business.twitter.toLowerCase() + '.jpg';
        }
      },

      domain: function() {
        if (this.business.website) {
          var a = document.createElement('a');
          a.href = this.business.website;
          return a.hostname.replace(/^www\./i, '');
        }
      }
    },

    methods: {
      openTweetURL: function(event) {
        this.$parent.tweetCount += 1;
        
        if (event && event.metaKey) {
          window.open(this.tweetURL, '_blank');
        }
        else {
          openPopup(this.tweetURL, 'tweet');
        }

        var stepNumber = this.national ? 3 : 1;
        trackEvent('business', 'tweet', 'Step ' + stepNumber + ' - ' + this.business.twitter);
      }
    }
  });
});