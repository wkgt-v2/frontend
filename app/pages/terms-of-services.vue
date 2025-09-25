<template>
  <LocaleIdTermsOfServices v-if="locale === 'id'" />
  <LocaleEnTermsOfServices v-else />
</template>

<script setup lang="ts">
const { locale } = useI18n();
</script>
