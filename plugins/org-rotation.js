// fp = 20%, dp = 40%, fftf = 40%
function getRandomOrg() {
  var coinToss = Math.random();
  if (coinToss < .20) {
    return 'fp';
  }
  else if (coinToss < .60) {
    return 'dp';
  }
  else {
    return 'fftf';
  }
}

// set org on route change
export default ({ app }) => {
  app.router.afterEach((to, from) => {
    const org = to.query.org || to.query.source || getRandomOrg()
    app.store.commit('setOrg', org)
  })
}
