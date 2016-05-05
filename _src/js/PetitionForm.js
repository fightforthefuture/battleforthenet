var AJAX = require('./AJAX');
var Template = require('./Template');

var presetIntro = 'Last year the FCC protected the open Internet by passing strong Net Neutrality rules in response to the millions of people who spoke out. But now the same cable and phone companies that fought so hard to destroy Net Neutrality are creating harmful new schemes that pose a serious threat to the open Internet.';

var presetComplaints = {
    comcast: 'Comcast is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe Open Internet rules prevent ISPs from picking winners and losers online by slowing down some websites and applications while speeding up others. But now Comcast has found another way to pick winners and losers: it applies arbitrary data caps, but exempts its own video content while counting all competing video services toward those caps. This is a textbook case of an ISP abusing its power for its own competitive advantage. In addition, Comcast’s caps favor its own traditional cable service by discouraging customers from cutting the cord.\n\nI don’t want Comcast messing with my choice of video services by privileging its own content and punishing the rest. That hurts me, and it hurts the online video services I might use if they compete with Comcast by offering better price, quality and selection.\n\nThere’s no legitimate reason for data caps to exist at all. Comcast has admitted that its caps have nothing to do with managing congestion. Moreover, Comcast is limiting Internet use with data caps while charging a monthly fee for customers to get out from under those caps. This discourages broadband Internet use overall, and especially “cord-cutting” by users who’d rather give up their expensive cable TV packages and watch TV online.\n\nAs a Comcast customer, I should be able to choose freely whether I want to subscribe to Comcast’s traditional cable service or whether I want to watch video online instead— just as I should be able to choose which online video I want to watch. Comcast is interfering with these choices.\n\nAltogether, these practices prove what we’ve always known: Comcast hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by Comcast. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.',
    att:     'AT&T is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe Open Internet rules say that ISPs can’t charge websites and apps to be in the fast lane, so AT&T created another toll: they’re charging websites and apps to be exempted from customers’ data caps. Data shows that users find zero-rated content more attractive than content that counts against their caps. Thus, if web companies want to compete with those who pay, , they’ll need to enroll - for a fee - in AT&T’s sponsored data program. This creates a new toll for data traveling on the Internet and racks up charges for websites, applications, and content providers. Startups, small companies, and non-commercial speakers may face huge barriers if they can’t afford to pay new tolls and no longer have their fair shot at reaching people online. That’s not the kind of Internet I want to have.\n\nThese programs also create perverse incentives for AT&T to keep data caps low: The lower the caps, the more pressure on websites to pay up. Thus, these programs ultimately hurt Internet users like me who have less data to use on the apps they really want to use.\n\nFinally, these plans distort my ability to use the applications of my choice by pushing me and other Internet users toward sites with deep pockets and away from those who can’t afford the toll or don’t want to pay it. They effectively punish me for using sites that don’t pay the toll and unfairly raise the costs of the services that pay AT&T to be zero-rated (who then must pass that cost onto me).\n\nAs an AT&T customer, I don’t want AT&T to turn the Internet into a place where those without a lot of money can no longer compete on an equal footing. That would hurt our economy and our democracy. I request that the FCC investigate AT&T for using this zero rating scheme to skirt the Open Internet rules.\n\nAltogether, these practices prove what we’ve always known: AT&T hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by AT&T. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.',
    verizon: 'Verizon is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe Open Internet rules say that ISPs can’t charge websites and apps to be in the fast lane, so Verizon created another toll: they’re charging websites and apps to be exempted from customers’ data caps. Data shows that users find zero-rated content more attractive than content that counts against their caps. Thus, if web companies want to compete with those who pay, , they’ll need to enroll - for a fee - in Verizon’s sponsored data program. This creates a new toll for data traveling on the Internet and racks up charges for websites, applications, and content providers. Startups, small companies, and non-commercial speakers may face huge barriers if they can’t afford to pay new tolls and no longer have their fair shot at reaching people online. That’s not the kind of Internet I want to have.\n\nThese programs also create perverse incentives for Verizon to keep data caps low: The lower the caps, the more pressure on websites to pay up. Thus, these programs ultimately hurt Internet users like me who have less data to use on the apps they really want to use.\n\nFinally, these plans distort my ability to use the applications of my choice by pushing me and other Internet users toward sites with deep pockets and away from those who can’t afford the toll or don’t want to pay it. They effectively punish me for using sites that don’t pay the toll and unfairly raise the costs of the services that pay Verizon to be zero-rated (who then must pass that cost onto me).\n\nAs an Verizon customer, I don’t want Verizon to turn the Internet into a place where those without a lot of money can no longer compete on an equal footing. That would hurt our economy and our democracy. I request that the FCC investigate Verizon for using this zero rating scheme to skirt the Open Internet rules.\n\nAltogether, these practices prove what we’ve always known: Verizon hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by Verizon. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.',
    tmobile: 'T-Mobile is breaking the rules, and the FCC should put a stop to it. Furthermore, this decision should not be made behind closed doors. The FCC should have an open, public process to decide where and how to enforce these rules.\n\nThe FCC rules say that ISPs can’t be gatekeepers online. T-Mobile exempts the content of select video providers from customers’ data caps as part of its Binge On program, but only if those video providers meet T-Mobile’s substantial technical requirements. This makes it difficult for many start-ups, small players, and non-commercial speakers to join. These exemptions are available for video only, so T-Mobile is favoring some kinds of uses over others.\n\nNot only that, T-Mobile is downgrading all video across its network just to pull off the plan, breaking video on the sites of many independent creators and small services by forcing viewers to sit through the infamous “spinning wheel of death” as videos load or buffer. After coming under fire for this controversy, T-Mobile gave video sites a way to opt out, but they still have to meet specific technical requirements to do that.\n\nThese requirements are a ridiculous and unsustainable burden for small sites, and the idea of requiring special deals to access customers flies in the face of the FCC’s net neutrality rules. Imagine an Internet where small websites had to enter into technical conversations with every single cellphone company in the world, just to make sure their videos were not interfered with!\n\nAltogether, these practices prove what we’ve always known: T-Mobile hates the FCC’s Net Neutrality rules and is doing everything it can to get around them. In the long run, everyone on the Internet loses -- except carriers in the middle that get to impose data caps, charge tolls, and act as gatekeepers.\n\nThese plans need to be investigated and stopped. It’s the FCC’s job to protect consumers from these kinds of abuses by T-Mobile. Meanwhile, Congress should encourage the FCC to do its job and make these companies follow the rules, not interfere with the FCC’s power to regulate.\n\nNote: for privacy reasons, rather than providing my personal phone number, I’m providing the number of an advocacy group. If you’d like to contact me about my complaint, please do so via email.'
}

function PetitionForm(params) {
    // Params
    this.formTemplate = params.formTemplate;
    this.target = params.target;

    this.DOMNode = document.querySelector(this.target);

    this.render();
    this.addEventListeners();
}

PetitionForm.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.formTemplate, {});
    this.DOMNode.className = this.DOMNode.className.replace(/loading/, ' ');

};

PetitionForm.prototype.setCountryCode = function(countryCode) {
    this.DOMNode.querySelector('[name="member[country]"]').value = countryCode;
};

PetitionForm.prototype.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

PetitionForm.prototype.validatePhoneNumber = function(num) {
   num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
   num = num.replace("+", "").replace(/\-/g, '');

   if (num.charAt(0) == "1")
       num = num.substr(1);

   if (num.length != 10)
       return false;

   return num;
};

PetitionForm.prototype.addEventListeners = function() {
    var petitionFormNode = this.DOMNode.querySelector('#petition');
    var phoneCallFormNode = this.DOMNode.querySelector('#phone-call-form');
    var senatorsNode = this.DOMNode.querySelector('.your-senators-target');
    var thanksNode = this.DOMNode.querySelector('.thanks');
    var disclaimerNode = this.DOMNode.querySelector('.disclaimer_container');
    var alternativeCTA = phoneCallFormNode.querySelector('.alternative-cta');
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
    alternativeCTA.addEventListener('click', function(e) {
        e.preventDefault();

        petitionFormNode.style.display = 'none';
        phoneCallFormNode.style.display = 'none';
        senatorsNode.style.display = 'none';
        thanksNode.style.display = 'block';
        global.modals.display('share_modal');
    }, false);

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
};

PetitionForm.prototype.updateCTA = function updateCTA(cta) {
    this.DOMNode.querySelector('button[type="submit"]').textContent = cta;
};

module.exports = PetitionForm;
