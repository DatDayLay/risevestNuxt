// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image'
  ],
  fonts: {
    families: [
      
      { name: 'Karla', provider: 'google', weights: ['400', '700'] }, 
      { name: 'Raleway', provider: 'google', weights: ['400', '700', '800'] },
      { name: 'Jost', provider: 'google', weights: ['300', '400', '500', '700'] },
      
    ]
  }
})