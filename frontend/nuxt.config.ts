// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  shadcn: {
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  googleFonts: {
    families: {
      'Inter': [400,700]
    },
    display: 'swap',
  },

  modules: [
    'shadcn-nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxt-svgo',
  ],
})