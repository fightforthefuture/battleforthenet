//
// This is a hacky fix for #hash links not working on page load.
// I think the root cause is a misconfiguration with vue-router.
// Until we have time to dig into that, this should work...
//
export default ({ app }) => {
  app.router.afterEach((to, from) => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) {
        el.scrollIntoView()
      }
    }
  })
}
