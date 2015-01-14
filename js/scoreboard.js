;(function ($) {
    var templates = {};

    function jQueryDotTemplate (target, values) {
        if (!templates[target]) {
            templates[target] = $(target).html();
        }

        var $html = $('<div>' + templates[target] + '</div>');

        for (var i in values) {
            $html.find('.class-' + i).addClass(values[i]);
            $html.find('.href-' + i).attr('href', values[i]);
            $html.find('.src-' + i).attr('src', values[i]);
            $html.find('.target-' + i).attr('target', values[i]);
            $html.find('.text-' + i).text(values[i]);
        }

        return $html.children();
    }

    $.template = jQueryDotTemplate;
})(jQuery);

jQuery(function($) {
    // Political Scoreboard
    var $isotope = $('.isotope');
    var $politicalSelect = $('.political select');
    var spreadsheetKey = $isotope.data('spreadsheet-key');
    var spreadsheetUrl = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetKey + '/default/public/values?alt=json';

    var spreadsheetData = [];
    var players = [];

    var state = location.href.match(/state=([\w-_\s\+]+)/i);
    if (state)
    {
        state = state[1].replace('+', ' ').replace('%20', ' ');
        $politicalSelect.val(state);
    }

    if (window.global && global.ajaxResponses) {
        onPoliticiansAvailable(global.ajaxResponses.politicians);
    } else {
        $.getJSON(spreadsheetUrl, function(response) {
            onPoliticiansAvailable(response.feed.entry);
        });
    }

    function onPoliticiansAvailable(spreadsheetData) {
        // Parse & sort by weight

        if (state) {
            showPlayers(spreadsheetData, true, state);
        } else {
            if (window.global && global.ajaxResponses) {
                onGeocoderResponse(global.ajaxResponses.geography);
            } else {
                $.ajax({
                    url: '//fftf-geocoder.herokuapp.com/',
                    dataType: 'json',
                    type: 'get',
                    success: onGeocoderResponse
                });
            }
        }

        function onGeocoderResponse(data) {
            if (
                data.country.iso_code === 'US' &&
                data.subdivisions &&
                data.subdivisions[0] &&
                data.subdivisions[0].names &&
                data.subdivisions[0].names.en
            ) {
                state = data.subdivisions[0].names.en;
                $politicalSelect.val(state);
            }

            showPlayers(spreadsheetData, true, state || false);
        }

        $politicalSelect.on('change', function() {
            var whichState = $(this).val();
            var subset = [];

            if (whichState == 'key')
                return $isotope.isotope({
                    filter: function() {
                        return $(this).find('.frontpage').text()==1;
                    }
                });
            else if (whichState == 'team-internet')
                return $isotope.isotope({ filter: '.team-internet' });
            else if (whichState == 'team-cable')
                return $isotope.isotope({ filter: '.team-cable' });
            else if (whichState == 'undecided')
                return $isotope.isotope({ filter: function() {
                    return !$(this).hasClass('team-internet') && !$(this).hasClass('team-cable')
                } });

            $isotope.isotope({
                filter: function() {
                    // `this` is the item element. Get text of element's .number
                    var state = $(this).find('.state').text();
                    // return true to show, false to hide
                    return state == whichState;
                }
            });
        });
    }

    function showPlayers(data, showGeneral, state) {
        $isotope.html('');
        players = [];

        var imageBaseURL = 'images/scoreboard/';
        if (location.href.match(/\/scoreboard\//)) {
            imageBaseURL = '../' + imageBaseURL;
        }

        for (var i in data) {
            var player = data[i];

            player = {
                frontpage: +player.gsx$frontpage.$t,
                first: player.gsx$first.$t,
                name: player.gsx$name.$t,
                organization: player.gsx$organization.$t,
                image: imageBaseURL + player.gsx$imagepleasedontedit.$t,
                weight: player.gsx$weight.$t,
                team: player.gsx$team.$t || 'undecided',
                size: player.gsx$size.$t,
                meta: player.gsx$meta.$t,
                twitter: player.gsx$twitter.$t,
                sharetext: player.gsx$sharetext.$t,
                subdomain: player.gsx$subdomain.$t,
                state: player.gsx$state.$t,
            };

            // Only hand picked players should show on the homepage.
            //if (!isFrontpage || player.frontpage === 1 || !showGeneral) {
            players.push(player);
            //}
        }

        players = players.sort(function(a, b) {
            var weightA = a.weight,
                weightB = b.weight;

            if (a.organization === 'Senate') {
                weightA += 10;
            }

            if (b.organization === 'Senate') {
                weightB += 10;
            }

            return weightB - weightA;
        });

        // Create elements
        var $els = $('<div>');
        for (var i in players) {
            var player = players[i];
            var $el = $.template('#player', player);

            var subdomain = 'http://';

            if (player.subdomain)
                subdomain += player.subdomain;
            else
                subdomain += player.first + player.name;

            if (player.team == 'team-internet')
                subdomain += '.savesthe.net';
            else
                subdomain += '.breaksthe.net';

            if (player.organization == 'Senate' || player.organization == 'House') {
                if (player.twitter) {
                    var shareText;
                    if (player.sharetext) {
                        shareText = encodeURIComponent(player.sharetext);
                    } else {
                        shareText = encodeURIComponent(GLOBAL_TWEET_TEXT);
                    }

                    var url = 'https://twitter.com/intent/tweet?text=' + shareText + '&related=fightfortheftr';
                    console.log(url);

                    var $twitterOverlay = $.template('#twitter-overlay', {
                        twitter: url,
                        subdomain: subdomain
                    });

                    $el.append($twitterOverlay);
                }
                else {
                    var $moreOverlay = $.template('#more-overlay', {
                        subdomain: subdomain
                    });

                    $el.append($moreOverlay);
                }
            }

            $el.data('meta', player);

            $el.appendTo($els);
        }
        $els.appendTo($isotope);

        // Sort based on teams.
        regenerateWeights(players);

        // Mark body as loaded.
        if (location.href.match(/\/scoreboard\//)) {
            document.body.className = 'loaded';
        }

        // Initialize isotope.
        $isotope.isotope({
            filter: function() {

                if (!state)
                {
                    return $(this).find('.frontpage').text() == 1;
                }
                else
                {
                    var filterState = $(this).find('.state').text();
                    // return true to show, false to hide
                    return filterState == state;
                }
            },
            getSortData: {
                weight: function(el) {
                    var meta = $(el).data('meta');
                    return -meta.weightGenerated || -meta.weight;
                }
            },
            itemSelector: '.politician',
            masonry: {
                columnWidth: 150,
                isFitWidth: true
            },
            sortBy: 'weight'
        });
    }

    // Political Scoreboard logic
    function regenerateWeights(players) {
        var across = Math.floor($('#political').width() / 150),
            eligible = Math.ceil(across);

        // We can't sort with less than 3 columns.
        if (across < 3) {
            return _.each(players, function(player) {
                player.weightGenerated = null;
            });
        }

        // Create a map, for hit detection.
        var map = [];
        _.times(across, function() {
            map.push([]);
        });

        var position = {
                x: 0,
                y: 0
            },
            remaining = players.length,
            weight = 10000;

        // Add flag to each player.
        _.each(players, function(player) {
            player.positioned = false;
        });


        // Place each player.
        while (remaining > 0) {
            var availability = getSpatialAvailability(position, map);
            if (!availability) {
                position = movePosition(position, map);
                continue;
            }

            var player,
                query = {
                    positioned: false
                };

            if (availability === 'small') {
                query.size = 'small';
            }

            if (position.x <= eligible - 1) {
                query.team = 'team-cable';
            } else if (position.x >= across - eligible) {
                query.team = 'team-internet';
            } else {
                query.team = 'undecided';
            }

            player = _.findWhere(players, query);

            if (!player) {
                if (query.team === 'undecided') {
                    if ((position.x + 1) / across > .5) {
                        query.team = 'undecided';
                    } else {
                        query.team = 'team-cable';
                    }
                } else {
                    query.team = 'team-internet';
                }
            }

            player = _.findWhere(players, query);

            if (!player) {
                delete query.team;
                player = _.findWhere(players, query);
            }
            if (player)
            {


                player.weightGenerated = weight--;

                player.positioned = true;

                map[position.x][position.y] = true;
                if (player.size === 'large') {
                    map[position.x + 1][position.y] = true;
                    map[position.x][position.y + 1] = true;
                    map[position.x + 1][position.y + 1] = true;
                }
            }

            // printMap(position, map);

            position = movePosition(position, map);

            remaining--;
        }
    }

    function printMap(position, map) {
        var width = map.length;

        console.log('');

        var msg;
        for (var y = 0, yMax = map[0].length; y < yMax; y++) {
            msg = y + ': ';
            for (var x = 0, xMax = map.length; x < xMax; x++) {
                var value = map[x][y];

                var character;
                if (x === position.x && y === position.y) {
                    character = '* ';
                } else if (value === undefined) {
                    character = '- ';
                } else if (value === true) {
                    character = 'x ';
                }

                msg += character;
            }
            console.log(msg + '\n');
        }
    }

    function movePosition(position, map) {
        position.x++;

        if (position.x === map.length) {
            position.x = 0;
            position.y++;
        }

        return position;
    }

    function getSpatialAvailability(position, map) {
        if (map[position.x][position.y]) {
            return false;
        }

        if (!map[position.x][position.y + 1] &&
            map[position.x + 1] &&
            !map[position.x + 1][position.y] &&
            !map[position.x + 1][position.y + 1]
        ) {
            return 'large';
        }

        return 'small';
    }
});
