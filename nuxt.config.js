const path = require('path')
const settings = require(path.resolve(__dirname, 'config.json'))

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "Join the Battle for Net Neutrality",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:400,700|Open+Sans:400,700'
      }
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
    { src: '~/plugins/raven.js', ssr: false }
  ]
}
