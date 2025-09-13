<template>
  <div class="p-6">
    <div class="space-y-6 glass p-6 border border-accent rounded-xl">
      <h4 class="text-xl text-tone font-semibold">
        Create New Product Item
      </h4>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="handleSubmit"
        @error="(e: { errors: FormError[] }) => formErrors = e.errors"
      >
        <UFormField label="Images" name="product_images">
          <UFileUpload
            v-model="state.product_images"
            accept=".jpg,.jpeg,.png,.webp"
            description="JPG, JPEG, PNG, WebP"
            layout="list"
            multiple
            @change="handleFileChanged"
          />
        </UFormField>
        <div class="grid grid-cols-2 gap-6">
          <UFormField label="Name" name="product_name">
            <UInput v-model="state.product_name" />
          </UFormField>
          <UFormField label="Code" name="product_code">
            <UInput v-model="state.product_code" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <UFormField label="Category" name="category_id">
            <USelectMenu
              v-model="state.category_id"
              :items="categories"
              value-key="value"
              :loading="onLoadCategories === 'pending'"
            />
          </UFormField>
          <UFormField label="Series" name="series_id">
            <USelectMenu
              v-model="state.series_id"
              :items="series"
              value-key="value"
              :placeholder="`${!state.category_id ? 'Please choose product category first' : ''}`"
              :disabled="!state.category_id"
              :loading="onLoadSeries === 'pending'"
            />
          </UFormField>
        </div>

        <UFormField label="Description" name="product_description">
          <TiptapEditor
            v-model="state.product_description"
            :is-error="!!formErrors?.find(e => e.name === 'product_description')"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-6">
          <UFormField label="Detail" name="product_detail">
            <TiptapEditor
              v-model="state.product_detail"
              :is-error="!!formErrors?.find(e => e.name === 'product_detail')"
            />
          </UFormField>
          <UFormField label="Info" name="product_info">
            <TiptapEditor
              v-model="state.product_info"
              :is-error="!!formErrors?.find(e => e.name === 'product_info')"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <UFormField label="Tokopedia URL" name="marketplace_tokopedia">
            <UInput v-model="state.marketplace_tokopedia" />
          </UFormField>
          <UFormField label="Shopee URL" name="marketplace_shopee">
            <UInput v-model="state.marketplace_shopee" />
          </UFormField>
        </div>

        <div class="space-y-1">
          <div class="text-sm text-tone font-medium">Specifications</div>
          <div class="space-y-2">
            <div
              v-for="(specification, index) in state.specifications"
              :key="index"
              class="grid grid-cols-4 items-start gap-2"
            >
              <UInput v-model="specification.key" placeholder="Specification Name" />
              <div class="flex items-start gap-2 col-span-3">
                <div :class="state.specifications.length > 1 ? 'w-[calc(100%-40px)]' : 'w-full'">
                  <TiptapEditor
                    v-model="specification.value"
                    placeholder="Specification Detail"
                    :is-error="!!formErrors?.find(e => e.name === 'product_description')"
                  />
                </div>
                <UButton
                  v-if="state.specifications.length > 1"
                  variant="outline"
                  color="error"
                  icon="i-material-symbols:delete-outline"
                  @click="removeSpecification(index)"
                />
              </div>
            </div>
          </div>
          <UButton
            variant="outline"
            icon="i-material-symbols:add"
            @click="addSpecification"
          >
            Add Specification
          </UButton>
        </div>

        <div class="flex justify-end gap-4">
          <UButton
            variant="outline"
            :class="{ 'pointer-events-none': onSubmit }"
            :disabled="onSubmit"
            :to="$localePath('cms-product-items')"
          >
            Cancel
          </UButton>
          <UButton type="submit" :loading="onSubmit">
            Create
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import type { HttpError, HttpSuccess, HttpSuccessWithPagination } from "~/types/http";
import type { Category, Item, Series } from "~/types/product";

const schema = v.object({
  product_images: v.pipe(
    v.array(v.file()),
    v.filterItems((item) => ALLOWED_FILE_TYPES.includes(item.type)),
    v.minLength(1, "Select at least one image."),
  ),
  product_name: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  product_code: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  product_description: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  product_detail: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  product_info: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  category_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  series_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  // specifications: [{ key: "", value: "" }],
  marketplace_tokopedia: v.pipe(v.string(), v.url("Please enter a valid URL.")),
  marketplace_shopee: v.pipe(v.string(), v.url("Please enter a valid URL.")),
});
type Schema = v.InferOutput<typeof schema>;

const { bearer } = useToken();
const config = useRuntimeConfig();
const formErrors = ref<FormError[]>();
const localeRoute = useLocaleRoute();
const onSubmit = ref(false);
const state = reactive({
  product_name: "",
  product_code: "",
  product_description: "",
  product_detail: "",
  product_info: "",
  product_images: [] as File[],
  category_id: undefined as undefined | number,
  series_id: undefined as undefined | number,
  specifications: [{ key: "", value: "" }],
  marketplace_tokopedia: "",
  marketplace_shopee: "",
});
const toast = useToast();

const { data: categories, status: onLoadCategories } = await useFetch(
  `${config.public.apiBase}/categories?limit=9999`,
  {
    transform: (value: HttpSuccessWithPagination<Category[]>) => {
      return value.data.data.map(c => {
        return {
          label: c.category_name,
          value: c.category_id,
        }
      });
    },
  }
);

const { data: series, status: onLoadSeries } = await useFetch(
  () => `${config.public.apiBase}/series?limit=9999&category_id=${state.category_id || '' }`,
  {
    transform: (value: HttpSuccessWithPagination<Series[]>) => {
      return value.data.data.map(s => {
        return {
          label: s.series_name,
          value: s.series_id,
        }
      });
    },
    watch: [() => state.category_id],
  }
);

watch(() => state.category_id, () => state.series_id = undefined);

function addSpecification() {
  state.specifications.push({ key: "", value: "" });
}

function handleFileChanged() {
  state.product_images = state.product_images.filter(f => ALLOWED_FILE_TYPES.includes(f.type));
}

async function handleSubmit(e: FormSubmitEvent<Schema>) {
  formErrors.value = undefined;
  console.log(e.data)
  if (onSubmit.value) return;

  onSubmit.value = true;
  try {
    const body = new FormData();
    for (const key in e.data) {
      const value = e.data[key as keyof typeof e.data];
      if (key === "product_images") {
        (value as File[]).forEach(file => {
          body.append("product_images", file);
        });
      } else if (key === "specifications") {
        let specifications = [] as Record<string, string>[];
        state.specifications.filter(s => s.key && s.value).forEach(s => {
          specifications.push({
            spec_group: s.key,
            spec_type: s.key,
            spec_value: s.value,
          });
        });
        body.append("specifications", JSON.stringify(specifications));
      } else {
        body.append(key, `${value}`);
      }
    }

    const res = await $fetch<HttpSuccess<Item>>(`${config.public.apiBase}/products`, {
      headers: { ...bearer },
      method: "POST",
      body
    });

    navigateTo(localeRoute(`/cms/product/items/${res.data.product_id}`));
    toast.add({
      title: `Product item created successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to create product item!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  onSubmit.value = false;
}

function removeSpecification(index: number) {
  state.specifications.splice(index, 1);
}
</script>
