document.addEventListener("DOMContentLoaded", function() {
  var PRIORITY_STATES = [ 'KS', 'SC' ];

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
        modalVisible: false
      }
    },

    watch: {
      tweetCount: function(val) {
        if (val === 4) {
          this.showModal()
        }
      }
    },

    computed: {
      localBusinesses: function() {
        var self = this;
        return this.businesses.filter(function(b){
          return b.state === self.selectedState;
        });
      },

      priorityBusinesses: function() {
        var self = this;
        return this.businesses.filter(function(b){
          return PRIORITY_STATES.indexOf(b.state) !== -1;
        }).slice(0, 20);
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
      }
    }
  });

  Vue.component('business-card', {
    template: '#business-card-template',
    props: [ 'business' ],
    
    computed: {
      tweetURL: function() {
        var tweetText = "@" + this.business.twitter + " i am tweeting at you!";
        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
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