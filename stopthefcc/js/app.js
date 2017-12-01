$(function(){
  $('form').submit(function(e){
    e.preventDefault();
    
    var $form = $(this);
    var params = $form.serialize();
    
    $('.form-error').hide();
    $form.find('input').attr('disabled', 'disabled');

    var $button = $form.find('button')
    var buttonText = $button.text()
    $button.text('Loading...');
    
    $.post($form.attr('action'), params, function(response) {
      if (response.data) {
        $form.slideUp('fast', function(){
          $('.form-success').show()
        });
      }
      else {
        $form.find('input').removeAttr('disabled');
        $('.form-error').show();
        $button.text(buttonText);
      }
    });
  });
});