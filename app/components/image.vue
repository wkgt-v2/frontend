<template>
  <ClientOnly>
    <div class="relative w-fit">
      <img
        :src="src"
        :alt="alt"
        :class="`${width} ${height} ${mode === 'contain' ? 'object-contain' : 'object-cover'} ${onLoad ? 'opacity-0' : ''} ${imageClasses}`"
        loading="lazy"
        v-on:load="onLoad = false"
        v-on:error="isError = true"
      />
      <UIcon
        v-if="onLoad && !isError"
        name="i-material-symbols:imagesmode"
        class="absolute top-1/2 left-1/2 -translate-1/2 size-full animate-pulse z-10"
      />
      <UIcon
        v-if="isError"
        name="i-material-symbols:broken-image"
        class="absolute top-1/2 left-1/2 -translate-1/2 size-full z-10"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  mode?: "contain" | "cover";
  imageClasses?: string;
}>(), {
  alt: "",
  width: "w-full",
  height: "h-auto",
  mode: "contain",
  imageClasses: "",
});

const onLoad = ref(true);
const isError = ref(false);
</script>
