<template>
  <div class="space-y-4 w-full">
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="urls"
      :prev="{ onClick: onClickPrev }"
      :next="{ onClick: onClickNext }"
      class="w-full mx-auto"
      @select="onSelect"
    >
      <Image
        :src="item"
        image-classes="aspect-square rounded-2xl"
      />
    </UCarousel>

    <div class="overflow-x-auto">
      <div class="flex gap-4">
        <div
          v-for="(url, index) in urls"
          :key="index"
          class="relative shrink-0 size-24 opacity-25 hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': activeIndex === index }"
          @click="select(index)"
        >
          <Image
            :src="url"
            width="w-24"
            height="h-24"
            image-classes="rounded-lg"
            mode="cover"
          />
          <slot name="action" :url="url" :index="index"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  urls: string[];
}>();

const carousel = useTemplateRef("carousel");
const activeIndex = ref(0);

function onClickPrev() {
  activeIndex.value--;
}
function onClickNext() {
  activeIndex.value++;
}
function onSelect(index: number) {
  activeIndex.value = index;
}

function select(index: number) {
  activeIndex.value = index;
  carousel.value?.emblaApi?.scrollTo(index);
}
</script>
