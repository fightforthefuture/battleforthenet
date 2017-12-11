$(function(){
  function PopupCenter(url, title, w, h) {
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
  }

  var showModal = function() {
    $('.modal-wrapper').fadeIn();
    $('body').addClass('modal-open');
  };

  var hideModal = function() {
    $('.modal-wrapper').fadeOut();
    $('body').removeClass('modal-open');
  };

  var showTwitterPopup = function() {
    PopupCenter('twitter.html', 'twitter', 600, 500);
  };

  // toggle large audience checkbox
  $('input[name=volunteer]').click(function(e){
    var isChecked =  $(this).is(':checked');
    var $div = $('.action-comment');

    if (isChecked) {
      $div.show(100, function(){
        $div.find('input').focus();
      })
    }
    else {
      $div.slideUp(100);
    }
  });

  // submit form
  $('form').submit(function(e){
    e.preventDefault();
    
    var $form = $(this);
    var params = $form.serialize();
    
    $('.form-error').hide();
    $form.find('input').attr('disabled', 'disabled');

    var $button = $form.find('button')
    var buttonText = $button.text()
    $button.text('Saving...');
    
    $.post($form.attr('action'), params, function(response) {
      if (response.data) {
        showModal();
      }
      else {
        $('.form-error').show();
      }

      $form.find('input').removeAttr('disabled');
      $button.text(buttonText);
    });
  });

  // close modal
  $('.modal .close').click(function(e) {
    e.preventDefault();
    hideModal();
  });

  // twitter tool modals
  $('.twitter-modal').click(function(e){
    e.preventDefault();
    showTwitterPopup();
  });
  var loc = window.location.href;
  if (loc.indexOf('org=dp') != -1) {
    document.getElementById('fftf_disclosure').style.display = 'none';
    document.getElementById('fftf_form').style.display = 'none';
    document.getElementById('dp_disclosure').style.display = 'block';
    document.getElementById('dp_form').style.display = 'block';
    document.getElementsByClassName('congress-btn')[0].href='/?org=dp';
    }
});
