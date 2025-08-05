// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint"
  ],
  css: ["~/assets/css/main.css"],
  ui: {
    colorMode: false,
  },
  compatibilityDate: "2025-07-16"
});
