export default defineNuxtPlugin((nuxtApp) => {
  // Add dark class to HTML element on server-side
  if (process.server) {
    nuxtApp.vueApp.provide('forceDark', true)
  }
})
