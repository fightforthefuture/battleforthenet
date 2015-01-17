// Give a heads up
alert(
    'Sorry, your web browser if very outdated.\n' +
    'Please download a modern browser to continue.'
);

// Avoid rare error
if (typeof window.event !== 'undefined' && window.event) {
    window.event.returnValue = false;
}

// Redirect
location.href = 'https://www.mozilla.org/en-US/firefox/new/';
