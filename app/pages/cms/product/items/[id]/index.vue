<template>
  <div v-if="item" class="space-y-6 p-6">
    <div class="grid grid-cols-5 gap-6">
      <ImageGallery :urls="sortedImages.map(i => i.image_url)" class="col-span-2">
        <template #action="{ url }">
          <div class="absolute top-1 right-1 flex flex-col gap-1">
            <UTooltip text="Set as main image">
              <UButton
                size="xs"
                icon="i-material-symbols:photo-filter"
                class="rounded-full"
                @click="setMainImage(url)"
              />
            </UTooltip>
            <UTooltip v-if="images.length > 1" text="Delete image">
              <UButton
                size="xs"
                icon="i-material-symbols:delete-outline"
                color="error"
                class="rounded-full"
                @click="deleteImage(url)"
              />
            </UTooltip>
          </div>
        </template>
      </ImageGallery>
      <div class="col-span-3 space-y-8">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-16">
            <h2 class="text-2xl text-tone font-semibold">
              {{ item.product_name }}
            </h2>
            <UButton
              :to="$localeRoute(`/cms/product/items/${item.product_id}/edit`)"
              icon="i-material-symbols:visibility-outline"
              class="whitespace-nowrap"
            >
              Edit item
            </UButton>
          </div>
          <div class="flex gap-2">
            <UBadge v-if="item.category?.category_name" size="lg" variant="outline">
              {{ item.category.category_name }}
            </UBadge>
            <UBadge v-if="item.series?.series_name" size="lg" variant="outline">
              {{ item.series.series_name }}
            </UBadge>
          </div>
        </div>
        <p class="text-tone">
          {{ item.product_description }}
        </p>
        <UTabs :items="tabItems" variant="link" :ui="{ trigger: 'grow' }" class="w-full">
          <template #specification>
            <table class="table table-fixed w-full">
              <tbody>
                <tr
                  v-for="specification in item.specifications"
                  :key="specification.spec_id"
                  class="*:p-4 border-b border-accent hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <td class="font-semibold align-middle">
                    {{ specification.spec_type }}
                  </td>
                  <td class="whitespace-pre-line">
                    {{ specification.spec_value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #detail>
            <div class="whitespace-pre-line" v-html="item.product_detail"></div>
          </template>
          <template #information>
            <div class="whitespace-pre-line" v-html="item.product_info"></div>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
  <div v-else class="py-16">
    <h4 class="text-xl text-tone text-center font-semibold">
      Data not found
    </h4>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { TabsItem } from "@nuxt/ui";
import type { HttpError, HttpSuccess } from "~/types/http";
import type { Image, Item } from "~/types/product";

const tabItems = [
  {
    label: "Specification",
    slot: "specification" as const,
  },
  {
    label: "Detail",
    slot: "detail" as const,
  },
  {
    label: "Important Information",
    slot: "information" as const,
  },
] satisfies TabsItem[];

const { bearer } = useToken();
const config = useRuntimeConfig();
const route = useRoute();
const toast = useToast();

const { data: item } = await useFetch(
  `${config.public.apiBase}/products/${route.params.id}`,
  {
    transform: (value: HttpSuccess<Item>) => {
      return value.data;
    },
  }
);

const images = ref<Image[]>([]);

const sortedImages = computed(() => {
  return images.value.sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0)) || [];
});

watch(() => item.value, (val) => {
  if (val) {
    images.value = val.images;
  }
}, { immediate: true });

async function deleteImage(url: string) {
  const index = images.value.findIndex(i => i.image_url === url) || -1;
  const image = images.value[index];
  if (image) {
    try {
      await $fetch(`${config.public.apiBase}/products/images/${image.product_image_id}`, {
        headers: { ...bearer },
        method: "DELETE",
      });

      images.value.splice(index, 1);
      toast.add({
        title: "Image deleted successfully!",
        color: "success",
        icon: "i-heroicons-check-circle",
      });
    } catch (error) {
      console.log(error)
      const e = error as FetchError<HttpError>;
      toast.add({
        title: "Failed to delete image!",
        description: e.data?.message,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
        duration: 0,
      });
    }
  }
}

async function setMainImage(url: string) {
  const index = images.value.findIndex(i => i.image_url === url) || -1;
  const image = images.value[index];
  if (image) {
    try {
      await $fetch(`${config.public.apiBase}/products/images/${image.product_image_id}/set-main`, {
        headers: { ...bearer },
        method: "PUT",
      });

      images.value = images.value.map(i => {
        i.is_main = i.image_url === url;
        return i;
      });
      toast.add({
        title: "Successfully set image as main!",
        color: "success",
        icon: "i-heroicons-check-circle",
      });
    } catch (error) {
      console.log(error)
      const e = error as FetchError<HttpError>;
      toast.add({
        title: "Failed to set image as main!",
        description: e.data?.message,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
        duration: 0,
      });
    }
  }
}
</script>
