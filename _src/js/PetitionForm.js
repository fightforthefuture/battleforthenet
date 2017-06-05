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

  this.render();
  this.setOrganization();
  this.setUTMContent();
  this.addEventListeners();
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
      var actionCommentEl = form.querySelector('textarea[name="action_comment"]');

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
      formData.append('action_comment', (etsyLink ? ('Etsy Shop ' + etsyLink + '\n\n') : '') + actionCommentEl.value);

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

  if (form.querySelector('textarea[name="action_comment"]')) {
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
  } else if (form.querySelector('textarea[name="comment"]')) {
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
