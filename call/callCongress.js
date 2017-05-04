// Call Congress
(function() {
  function validatePhoneNumber(phone) {
    // Remove spaces, parentheses, dashes
    phone = phone.replace(/\s/g, '')
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/\-/g, '');

    // Remove country code
    // TODO: Add support for non-US country codes on backend?
    phone = phone.replace('+', '')
    if (phone.charAt(0) == '1') phone = phone.substr(1);

    // Return formatted phone number if valid
    return phone.length == 10 ? phone : false;
  }

  var callCongress = document.getElementById('fftf-call-congress');

  callCongress.addEventListener('submit', function(e) {
    e.preventDefault();

    var phone = validatePhoneNumber(e.currentTarget.querySelector('input[type=text]').value);

    if (!phone) return alert('Please enter a valid US phone number!');

    var xhr = new XMLHttpRequest();

    function logStatus(e) {
      if (e.type == 'error') {
        alert('If you are using Privacy Badger or another ad blocker, please allow requests to https://call-congress.fightforthefuture.org and try again.')
      }

      if (xhr.status) console.log(xhr.status, xhr.statusText);
    }

    xhr.addEventListener('load', logStatus);
    xhr.addEventListener('error', logStatus);

    xhr.open('post', 'https://call-congress.fightforthefuture.org/create', true);
    xhr.send("campaignId=battleforthenet-2017&userPhone=" + phone);

    document.getElementById("call-congress-form").style.display = "none";
    document.getElementById("phone-script").style.display = "block";

    // new CallActionModal();
  });
})();
