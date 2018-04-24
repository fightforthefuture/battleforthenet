import Vue from 'vue'

var formatNumber = function(x) {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
};

var pluralize = function(number, singular, plural=null){
  if (parseFloat(number) === 1.0) {
    return number + ' ' + singular;
  }
  else {
    if (!plural) {
      plural = singular + 's';
    }

    return formatNumber(number) + ' ' + plural;
  }
};

Vue.filter('formatNumber', formatNumber);
Vue.filter('pluralize', pluralize);