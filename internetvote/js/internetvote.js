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


var form = $('#signup');
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!document.getElementById('email').value) {
        alert('Please enter an email address :)');
        return document.getElementById('email').focus();
    }

    $('.signup-thanks').style.display = 'block';
    $('.form-fields').style.opacity = 0;
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
}, false);

document.getElementById('twitter-button').addEventListener('click', function(e) {
    modal_show('twitter_modal');
    if (ga) ga('send', 'event', 'button', 'click', 'connect_twitter');
}, false);

var modal = document.getElementById('twitter_modal');

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

if (document.referrer.indexOf('//t.co') != -1 || window.location.href.indexOf('?twitter') != -1)
    modal_show('twitter_modal');