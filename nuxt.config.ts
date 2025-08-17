// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],
  i18n: {
    defaultLocale: "id",
    locales: [
      { code: "id", name: "ID", file: "id.ts", language: "id-ID" },
      { code: "en", name: "EN", file: "en.ts", language: "en-US" },
    ],
  },
  compatibilityDate: "2025-07-16",
});
