// Polyfill URLSearchParams
function URLSearchParams(queryString) {
  this.queryObj = queryString.split('&').reduce(function(obj, val) {
    var parts = val.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    return obj;
  }, {});
}

URLSearchParams.prototype.has = function has(key) {
  return this.queryObj.hasOwnProperty(key);
}

URLSearchParams.prototype.get = function get(key) {
  return this.queryObj[key];
}

window.URLSearchParams = window.URLSearchParams || URLSearchParams;

// Polyfill matches selector
Element.prototype.matches = Element.prototype.matches ||
  Element.prototype.matchesSelector || 
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector || 
  Element.prototype.oMatchesSelector || 
  Element.prototype.webkitMatchesSelector ||
  function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
      i = matches.length;
    while (--i >= 0 && matches.item(i) !== this) {}
    return i > -1;            
  };
