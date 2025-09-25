<template>
  <LocaleIdPrivacyPolicy v-if="locale === 'id'" />
  <LocaleEnPrivacyPolicy v-else />
</template>

<script setup lang="ts">
const { locale } = useI18n();
</script>
