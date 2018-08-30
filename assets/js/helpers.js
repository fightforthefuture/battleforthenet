export function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
  }
  else {
    return null;
  }
}

export function openPopup(url, title='popup', w=600, h=500) {
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

export function createMetaTags(tags={}) {
  const meta = {}

  tags = Object.assign({
    'author': 'Fight for the Future',
    'og:description': tags.description,
    'og:image': tags.image,
    'og:site_name': 'Battle for the Net',
    'og:title': tags.title,
    'og:type': 'website',
    'og:url': tags.url,
    'twitter:card': 'summary_large_image',
    'twitter:description': tags.description,
    'twitter:image': tags.image,
    'twitter:site': '@FightForTheFtr',
    'twitter:title': tags.title,
    'twitter:url': tags.url
  }, tags)

  const fakeTagNames = ['title', 'image', 'url']

  for (let key of Object.keys(tags)) {
    if (key.match(/^og\:/)) {
      meta[key] = {
        hid: key,
        property: key,
        content: tags[key]
      }
    }
    else if (!fakeTagNames.includes(key)) {
      meta[key] = {
        hid: key,
        name: key,
        content: tags[key]
      }
    }
  }

  return Object.values(meta)
}

export function postFormData(url, data={}) {
  const axios = require('axios')
  const qs = require('qs')

  return axios.post(url, qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function sendToMothership(data={}, submission={}) {
  return postFormData('https://queue.fightforthefuture.org/action', data)
}

export function getDonateLink(org) {
  switch (org) {
    case 'fp':
      return "https://freepress.actionkit.com/donate/single/"
    case "dp":
      return "https://secure.actblue.com/donate/nndayofaction?refcode=20170712-bftn"
    case "fftf":
    default:
      return "https://donate.fightforthefuture.org"
  }
}

export async function geocodeState() {
  const axios = require('axios')

  const state = {
    name: null,
    code: null
  }

  try {
    const response = await axios.get('https://fftf-geocoder.herokuapp.com')
    const geo = response.data

    if (
      geo.country.iso_code === 'US' &&
      geo.subdivisions &&
      geo.subdivisions[0] &&
      geo.subdivisions[0].names &&
      geo.subdivisions[0].names.en
    ) {
      state.name = geo.subdivisions[0].names.en
      state.code = geo.subdivisions[0].iso_code
    }
  }
  catch (err) {
    console.error(err)
  }

  return state
}

/**
 * Smooth scroll animation
 * @param {int} endX: destination x coordinate
 * @param {int) endY: destination y coordinate
 * @param {int} duration: animation duration in ms
 */
export function smoothScrollTo(endX, endY, duration) {
  var startX = window.scrollX || window.pageXOffset,
    startY = window.scrollY || window.pageYOffset,
    distanceX = endX - startX,
    distanceY = endY - startY,
    startTime = new Date().getTime();

  duration = typeof duration !== 'undefined' ? duration : 400;

  // Easing function
  var easeInOutQuart = function(time, from, distance, duration) {
    if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
    return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
  };

  var timer = window.setInterval(function() {
    var time = new Date().getTime() - startTime,
      newX = easeInOutQuart(time, startX, distanceX, duration),
      newY = easeInOutQuart(time, startY, distanceY, duration);
    if (time >= duration) {
      window.clearInterval(timer);
    }
    window.scrollTo(newX, newY);
  }, 1000 / 60); // 60 fps
};

export function smoothScrollWithinElement(el, endY, duration) {
  var el = el,
      startY = el.scrollTop,
      change = endY - startY,
      currentTime = 0,
      increment = 20,
      duration = typeof duration !== 'undefined' ? duration : 400,

  easeInOutQuad = function (time, start, change, duration) {
    time /= duration/2;
    if (time < 1) return change/2*time*time + start;
    time--;
    return -change/2 * (time*(time-2) - 1) + start;
  },

  smoothStepScroll = function() {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, startY, change, duration);
    el.scrollTop = val;
    if(currentTime < duration) {
      setTimeout(smoothStepScroll, increment);
    }
  };
  smoothStepScroll();
};

export function smoothScrollToElement(el, duration) {
  duration = typeof duration !== 'undefined' ? duration : 500;
  el = typeof el === 'string' ? document.querySelector(el) : el;

  if (el) {
    smoothScrollTo(el.offsetLeft, el.offsetTop, duration)
  }
}

export async function startTextFlow({ flow, phone }) {
  const axios = require('axios')

  try {
    const { data } = await axios.post('https://utdy3yxx7l.execute-api.us-east-1.amazonaws.com/v1/flow-starts', {
      flow: flow,
      phone: phone
    })

    return data
  }
  catch (error) {
    return {}
  }
}

export async function pingCounter(counter) {
  const axios = require('axios')

  try {
    await axios.post(`https://counter.battleforthenet.com/ping/${counter}`)
  }
  catch (error) {
    //
  }
}

export function formatNumber(x) {
  return x || x === 0 ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
}

export async function fetchRepScoreboard(address) {
  const axios = require('axios')

  try {
    const { data } = await axios.get(`https://07myr1bkfa.execute-api.us-east-1.amazonaws.com/v1/rep-scoreboard?address=${encodeURIComponent(address)}`)
    return data
  }
  catch (error) {
    return null
  }
}
