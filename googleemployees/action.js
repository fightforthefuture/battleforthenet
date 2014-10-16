$(function() {
    $('#action_form').bind('submit', function(e){
        var form = $(this);
        var buttons = form.find('input[type=submit]');

        buttons.attr('disabled', 'disabled').text('Working...');

        $.post(form.attr('action'), form.serialize(), function(data){
            alert('thanks!')
        });

        e.preventDefault();
    });
})