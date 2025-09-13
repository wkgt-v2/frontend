<template>
  <div v-if="item" class="space-y-6 p-6">
    <div class="grid lg:grid-cols-2 gap-16 lg:gap-6">
      <ImageGallery :urls="sortedImages.map(i => i.image_url)">
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
      <div class="space-y-8">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-16">
            <h2 class="text-2xl text-tone font-semibold">
              {{ item.product_name }}
            </h2>
            <div class="flex gap-2">
              <UButton
                v-if="images.length < 10"
                icon="i-material-symbols:add-photo-alternate-outline"
                class="whitespace-nowrap"
                @click="openAddImagesModal"
              >
                Add images
              </UButton>
              <UButton
                :to="$localeRoute(`/cms/product/items/${item.product_id}/edit`)"
                icon="i-material-symbols:visibility-outline"
                class="whitespace-nowrap"
              >
                Edit item
              </UButton>
            </div>
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
        <p class="tiptap ProseMirror" v-html="item.product_description"></p>
        <div v-if="item.product_detail" class="space-y-2">
          <h5 class="mb-2 text-lg text-primary font-semibold">
            Detail
          </h5>
          <div class="tiptap ProseMirror" v-html="item.product_detail"></div>
        </div>
        <div v-if="item.product_info" class="space-y-2">
          <h5 class="mb-2 text-lg text-primary font-semibold">
            Important Information
          </h5>
          <div class="tiptap ProseMirror" v-html="item.product_info"></div>
        </div>
      </div>
    </div>
    <div class="col-span-2">
      <h5 class="mb-2 text-lg text-primary font-semibold">
        Specifications
      </h5>
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
            <td class="tiptap ProseMirror" v-html="specification.spec_value"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="py-16">
    <h4 class="text-xl text-tone text-center font-semibold">
      Data not found
    </h4>
  </div>

  <UModal
    title="Add Images"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="addImages">
        <UFormField label="Image" name="product_images">
          <UFileUpload
            accept=".jpg,.jpeg,.png,.webp"
            description="JPG, JPEG, PNG, WebP"
            v-model="state.product_images"
            layout="list"
            multiple
            @change="handleFileChanged"
          />
        </UFormField>

        <div class="flex justify-end gap-4">
          <UButton
            variant="outline"
            :class="{ 'pointer-events-none': modal.onSubmit }"
            :disabled="modal.onSubmit"
            @click="modal.open = false"
          >
            Cancel
          </UButton>
          <UButton type="submit" :loading="modal.onSubmit">
            Add
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TabsItem } from "@nuxt/ui";
import type { HttpError, HttpSuccess } from "~/types/http";
import type { Image, Item } from "~/types/product";

const schema = v.object({
  product_images: v.pipe(
    v.array(v.file()),
    v.filterItems((item) => ALLOWED_FILE_TYPES.includes(item.type)),
    v.minLength(1, "Select at least one image."),
  ),
});
type Schema = v.InferOutput<typeof schema>;

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
const modal = reactive({
  onSubmit: false,
  open: false,
});
const route = useRoute();
const state = reactive({
  product_images: [] as File[],
});
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

async function addImages(e: FormSubmitEvent<Schema>) {
  if (modal.onSubmit) return;

  modal.onSubmit = true;
  try {
    const body = new FormData();
    state.product_images.forEach(file => {
      body.append("product_images", file);
    });

    const res = await $fetch<HttpSuccess<Item>>(`${config.public.apiBase}/products/${route.params.id}/images`, {
      headers: { ...bearer },
      method: "POST",
      body
    });

    images.value = res.data.images;
    modal.open = false;
    toast.add({
      title: `Product images added successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to add product images!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

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

function handleFileChanged() {
  state.product_images = state.product_images.filter(f => ALLOWED_FILE_TYPES.includes(f.type));
}

function openAddImagesModal() {
  state.product_images = [];
  modal.open = true;
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
