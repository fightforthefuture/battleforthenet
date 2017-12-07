$(function(){
  var showModal = function() {
    $('.modal-wrapper').fadeIn();
    $('body').addClass('modal-open');
  };

  var hideModal = function() {
    $('.modal-wrapper').fadeOut();
    $('body').removeClass('modal-open');
  };

  var showTwitterModal = function() {
    var url = 'https://mothership-js.fightforthefuture.org/connect/twitter?tag=breaktheinternet';
    var properties = 'width=600,height=500,toolbar=no,status=no,menubar=no';
    window.open(url, 'idl_connect', properties);
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
    showTwitterModal();
  });
});