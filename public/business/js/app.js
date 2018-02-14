document.addEventListener("DOMContentLoaded", function() {
  var PRIORITY_STATES = [ 'LA' ];

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

  var formatNumber = function(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
  };

  var pluralize = function(number, singular, plural=null){
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

  Vue.filter('formatNumber', formatNumber);
  Vue.filter('pluralize', pluralize);

  var app = new Vue({
    el: '#app',

    data: function() {
      return {
        states: STATES,
        selectedState: null,
        isLoaded: false,
        businesses: [],
        tweetCount: 0,
        name: null,
        email: null,
        zipCode: null,
        phone: null,
        hasLargeAudience: false,
        actionComment: null,
        isLoading: false,
        formMessage: null,
        modalVisible: false
      }
    },

    // watch: {
    //   tweetCount: function(val) {
    //     if (val === 4) {
    //       this.showModal()
    //     }
    //   }
    // },

    computed: {
      localBusinesses: function() {
        var self = this;
        return this.uniqueishBusinesses.filter(function(b){
          return b.state === self.selectedState;
        }).slice(0, 20);
      },

      priorityBusinesses: function() {
        var self = this;
        return this.uniqueishBusinesses.filter(function(b){
          return PRIORITY_STATES.indexOf(b.state) !== -1;
        }).slice(0, 20);
      },

      uniqueishBusinesses: function() {
        var uids = [];
        var businesses = [];
        
        for (var i = 0; i < this.businesses.length; i++) {
          var biz = this.businesses[i];
          var uid = biz.twitter + biz.state;

          if (uids.indexOf(uid) === -1) {
            uids.push(uid);
            businesses.push(biz);
          }
        }

        return businesses;
      }
    },

    created: function() {
      this.geocodeSelectedState();
      this.fetchBusinesses();
    },

    methods: {
      geocodeSelectedState: function() {
        var self = this;
        this.$http.get('https://fftf-geocoder.herokuapp.com').then(function(response){
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

      fetchBusinesses: function() {
        var self = this;
        this.$http.get('https://data.battleforthenet.com/businesses.json').then(function(response){
          if (response.ok) {
            self.businesses = response.body;
            shuffle(self.businesses);
            self.isLoaded = true;
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

      getMetaContent: function(name) {
        var el = document.querySelector('meta[name="' + name + '"]') || document.querySelector('meta[property="' + name + '"]');
        
        if (el) {
          return el.getAttribute('content');
        }

        return null;
      },

      openPopup: function(url, title='popup', w=600, h=500) {
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
      },

      shareOnFacebook: function() {
        var url = this.getMetaContent('og:url');
        this.openPopup('https://www.facebook.com/sharer.php?u=' + encodeURIComponent(url), 'facebook');
      },

      shareOnTwitter: function() {
        var tweetText = this.getMetaContent('twitter:description') + ' ' + this.getMetaContent('twitter:url');
        this.openPopup('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText), 'twitter');
      },

      submitForm: function() {
        var self = this;
        self.isLoading = true;
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
          self.isLoading = false;

          if (response.ok) {
            self.resetForm();
            self.showModal();
          }
          else {
            self.formMessage = "That didn't work for some reason :(";
          }
        })
        .catch(function(error){
          self.isLoading = false;
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
      }
    }
  });

  Vue.component('business-card', {
    template: '#business-card-template',
    props: [ 'business' ],
    
    computed: {
      tweetURL: function() {
        var tweetText = "@" + this.business.twitter + " Without net neutrality, Internet service providers will add a new tax onto businesses across the country. Please sign this open letter to stop this now:"
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
      }
    },

    methods: {
      openTweetURL: function(business) {
        this.$parent.tweetCount += 1;
        window.open(this.tweetURL, '_blank');
      }
    }
  });
});