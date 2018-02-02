document.addEventListener("DOMContentLoaded", function() {
  var app = new Vue({
    el: '#app',

    data: function() {
      return {
        name: null,
        email: null,
        zipCode: null,
        phone: null,
        isLoading: false,
        formMessage: null
      }
    },

    methods: {
      submitForm: function() {
        var self = this;
        self.isLoading = true;
        self.$http.post('https://queue.fightforthefuture.org/action', {
          member: {
            first_name: this.name,
            email: this.email,
            postcode: this.zipCode,
            phone_number: this.phone,
            country: 'US'
          },
          hp_enabled: 'true',
          guard: '',
          contact_congress: 0,
          org: 'fftf',
          an_tags: '[&quot;net-neutrality&quot;]',
          an_petition_id: '11f84b38-e65b-4259-b0ae-e879a4044ca9'
        }, { emulateJSON: true })
        .then(function(response){
          self.isLoading = false;

          if (response.ok) {
            self.phone = null;
            this.name = null;
            this.email = null;
            this.zipCode = null;
            self.formMessage = "Thanks! We'll be in touch :)";
            // self.showModal();
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
    }
  })
});