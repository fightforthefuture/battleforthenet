var CALL_CAMPAIGN = 'stop-tpp';

function AJAX(params) {
    this.async = params.async || true;
    this.error = params.error;
    this.method = params.method || 'GET';
    this.success = params.success;
    this.form = params.form;
    this.url = params.url;

    this.request = new XMLHttpRequest();
    this.request.open(this.method, this.url, this.async);

    if (this.success) {
        this.request.onload = this.success;
    }

    if (this.error) {
        this.request.onerror = this.error;
    }

    if (this.form) {
        var params = this.serializeForm(this.form);
        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.request.send(params);
    } else {
        this.request.send();
    }

}

AJAX.prototype.serializeForm = function(form) {
    if (!form || form.nodeName !== "FORM") {
        return;
    }

    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue;
        }
        switch (form.elements[i].nodeName) {
        case 'INPUT':
            switch (form.elements[i].type) {
            case 'text':
            case 'hidden':
            case 'password':
            case 'button':
            case 'reset':
            case 'submit':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'checkbox':
            case 'radio':
                if (form.elements[i].checked) {
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                }
                break;
            case 'file':
                break;
            }
            break;
        case 'TEXTAREA':
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
            break;
        case 'SELECT':
            switch (form.elements[i].type) {
            case 'select-one':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'select-multiple':
                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                    if (form.elements[i].options[j].selected) {
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                    }
                }
                break;
            }
            break;
        case 'BUTTON':
            switch (form.elements[i].type) {
            case 'reset':
            case 'submit':
            case 'button':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            }
            break;
        }
    }

    return q.join("&");
};

function $(query, callback) {
    var node = document.querySelector(query);

    if (callback && node) {
        callback(node);
    }

    return node;
}

function $$(query, callback) {
    var nodeList = document.querySelectorAll(query);
    var nodes = Array.prototype.slice.call(nodeList);

    if (callback) {
        nodes.forEach(callback);
    }

    return nodes;
}

// Setup AJAX form submissions
function modal_show(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.style.display = 'table';
    setTimeout(function() {
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');
    }, 50);
};
function modal_hide(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.className += 'invisible';
    setTimeout(function() {
        overlayNode.style.display = 'none';
    }, 400);
}
var validate_phone = function(num) {
    num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
    num = num.replace("+", "").replace(/\-/g, '');

    if (num.charAt(0) == "1")
        num = num.substr(1);

    if (num.length != 10)
        return false;

    return num;
};

var form = $('#signup');
form.addEventListener('submit', function(e) {
    e.preventDefault();

    
    if (!document.getElementById('email').value) {
        alert('Please enter an email address :)');
        return document.getElementById('email').focus();
    }
    $('#action_comment').value = $('#petition_text').textContent;

    $('.signup-thanks').style.display = 'block';
    $('.form-fields').style.opacity = 0;
    $('.disclaimer').style.opacity = 0;
    setTimeout(function() {
        $('.signup-thanks').style.opacity = 1;
    }, 50);

    new AJAX({
        form: form,
        method: 'POST',
        success: function(res) {
            console.log(res);
        },
        url: form.getAttribute('action')
    });
    if (ga) ga('send', 'event', 'form', 'submit', 'internetvote_email');
    modal_show('plz_call_modal');
    
    /*
    var phone = document.getElementById('phone').value;

    if (!validate_phone(phone))
        return alert('Please enter a valid US phone number!');

    var data = new FormData();
    data.append('campaignId', CALL_CAMPAIGN);
    data.append('userPhone', validate_phone(phone));

    var url = 'https://call-congress.fightforthefuture.org/create';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('sent!', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(data);
    modal_show('call_modal');
    */
}, false);

var form2 = $('#plz_call_modal form');
form2.addEventListener('submit', function(e) {
    e.preventDefault();

    var phone = document.getElementById('phone').value;

    if (!validate_phone(phone))
        return alert('Please enter a valid US phone number!');

    modal_hide('plz_call_modal');

    var data = new FormData();
    data.append('campaignId', CALL_CAMPAIGN);
    data.append('userPhone', validate_phone(phone));

    var url = 'https://call-congress.fightforthefuture.org/create';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('sent!', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(data);

    modal_show('call_modal');

}, false);

var twitter_buttons = ['twitter-button', 'twitter-button2'];

for (var i = 0; i < twitter_buttons.length; i++) {
    document.getElementById(twitter_buttons[i]).addEventListener('click', function(e) {
        e.preventDefault();
        modal_show('twitter_modal');
        if (ga) ga('send', 'event', 'button', 'click', 'connect_twitter');
    }, false);
}

var bindModal = function(modal) {
    modal.querySelector('.gutter').addEventListener('click', function(e) {
        if (e.target === e.currentTarget) {
            e.preventDefault();
            modal_hide(modal.id);
        }
    }.bind(this), false);

    modal.querySelector('.modal .close').addEventListener('click', function(e) {
        e.preventDefault();
        modal_hide(modal.id);
    }.bind(this), false);
};

var modals = ['twitter_modal', 'call_modal', 'plz_call_modal', 'petition_modal'];

for (var i = 0; i < modals.length; i++) {
    bindModal(document.getElementById(modals[i]));
}

if (document.referrer.indexOf('//t.co') != -1 || window.location.href.indexOf('?twitter') != -1)
    modal_show('twitter_modal');

new AJAX({
    method: 'GET',
    success: function(res) {
        var data = res.target.responseText;
        var d = document.getElementById;
        var c = function(nStr)
        {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }
        var s = function(str) {
            var rex = /(<([^>]+)>)/ig;
            str = str.replace(rex, "");
            str = str.replace("javascript:", "");
            return str;
        }

        try {
            data = JSON.parse(data);
        } catch(err) {
            return console.error('Could not parse leaderboard data :(');
        }
        console.log('leaderboard', data);

        document.getElementById('sites_participating').innerHTML = c(data.sites_participating);
        document.getElementById('sites_total_actions').innerHTML = c(data.sites_total_actions);
        document.getElementById('total_calls').innerHTML = c(data.total_calls);
        document.getElementById('total_calls_last_24').innerHTML = c(data.total_calls_last_24);
        document.getElementById('total_emails').innerHTML = c(data.total_emails);

        for (var site in data.sites_top) {
            if (data.sites_top.hasOwnProperty(site)) {

                var val = c(data.sites_top[site].toString().replace('.0', ''));
                var site = s(site);
                var li = document.createElement('li');
                li.innerHTML = '<a href="http://'+ site +'" target="_blank">'+ site +' ('+val+')</a>';
                document.getElementById('sites_top').appendChild(li);
            }
        }

        for (var site in data.sites_top_today) {
            if (data.sites_top_today.hasOwnProperty(site)) {
                var val = c(data.sites_top_today[site].toString().replace('.0', ''));
                var site = s(site);
                var li = document.createElement('li');
                li.innerHTML = '<a href="http://'+ site +'" target="_blank">'+ site +' ('+val+')</a>';
                document.getElementById('sites_top_today').appendChild(li);
            }
        }

        document.getElementById('show_all').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('show_all').style.display = 'none';
            document.getElementById('columns').className = document.getElementById('columns').className.replace(/obscured/g, '');
            document.getElementById('columns').style.height = 'auto';
        }.bind(this), false);
    },
    url: 'https://battleforthenet.s3.amazonaws.com/leaderboards/internetvote.click.json'
});

document.querySelector('#show_all a').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('show_all').style.display = 'none';
    var columns = document.querySelectorAll('.col-sm-4')
    for (var i = 0; i < columns.length; i++) {
        columns[i].className = columns[i].className.replace('hidden', '');
    }
}, false);

document.querySelector('#petition_link').addEventListener('click', function(e) {
    e.preventDefault();
    modal_show('petition_modal');
}, false);

var fb = document.querySelectorAll('.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.battleforthenet.com%2Finternetvote%2F');
    }, false);
}

var tws = document.querySelectorAll('.twitter.share');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT));
    }, false);
}

var ems = document.querySelectorAll('.email');
for (var i = 0; i < ems.length; i++) {
    ems[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('mailto:?subject=Call+to+stop+censorship&body=https%3A%2F%2Fwww.battleforthenet.com%2Finternetvote%2F');
    }, false);
}