document.addEventListener("DOMContentLoaded", function() {
  var STATES = [
    "Alaska",
    "Alabama",
    "Arkansas",
    "Arizona",
    "California",
    "Colorado",
    "Connecticut",
    "District of Columbia",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Iowa",
    "Idaho",
    "Illinois",
    "Indiana",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Massachusetts",
    "Maryland",
    "Maine",
    "Michigan",
    "Minnesota",
    "Missouri",
    "Mississippi",
    "Montana",
    "North Carolina",
    "North Dakota",
    "Nebraska",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "Nevada",
    "New York",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Virginia",
    "Vermont",
    "Washington",
    "Wisconsin",
    "West Virginia",
    "Wyoming"
  ];

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

  Vue.filter('formatNumber', formatNumber);
  Vue.filter('pluralize', pluralize);

  var app = new Vue({
    el: '#political-scoreboard',

    data: {
      states: STATES,
      selectedState: null,
      politicians: [],
      isLoaded: false,
    },

    computed: {
      // ORDER BY yesOnCRA ASC, partyCode ASC, name ASC
      sortedPoliticians: function() {
        return this.politicians.sort(function(a, b){
          if (a.yesOnCRA === b.yesOnCRA) {
            if (a.partyCode === b.partyCode) {
              if (a.name < b.name) {
                return -1;
              }
              else if (a.name > b.name) {
                return 1;
              }
              else {
                return 0;
              }
            }
            else if (a.partyCode < b.partyCode) {
              return -1;
            }
            else {
              return 1;
            }
          }
          else if (a.yesOnCRA) {
            return 1;
          }
          else {
            return -1;
          }
        });
      },

      senators: function() {
        return this.sortedPoliticians.filter(function(p){
          return p.organization === 'Senate';
        });
      },

      representatives: function() {
        return this.sortedPoliticians.filter(function(p){
          return p.organization === 'House';
        });
      },

      senatorsInState: function() {
        var self = this;
        return this.senators.filter(function(p){
          return p.state === self.selectedState;
        });
      },

      congressInState: function() {
        var self = this;
        return this.politicians.filter(function(p){
          return p.state === self.selectedState;
        });
      },

      teamInternet: function() {
        return this.politicians.filter(function(p){
          return p.team === 'team-internet';
        });
      },

      undecided: function() {
        return this.politicians.filter(function(p){
          return p.team === 'undecided';
        });
      },

      teamCable: function() {
        return this.politicians.filter(function(p){
          return p.team === 'team-cable';
        });
      },

      senateCRACount: function () {
        return this.senators.filter(function(p){
          return p.yesOnCRA
        }).length
      },

      houseCRACount: function() {
        return this.representatives.filter(function(p){
          return p.yesOnCRA
        }).length
      }
    },

    created: function() {
      this.geocodeSelectedState();
      this.fetchPoliticians();
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
              self.selectedState = geo.subdivisions[0].names.en;
            }
          }
        });
      },

      fetchPoliticians: function() {
        var self = this;
        this.$http.get('https://data.battleforthenet.com/politicians.json').then(function(response){
          if (response.ok) {
            self.politicians = response.body;
            self.isLoaded = true;
          }
          var changeColor = {};
          self.politicians.forEach(function(pol) {
            var state = pol.state;
            // console.log(pol)
            if (state && pol.yesOnCRA === true) {
              if (!changeColor.hasOwnProperty(state)) {
                changeColor[state] = 1;
              } else if (changeColor.hasOwnProperty(state)) {
                changeColor[state] += 1;
              }
            } else if (state && pol.yesOnCRA === false) {
                if (!changeColor.hasOwnProperty(state)) {
                  changeColor[state] = - 1;
                } else if (changeColor.hasOwnProperty(state)) {
                  changeColor[state] -= 1;
                }
              }
          })

          var undecided = [];
          for (state in changeColor) {
            if (changeColor[state] > 0) {
              this.setStateColor(state);
            }
            if (changeColor[state] === 0) {
              undecided.push(state);
            }
          }
          // this.undecidedState(undecided);
        });
      },

      setStateColor: function(elem) {
        var mapState = document.getElementsByTagName("path");
        for (var i = 0; i < mapState.length; i++) {
          if (mapState[i].id === elem) {
            mapState[i].setAttribute("fill", "#45bcc0");
          }
        }
      },

      // This method lists the undecided states above the map
      // undecidedState: function(arr) {
      //   var undecidedStates = document.querySelector(".undecided");
      //   arr.forEach(function(elem) {
      //     undecidedStates.innerHTML += '<p>' + '*' + elem + '<p>';
      //   })
      // },

      // This method adds asterisks to the map for undecided states...not working yet
      // undecidedState: function(arr) {
      //   var undecidedStates = document.querySelector("textPath");
      //   arr.forEach(function(state) {
      //     undecidedStates.setAttribute("href", "#" + state);
      //   })
      // },

      mapState: function(e) {
        this.selectedState = e.target.id;
      }
    }
  });

  Vue.component('politician-card', {
    template: '#politician-card-template',
    props: [ 'politician' ],
    methods: {
      imageURL: function(pol, suffix='_x1') {
        return 'https://www.fightforthefuture.org/congress-images/' +  pol.biocode + suffix + '.jpg';
      },

      isLong: function(name) {
        return name.indexOf(' ') === -1 && name.length > 11;
      },

      tweetURL: function(pol) {
        var tweetText;

        if (pol.yesOnCRA) {
          tweetText = 'I am delighted that @' + pol.twitter + ' will be voting for the CRA to overrule the FCC and save our #NetNeutrality rules. Find out where your representatives stand and ask them to do the same! https://battleforthenet.com';
        }
        else if (pol.organization === 'House') {
          tweetText = '@' + pol.twitter + ' why haven\'t you promised to co-sponsor, sign the discharge petition, and vote for the #NetNeutrality CRA to overrule the FCC? This issue matters to me! (Friends: find out where your representatives stand and contact them at https://battleforthenet.com)';
        }
        else {
          tweetText = '@' + pol.twitter + ', why haven\'t you promised to vote for the CRA to overrule the FCC and save our #NetNeutrality rules? This issue matters to me! (Friends: find out where your representatives stand and contact them at https://battleforthenet.com)';
        }

        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
      },

      openTweetURL: function(pol) {
        var url = this.tweetURL(pol);
        window.open(url, '_blank');
      }
    }
  });

  Vue.component('team-legend', {
    template: '#team-legend-template'
  });

});
