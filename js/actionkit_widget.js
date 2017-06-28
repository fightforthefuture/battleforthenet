/*
This is the code for ActionKit's AJAXy signup widget!

To use, make a simple action form with class="actionkit-widget" and then include
widget.js like so:

<script async src="//[your domain]/samples/widget.js"></script>

On error, ActionKit pops up a JavaScript alert() with the errors. On success,
ActionKit hides the form and shows an element with id="[formid]-replacement"
if one exists (or [formname]-replacement if no [formid]-replacement exists).
If no replacement exists, it just hides the form.

You can add custom behavior by defining one of these functions:

- onWidgetSubmit(form)
  Runs before the form is submitted. Return false if you want to stop the
  submit.

- onWidgetSuccess(form, serverResponse)
  Runs after the widget submits successfully. The serverResponse argument
  is an object with 'result' and 'redirect' attributes; the redirect URL
  includes the akid and action_id if you need those.

- onWidgetError(form, serverResponse)
  Runs after errors. serverResponse.errors contains errors for each field:
  serverResponse.errors.email could be ['Invalid e-mail.']. Return false
  if you want to stop the default error popup from showing.
*/

(function() {
var w=window,d=document;

function err(e) { if (window.console && console.error) console.error(e) }

function defaultWidgetSuccess(f, response) {
    if ( w.onWidgetSuccess ) {
        try {
            var res = onWidgetSuccess(f, response);
            if ( typeof(res) === typeof(false) && !res ) return false;
        } catch(e) { err(e) };
    }
    var replacement = (
        d.getElementById(f.getAttribute('id')+'-replacement')
        || d.getElementById(f.getAttribute('name')+'-replacement')
    );
    if ( typeof(w.jQuery) != "undefined" && jQuery.fn.slideDown ) {
        jQuery(f).slideUp('fast');
        if ( replacement )
            jQuery(replacement).slideDown('fast');
    }
    else {
        if ( replacement ) {
            f.style.display='none';
            replacement.style.display='block';
        }
    }
};

function defaultWidgetError(f, response) {
    if ( w.onWidgetError ) {
        try {
            var res = onWidgetError(f, response);
            if ( typeof(res) === typeof(false) && !res ) return false;
        } catch(e) { err(e) };
    }
    var error_list = [];
    for ( error in response.errors )
        error_list.push(response.errors[error][0]);
    alert(error_list.join('\n'))
    try {
        for ( error in response.errors ) {
            f[error].val='';
            f[error].focus();
        }
    } catch(e) {};
};

// Best not to change after this point
function processWidgetSubmit() {
    var f = w.currentlySubmittingWidget = this;
    if ( w.onWidgetSubmit ) {
        try {
            var res = onWidgetSubmit(f);
            if ( typeof(res) === typeof(false) && !res ) return false;
        } catch(e) { err(e) };
    }
    f.className += ' submitting';
    d.body.focus();
    addHidden(f, 'callback', 'receivedWidgetResponse');
    addHidden(f, 'utf8', '\u1234');
    addHidden(f, 'js', '1');
    jsonpSubmit(f)
    return false;
}

/* Code to do a JSONP submit */

function enc(s) {
    return encodeURIComponent(s).replace(/%20/g, '+')
}
// based on code from StackOverflow: http://bit.ly/1CqCWyJ . Leaves out the
// button you clicked, but seems to do the textboxes/checkboxes/hidden
// inputs you usually see in widgets. See
// http://malsup.com/jquery/form/comp/ for a list of the corner cases.
function serialize(f) {
    var pieces = [];
    for (var i = 0; i < f.elements.length; i++) {
        var field = f.elements[i];
        if (field.disabled || !field.name) continue;
        if (/^(file|reset|submit|button)$/i.test(field.type)) continue;
        if (/^(checkbox|radio)$/.test(field.type) && !field.checked) continue;

        if (field.type == 'select-multiple') {
            var opts = field.options;
            for (var j = 0; j < opts.length; j++) {
                var opt = opts[j];
                if (opt.selected) {
                    pieces.push(
                        enc(field.name) + "=" + enc(opt.value)
                    );
                }
            }
        } else {
            pieces.push(
                enc(field.name) + "=" + enc(field.value)
            );
        }
    }
    return pieces.join("&");
}

function jsonpSubmit(form) {
    var scriptTag = document.createElement('script');
    var queryString;
    if ( typeof(jQuery) != "undefined" && jQuery.fn.serialize ) {
        queryString = jQuery(form).serialize();
    } else {
        queryString = serialize(form);
    }
    scriptTag.src = form.action + '?' + queryString;
    var otherTag = document.getElementsByTagName('script')[0];
    otherTag.parentNode.insertBefore(scriptTag, otherTag)
}

function receivedWidgetResponse(response) {
    var f = w.currentlySubmittingWidget;
    f.className = f.className.replace('submitting','');
    if ( response.result == 'success' ) defaultWidgetSuccess(f, response);
    else defaultWidgetError(f, response);
}
window.receivedWidgetResponse = receivedWidgetResponse;

function addHidden(f, name, val) {
    if (f[name]) return;
    var input = d.createElement('input');
    input.name=name;
    input.value=val;
    input.type='hidden';
    f.appendChild(input);
}

// Add styles; you can override these with your own !important CSS
var styleText = (
    '.actionkit-widget.submitting { '
    + 'opacity: 0.5; '
    + 'filter: alpha(opacity=50); '
    + 'pointer-events: none;'
    + '}'
)
var style = document.createElement('style');
style.type = 'text/css';
if(style.styleSheet)
    style.styleSheet.cssText = styleText;
else
    style.appendChild(document.createTextNode(styleText));
document.getElementsByTagName('head')[0].appendChild(style);

for ( var i = 0; i < d.forms.length; ++i ) {
    var f = d.forms[i];
    if (!/actionkit-widget/.test(f.className)) continue;
    f.onsubmit = processWidgetSubmit;
    if ( f.submitted ) { f.onsubmit(); f.submit(); }
}
})();