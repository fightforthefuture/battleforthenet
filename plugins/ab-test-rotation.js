// Get 'A' or 'B'
function getVariant() {
  const coinToss = Math.random()
  if (coinToss <= 0.5) {
    return 'a'
  } else {
    return 'b'
  }
}

// Set A/B test variant on route change
export default ({ app }) => {
  app.router.afterEach((to, from) => {
    const q = to.query.variant
    const query = q === 'a' || q === 'b' ? q : null
    const testVariant = query || getVariant()
    app.store.commit('setTestVariant', testVariant)
  })
}
