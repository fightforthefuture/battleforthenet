// Alert for IE<9
if (!window.jQuery) {
  alert('Sorry! Your browser is super outdated, and might have viruses. Please upgrade to Firefox, Chrome, or a newer version of IE - immediately.');
}

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

var photoCloud = {

  // array of submissions from api
  submissions: [],
  processing: false,
  processed: 0,
  limit: 500,
  page: 0,
  nodeCount: 0,
  thumbSize: 60,
  rows: 10,
  centerOffset: null,
  bubbleWidth: 250,
  bubblePopDelay: 300,
  bubblePopTimer: null,
  stopRandomBubble: false,
  bubbleRandomInterval: 5000,
  xhr: false,
  $el: $('#wall-scroller'),

  init: function() {
    this.centerOffset = this.$el.offset();
    $('section.wall').css('height', this.rows * this.thumbSize + 'px');

    this.load(function() {
      for (var i = 0; i < this.submissions.length; i++)
        this.newNode(this.submissions[i]);
      this.nodeCount = this.processed;
    }.bind(this));


    this.$el.on('click', 'a', function(e) {
      e.preventDefault();
      return false; // nobody gets a link
      if (this.submissions[e.target.id.substr(7)].link)
        window.open(this.sanitize(this.submissions[e.target.id.substr(7)].link));
    }.bind(this));

    this.$el.on('mouseover', 'a', function(e) {
      this.stopRandomBubble = true;
      this.showBubble(e.target.id.substr(7));
    }.bind(this));
    this.$el.on('mouseout', 'a', function(e) {
      this.stopRandomBubble = false;
      this.hideBubbles();
    }.bind(this));

    setInterval(this.showRandomBubble.bind(this), this.bubbleRandomInterval);
  },

  load: function(callback) {
    this.processing = true;

    if (this.xhr) {
      this.xhr.abort();
    }

    this.xhr = $.ajax({
      url: '//participants.battleforthenet.com/participants',
      data: 'limit='+this.limit+'&skip='+(this.page * this.limit),
      dataType: 'json',
      type: 'get',
      success: function(data) {
        this.page++;
        this.processing = false;
        this.submissions = this.submissions.concat(data);
        if (data.length == 0)
        {
          console.log('OMG EMPTY - starting over');
          this.processed = 0;
          this.page = 0;
        }
        callback();
      }.bind(this)
    })
  },

  loadMore: function(start) {
    start || (start = 0);

    this.stopRandomBubble = true;

    var doReplaceNodeAfterDelay = function(id, data) {
      setTimeout(function() {
        this.replaceNode(id, data);

        if (id >= this.nodeCount - 1)
          this.stopRandomBubble = false;

      }.bind(this), id*10);
    }.bind(this);

    for (var i = start; i < this.nodeCount; i++)
    {
      if (this.processed + i < this.submissions.length - 1)
      {
        doReplaceNodeAfterDelay(i, this.submissions[this.processed + i]);
      }
      else
      {
        console.log('STARVED - need to get more people: ', this.submissions.length);
        return this.load(function() {
          this.loadMore(i);
        }.bind(this));
      }
    }
  },

  newNode: function(data) {
    var maxRandomDelay = 5000;

    var randomDelay = function(id, data, offsets) {
      setTimeout(function() {
        this.loadImageAndDoCallback(this.sanitize(data.avatar.replace('http:', '')), data._id, function() {
          this.insertNodeElement(id, data, offsets);
        }.bind(this));
      }.bind(this), Math.floor(Math.random() * maxRandomDelay));
    }.bind(this);

    var offsets = this.getOffsetsByIndex(this.processed);

    if (offsets.OUT_OF_BOUNDS)
      return;

    randomDelay(this.processed, data, offsets);
    this.processed++;
  },

  replaceNode: function(id, data) {
    var offsets = this.getOffsetsByIndex(id);

    if (offsets.OUT_OF_BOUNDS)
      return;

    this.loadImageAndDoCallback(this.sanitize(data.avatar.replace('http:', '')), data._id, function() {
      $('#avatar_'+id).css('opacity', 0);
      $('#bubble_'+id).css('opacity', 0);
      $('#pointy_'+id).css('opacity', 0);
      setTimeout(function() {
        $('#avatar_'+id).remove();
        $('#bubble_'+id).remove();
        $('#pointy_'+id).remove();
        this.insertNodeElement(id, data, offsets);
      }.bind(this), 1000);
    }.bind(this));

    this.processed++;
  },

  loadImageAndDoCallback: function(src, id, callback) {
    var image = new Image();
    image.src = src;
    image.onload = callback;
    image.onerror = function() {
      if (src.indexOf('twimg.com') != -1)
        this.reportBrokenImage(id);
      callback()
    }.bind(this);
  },

  insertNodeElement: function(id, data, offsets) {
    var a = $('<a/>', {
      id: 'avatar_'+id,
      class: data.link ? /*'link'*/ '' : '',
      style: 'left:'+offsets.left+'px; \
              top:'+offsets.top+'px; \
              width:'+this.thumbSize+'px; \
              height:'+this.thumbSize+'px; \
              background-image: url('+this.sanitize(data.avatar.replace('http:', ''))+'); \
              background-size: '+this.thumbSize+'px auto;'
    });
    a.attr({
      href: '#',
      target: '_blank'
    });
    a.appendTo(this.$el);
    setTimeout(function() {
      a.css('opacity', 1);
    }, 10);

    var bOffsetX = offsets.left-(this.bubbleWidth/2)+(this.thumbSize/2);
    var bOffsetY = (offsets.top*-1)+this.thumbSize+14;

    if (bOffsetX + this.centerOffset.left < 10)
      bOffsetX = (this.centerOffset.left*-1)+10;
    else if (bOffsetX + this.bubbleWidth > this.centerOffset.left+(this.thumbSize/2))
      bOffsetX = this.centerOffset.left-this.bubbleWidth+(this.thumbSize/2)+8;

    var div = $('<div/>', {
      id: 'bubble_'+id,
      class: 'bubble',
      style: 'left:'+bOffsetX+'px; \
              bottom:'+bOffsetY+'px; \
              width:'+this.bubbleWidth+'px;'
    });
    div.html('<strong>'+this.sanitize(data.blurb)+'</strong><span '+(data.link ? /*'class="link"'*/'' : '')+'>'+this.sanitize(data.name)+'</span>');
    div.appendTo(this.$el);

    var aOffsetX = offsets.left+(this.thumbSize/2);
    var aOffsetY = offsets.top-26;

    if (aOffsetX + this.centerOffset.left < 33)
      aOffsetX = (this.centerOffset.left*-1)+33;
    else if (aOffsetX > this.centerOffset.left)
      aOffsetX = this.centerOffset.left+15;

    var arrow = $('<div/>', {
      id: 'pointy_'+id,
      class: 'arrow',
      style: 'left:'+aOffsetX+'px; \
              top:'+aOffsetY+'px;'
    });
    arrow.appendTo(this.$el);
  },

  showRandomBubble: function() {
    if (this.stopRandomBubble)
      return false;

    var links = this.$el.find('a');
    var random = Math.floor(Math.random() * links.length);
    this.showBubble(random);
  },

  hideBubbles: function() {
    if (this.bubblePopTimer)
      clearTimeout(this.bubblePopTimer);
    this.bubblePopTimer = null;
    this.$el.find('a').removeClass('hovered');
    $('div.arrow').css('opacity', 0);
    $('div.bubble').css('opacity', 0);
  },

  showBubble: function(id) {
    this.hideBubbles();
    this.bubblePopTimer = setTimeout(function() {
      $('#avatar_'+id).addClass('hovered');
      $('#bubble_'+id).css('opacity', 1);
      $('#pointy_'+id).css('opacity', 1);
    }, this.bubblePopDelay);
  },

  getOffsetsByIndex: function(index)
  {
    var leftMult, col, row;
    var size = this.thumbSize;
    if (index % 2 == 1)
    {
      leftMult = 1;
      row = (((index-1)/2)%this.rows);
      col = Math.floor(((index-1)/2)/this.rows)+1;
    }
    else
    {
      leftMult = -1;
      row = ((index/2)%this.rows);
      col = Math.floor((index/2)/this.rows)+1;
    }
    var info = {
      left: ((leftMult*col*size)-((size/2)*leftMult)),
      top: (row*size)
    };
    if (this.centerOffset.left + info.left + this.thumbSize < 0)
      info.OUT_OF_BOUNDS = true;

    return info;
  },

  sanitize: function(str)
  {
    // str = "TEST LOL javascript: <troll> FUCK javascript: shit babghah";
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/javascript\:/g, 'java script -');
    str = str.replace(/shit/ig, '$#!@');
    str = str.replace(/fuck/ig, '@!#&');
    return str;
  },

  reportBrokenImage: function(id)
  {
    /*
    $.ajax({
      url: "https://api.battleforthenet.com/participants/reportBrokenImage",
      // url: "http://debbie:3019/participants/reportBrokenImage", // JL TEST ~
      type: "post",
      dataType: "json",
      data: { id: id },
      success: function(res) {
        console.log('reported broken image: ', res);
      }
    });
    */
  }
};

var loaded_wall = false;

(function($) {

  // photoCloud.reportBrokenImage('53c43b6de4c4540200af5800'); // JL TEST ~

  $.ajax({
    url: '//fftf-geocoder.herokuapp.com/',
    dataType: 'json',
    type: 'get',
    success: function(data) {
      if (data.country && data.country.iso_code)
      {
        $('#country').val(data.country.iso_code);
        if (data.country.iso_code != "US")
          $('.form .note').html('Net neutrality matters. <strong>Everywhere.</strong>');
      }
    }
  });

  if ($('a.break').length) {
    $('a.break').click(function(e) {
      e.preventDefault();
      window.open($('a.break').attr('href'));
    });
    setTimeout(function() {
      $('a.break').css('opacity', 1);
    }, 2000);
  }

  if (window.location.href.indexOf('#PARTICIPANT') != -1)
    $('#participantModal').modal('show');

  // ShareProgress Facebook button override
  $('a.share.facebook').click(function(e) {
    e.preventDefault();
    $('#sp_fb a').click();
  });

  // ShareProgress Twitter button override
  $('a.share.twitter').click(function(e) {
    e.preventDefault();
    $('#sp_tw a').click();
  });

  // Wall Under
  $('.wall-under .columns .show_all a').click(function(e) {
    e.preventDefault();
    $('.wall-under .columns').removeClass('obscured');
    var biggest_height = 0;
    $('.wall-under .columns > div').each(function() {
      var height = $(this).innerHeight();
      if (height > biggest_height)
        biggest_height = height;
    });
    $('.wall-under .columns > div.listing').each(function() {
      $(this).css('height', biggest_height +'px');
    });
    $( ".wall-under .columns" ).animate({ height: biggest_height+'px'}, 1000, function() {
      // Animation complete.
    });
  });

  // Questions and Answers
  $('.faqs .columns .show_all a').click(function(e) {
    console.log('clicked'+ this);
    $('.faqs .columns').removeClass('obscured');
    var biggest_height = 0;
    $('.faqs .columns > div').each(function() {
      var height = $(this).innerHeight();
      if (height > biggest_height)
        biggest_height = height;
    });
    $('.faqs .columns > div.listing').each(function() {
      $(this).css('height', biggest_height +'px');
    });
    $( ".faqs .columns" ).animate({ height: biggest_height+'px'}, 1000, function() {
      // Animation complete.
    });
  });

  // Questions and Answers
  $('.questions-answers .columns .show_all a').click(function(e) {
    console.log('clicked'+ this);
    $('.questions-answers .columns').removeClass('obscured');
    var biggest_height = 0;
    $('.questions-answers .columns > div').each(function() {
      var height = $(this).innerHeight();
      if (height > biggest_height)
        biggest_height = height;
    });
    $('.questions-answers .columns > div.listing').each(function() {
      $(this).css('height', biggest_height +'px');
    });
    $( ".questions-answers .columns" ).animate({ height: biggest_height+'px'}, 1000, function() {
      // Animation complete.
    });
  });
  
  // Myths Debunked
  $('.myths .columns .show_all a').click(function(e) {
    console.log('clicked'+ this);
    $('.myths .columns').removeClass('obscured');
    var biggest_height = 0;
    $('.myths .columns > div').each(function() {
      var height = $(this).innerHeight();
      if (height > biggest_height)
        biggest_height = height;
    });
    $('.myths .columns > div.listing').each(function() {
      $(this).css('height', biggest_height +'px');
    });
    $( ".myths .columns" ).animate({ height: biggest_height+'px'}, 1000, function() {
      // Animation complete.
    });
  });
  
  // Letter Debunked
  $('.letter-under .columns .show_all a').click(function(e) {
    console.log('clicked'+ this);
    $('.letter-under .columns').removeClass('obscured');
    var biggest_height = 0;
    $('.letter-under .columns > div').each(function() {
      var height = $(this).innerHeight();
      if (height > biggest_height)
        biggest_height = height;
    });
    $('.letter-under .columns > div.listing').each(function() {
      $(this).css('height', biggest_height +'px');
    });
    $( ".letter-under .columns" ).animate({ height: biggest_height+'px'}, 1000, function() {
      // Animation complete.
    });
  });
  

  var formFields = [
    "action_comment",
    "address1",
    "email",
    "name",
    "zip"
  ];

  // Prevent tabbing to textarea.
  $('form textarea').on('focus', function(e) {
    $(this).blur();
  });

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

  $(window)
    .on('hashchange', function() {
      var $navigation = $('#navigation a');
      $navigation.removeClass('selected');
      var hash = location.hash || '#home';
      var $selected = $navigation.filter('[href=' + hash + ']');
      if ($selected.length === 0) {
        $selected = $navigation.first();
      }
      $selected.addClass('selected');
    })
    .trigger('hashchange');

  // MODAL //
  // Save comment.
  $('#editModal .modal-footer button').on('click', function(e) {
    e.preventDefault();

    var comment = $('#editModal textarea').val();
    $('#what-to-do form textarea').val(comment);

    $('#editModal').modal('hide');
  });

  function postUser($form) {
    var ok = true;
    var doc = {};
    formFields.forEach(function(field) {
      if ($("input[name=" + field + "]", $form)[0] && $("input[name=" + field + "]", $form).val() === "") {
        ok = false;
      } else {
        doc[field] = $("input[name=" + field + "]", $form).val();
      }
    });

    doc['action_comment'] = $("[name=action_comment]").val();
    doc['country'] = $('#country').val();
    doc['org'] = window.org;

    if (ok) {
      $.ajax({
        url: "//queue.battleforthenet.com/submit",
        // url: "http://debbie:3019/submit",    // JL TEST ~
        type: "post",
        dataType: "json",
        data: doc,
        success: function(res) {
          userID = res.userID;
        }
      });
    }
    return ok;
  }

  $("form[name=petition]").submit(function(e) {
    e.preventDefault();
    if (postUser($(this))) {
      window.cachedData = $('#what-to-do form').serialize();
      $("input:not([type=image],[type=button],[type=submit])").val('');
      if (!$('body').hasClass('embed'))
        $('#participantModal').modal('show');
      else
        $('#thanksModal').modal('show');
    } else {
      alert('Please complete the rest of the form. Thanks!');
    }
  });

  window.authSuccess = function() {
    var newData = $('#participant_form').serialize();
    var combinedData = window.cachedData + '&' + newData;
    $.ajax({
      url: '//api.battleforthenet.com/participant/create',
      type: 'post',
      xhrFields: {
        withCredentials: true
      },
      data: combinedData,
      success: function(res) {
        $('#participantModal').modal('hide');
        $('#thanksModal').modal('show');
      }
    })
  };

  window.authFailure = function() {
    // ...
  };

  $('#participantModal .modal-footer').on('click', function(e) {
    var disabled = $(this).find('a').attr('disabled');
    if (disabled) {
      e.preventDefault();
      $('#participant_link').focus();
      $('#participant_link').select();
    }
  });

  // Send 20% of forms to FP page.
  window.org = '';
  if (Math.random() < 0.20) {
    $('.call-to-action').addClass('fp');
    window.org = 'fp';
  }

  // Support IE9+
  function getInternetExplorerVersion()
  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  }
  if (navigator.userAgent.match('MSIE')) {
    // Fading modals aren't supported.
    $('.modal.fade').removeClass('fade');

    var version = getInternetExplorerVersion();
    if (version < 10) {
      $('body').addClass('oldie');
      $('input, textarea').placeholder();
    }
  }

  if ($('.listing').length) {
    $.ajax({
      url: '//participants.battleforthenet.com/participants/listed',
      dataType: 'json',
      type: 'get',
      success: function(data) {
        for (var i=data.length-1; i>=0; i--)
        {
          if (!data[i].listing)
            continue;

          var li = $('<li/>', {
            id: 'listing_'+data[i]._id
          });
          var html = '<span>' + photoCloud.sanitize(data[i].name) + '</span>';

          if (data[i].link)
            html = '<a href="'+photoCloud.sanitize(data[i].link)+'" target="_blank">' + photoCloud.sanitize(data[i].name) + '</a>';

          li.html(html);
          li.appendTo($('.listing.'+data[i].listing+ ' ul'));
        }
      }
    });
  }

  // Starting the count animation
  setTimeout(function() {
    if (!window.countUp) {
      return;
    }

    var baseline = 4400000;
    var calls = 80603;
    var comments = 451387;
    var numAnim = new countUp("animated-count", baseline, baseline + calls + comments, 0, 5.87);
    numAnim.start();
  }, 2500);

})(jQuery);
