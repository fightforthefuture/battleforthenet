(function($) {

    $('#subscribe').click(function(e) {
        e.preventDefault();

        $.ajax('https://action.fightforthefuture.org/api/movements/1/salsa', {
            type: 'POST',
            data: {
                'csrfmiddlewaretoken': 'Hs3unIicI0ztSKnejzAn8CmPS4YnBCpW',
                'member[language]': 'en',
                'salsa': true,
                'language_id': 'en',
                'member[movement_id]': 1,
                'member[user_agent]': '',
                'member[ip_address]': '',
                'guard': '',
                'action': 1,
                'hp_enabled': true,
                'hp_disabled': false,
                'member[first_name]': '',
                'member[email]': $('#email').val(),
                'member[street_address]': '',
                'member[postcode]': '',
                'tag': 'battle-for-the-net-dev'
            },
            complete: function(xhr, status) {
                $('.signup').css('visibility', 'hidden');
                $('.signup-thanks').show();
            }
        });

    });
    /*
    
    */
    // Slide to new hash targets.
    $('a').each(function(i) {
        if (!$(this).attr('href') || !$(this).attr('href').match(/^#/)) {
            return;
        }
        $(this).on('click', function(e) {
            if (this.href.match(/#home/)) {
                    return;
            }

            e.preventDefault();

            var target = '#' + this.href.split('#')[1];
            $(target).velocity('scroll', {duration: 777, offset: -66}, function() {
                location.hash = target;
            });
        });
    });


})(jQuery);
