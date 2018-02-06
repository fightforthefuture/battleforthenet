document.addEventListener("DOMContentLoaded", function() {
  Vue.component('progress-bar', {
    template: '#progress-bar-template',

    props: [ 'bars' ],

    data: function() {
      return {
        currentIndex: 0
      }
    },

    computed: {
      isDone: function() {
        return this.bars === this.currentIndex
      },
    },

    created: function() {
      var self = this;
      setTimeout(function(){
        self.animation = setInterval(self.animate, 25);
      }, 1000);
    },

    destroyed: function() {
      clearInterval(this.animation)
    },

    methods: {
      animate: function() {
        if (this.currentIndex < this.bars) {
          this.currentIndex += 1
        }
        else {
          clearInterval(this.animation)
        }
      }
    }
  });

  var app = new Vue({
    el: '#app',

    data: function() {
      return {
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

    methods: {
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
          an_tags: '[&quot;net-neutrality&quot;]',
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
      }
    }
  });
});