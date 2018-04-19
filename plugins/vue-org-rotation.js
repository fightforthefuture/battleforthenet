const MyPlugin = {
  install(Vue, options) {
    Vue.prototype.$currentOrg = function(options) {
      const orgs = ['dp', 'fftf', 'fp']
      
      if (orgs.includes(this.$router.currentRoute.query.org)) {
        return this.$router.currentRoute.query.org
      }

      return orgs[Math.floor(Math.random()*orgs.length)]
    }
  }
}

export default MyPlugin