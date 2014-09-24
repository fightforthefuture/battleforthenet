jQuery(function($) {
    // Political Scoreboard
    var $isotope = $('.isotope');
    var spreadsheetKey = $isotope.data('spreadsheet-key');
    var spreadsheetUrl = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetKey + '/default/public/values?alt=json';

    var isFrontpage = $isotope.data('frontpage');

    $.getJSON(spreadsheetUrl, function(response) {
        // Parse & sort by weight
        var players = [];
        for (var i in response.feed.entry) {
            var player = response.feed.entry[i];

            player = {
                frontpage: +player.gsx$frontpage.$t,
                name: player.gsx$name.$t,
                organization: player.gsx$organization.$t,
                image: '/images/scoreboard/' + player.gsx$imagepleasedontedit.$t,
                weight: player.gsx$weight.$t,
                team: player.gsx$team.$t || 'undecided',
                size: player.gsx$size.$t,
                meta: player.gsx$meta.$t,
                twitter: player.gsx$twitter.$t,
                sharetext: player.gsx$sharetext.$t
            };

            // Only hand picked players should show on the homepage.
            if (!isFrontpage || player.frontpage === 1) {
                players.push(player);
            }
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

            if (player.twitter) {
                var shareText;
                if (player.sharetext) {
                    shareText = encodeURIComponent(player.sharetext);
                } else {
                    shareText = '.@' + player.twitter + '%20whose%20side%20are%20you%20on?%20%23TeamInternet%20or%20%23TeamCable?%20Ask%20the%20FCC%20for%20Title%20II%20reclassification!';
                }

                var url = 'https://twitter.com/intent/tweet?text=' + shareText + '&url=https://www.battleforthenet.com&related=fightfortheftr';

                var $twitterOverlay = $.template('#twitter-overlay', {
                    twitter: url
                });

                $el.append($twitterOverlay);
            }

            $el.data('meta', player);

            $el.appendTo($els);
        }
        $els.appendTo($isotope);

        // Sort based on teams.
        regenerateWeights(players);

        // Initialize isotope.
        $isotope.isotope({
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

        // Resort based on teams, every resize.
        $(window).on('resize', function onResize() {
            regenerateWeights(players);
            $isotope.isotope('updateSortData').isotope();
        });
    });

    // Political Scoreboard logic
    function regenerateWeights(players) {
        var across = Math.floor($('#political').width() / 150),
            eligible = Math.ceil(across / 3);

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
                        query.team = 'team-internet';
                    } else {
                        query.team = 'team-cable';
                    }
                } else {
                    query.team = 'undecided';
                }
            }

            player = _.findWhere(players, query);

            if (!player) {
                delete query.team;
                player = _.findWhere(players, query);
            }

            player.weightGenerated = weight--;
            player.positioned = true;

            map[position.x][position.y] = true;
            if (player.size === 'large') {
                map[position.x + 1][position.y] = true;
                map[position.x][position.y + 1] = true;
                map[position.x + 1][position.y + 1] = true;
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
