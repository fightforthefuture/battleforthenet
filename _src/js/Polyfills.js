function URLSearchParams(queryString) {
  this.queryObj = queryString.split('&').reduce(function(obj, val) {
    var parts = val.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    return obj;
  }, {});
}

URLSearchParams.prototype.get = function get(key) {
  return this.queryObj[key];
}

window.URLSearchParams = window.URLSearchParams || URLSearchParams;
