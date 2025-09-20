<template>
  <div class="space-y-6 p-6">
    <CmsKpiAll v-if="isSuperadmin" />
    <CmsKpiSelf v-else />
  </div>
</template>

<script setup lang="ts">
const isSuperadmin = useSuperadmin();
</script>
