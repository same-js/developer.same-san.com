import colors from 'vuetify/es5/util/colors'

const siteName = '技術ブログ'
const siteURL = 'http://localhost:3000'
const contentMaxWidth = '800'

export default {
  // 動的な設定をグローバルに参照できるようにする
  publicRuntimeConfig: {
    sitename: siteName,
    siteurl: siteURL,
    contentmaxwidth: contentMaxWidth
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | ' + siteName,
    title: siteName,
    htmlAttrs: {
      lang: 'jp'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'alternate', type: 'application/rss+xml', href: siteURL + '/feed', title: 'RSS2.0' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/style.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxt/content',
    '@nuxtjs/feed'
  ],

  // nuxt/content をカスタマイズする
  content: {
    // Options
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css' // コードブロックのテーマを指定
      }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.lighten1, // aタグの色はここを参照する
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          chip: colors.grey.darken3,
          accent_chip: colors.blue.darken3
        }
      },
      // css で カラーパレット を利用可能にする
      options: {
        customProperties: true
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  generate: {
  },
  feed () {
    const baseUrlArticles = siteURL
    const baseLinkFeedArticles = 'feed/articles'
    const feedFormats = {
      rss: { type: 'rss2', file: 'feed/' }
      // rss: { type: 'rss2', file: 'rss.xml' }
      // atom: { type: 'atom1', file: 'atom.xml' }
      // json: { type: 'json1', file: 'feed.json' }
    }
    const { $content } = require('@nuxt/content')

    const createFeedArticles = async function (feed) {
      feed.options = {
        title: siteName,
        description: 'I write about technology.',
        link: baseUrlArticles,
        category: ['Vue']
      }
      const articles = await $content('articles', { text: true }).fetch()

      articles.forEach((article) => {
        const url = `${baseUrlArticles}/${article.slug}`

        feed.addItem({
          title: article.title,
          id: url,
          link: url,
          date: new Date(article.createdAt), // article.published,
          description:
            (
              article.hashtag
                ? '【' + Object.values(article.hashtag).join(',') + '】'
                : ''
            )
            + article.text.replace(/\r?\n/g, ' ').slice(0, 100),
          content: article.text.replace(/\r?\n/g, ' ').slice(0, 100),
          author: 'test@example.com',
          guid: article.slug
        })
      })
    }

    return Object.values(feedFormats).map(({ file, type }) => ({
      path: `${file}`,
      type,
      create: createFeedArticles
    }))
  }
}
