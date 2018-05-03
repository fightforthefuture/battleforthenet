const path = require('path')
const settings = require(path.resolve(__dirname, 'config.json'))

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "Battle for the Net",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    'normalize.css/normalize.css',
    '~/assets/css/main.scss'
  ],
  modules: [
    'nuxt-sass-resources-loader'
  ],
  sassResources: [
    '~/assets/css/_variables.scss'
  ],
  // render: {
  //   bundleRenderer: {
  //     shouldPreload: (file, type) => {
  //       return ['script', 'style', 'font'].includes(type)
  //     }
  //   }
  // },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      config.module.rules.push({
        test: /\.(yaml|yml)$/,
        // include: path.resolve('data'),
        loader: 'json-loader!yaml-loader',
      })
    },

    vendor: [
      'axios',
      'babel-polyfill'
    ],

    babel: {
      presets: [
        ['vue-app', {
            useBuiltIns: true,
            targets: { ie: 9, uglify: true }
          }
        ]
      ]
    },
  },

  plugins: [
    '~/plugins/filters.js',
    '~/plugins/components.js',
    { src: '~/plugins/analytics.js', ssr: false },
    '~/plugins/org-rotation.js',
    { src: '~/plugins/raven.js', ssr: false },
    '~/plugins/i18n.js',
    { src: '~/plugins/hash-link-fix.js', ssr: false }
  ]
}
