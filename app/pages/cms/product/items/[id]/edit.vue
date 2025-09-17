<template>
  <div class="p-6">
    <div class="space-y-6 glass p-6 border border-accent rounded-xl">
      <h4 class="text-xl text-tone font-semibold">
        Edit Product Item
      </h4>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="handleSubmit"
        @error="(e: { errors: FormError[] }) => formErrors = e.errors"
      >
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
            Save
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
import type { HttpError, HttpSuccess } from "~/types/http";
import type { Item } from "~/types/product";

const schema = v.object({
  product_name: vRequired(),
  product_code: vRequired(),
  product_description: vRequired(),
  product_detail: vRequired(),
  product_info: vRequired(),
  category_id: vRequiredSelect(),
  series_id: vRequiredSelect(),
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
const route = useRoute();
const state = reactive({
  product_name: "",
  product_code: "",
  product_description: "",
  product_detail: "",
  product_info: "",
  category_id: undefined as undefined | number,
  series_id: undefined as undefined | number,
  specifications: [{ key: "", value: "" }],
  marketplace_tokopedia: "",
  marketplace_shopee: "",
});
const toast = useToast();

const { data: product } = await useFetch(
  `${config.public.apiBase}/products/${route.params.id}`,
  {
    transform: (value: HttpSuccess<Item>) => {
      return value.data;
    },
  }
);

const { categories, onLoadCategories } = useOptsCategories();
const { series, onLoadSeries } = useOptsSeries(toRef(() => {
  return { category_id: state.category_id };
}));

watch(() => product.value, (val) => {
  if (!val) return;
  Object.assign(state, {
    product_name: val.product_name,
    product_code: val.product_code,
    product_description: val.product_description,
    product_detail: val.product_detail,
    product_info: val.product_info,
    category_id: val.category_id,
    series_id: val.series_id,
    specifications: val.specifications.map(s => {
      return {
        key: s.spec_type,
        value: s.spec_value,
      };
    }),
    marketplace_tokopedia: val.product_marketplace.tokopedia,
    marketplace_shopee: val.product_marketplace.tokopedia,
  });
}, { immediate: true });
watch(() => state.category_id, () => state.series_id = undefined);

function addSpecification() {
  state.specifications.push({ key: "", value: "" });
}

async function handleSubmit(e: FormSubmitEvent<Schema>) {
  if (onSubmit.value) return;

  onSubmit.value = true;
  try {
    const body: Record<string, any> = e.data;
    body.specifications = state.specifications.filter(s => s.key && s.value).map(s => {
      return {
        spec_type: s.key,
        spec_value: s.value,
      }
    });
    const res = await $fetch<HttpSuccess<Item>>(`${config.public.apiBase}/products/${route.params.id}`, {
      headers: { ...bearer },
      method: "PUT",
      body
    });

    navigateTo(localeRoute(`/cms/product/items/${res.data.product_id}`));
    toast.add({
      title: `Product item updated successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to update product item!`,
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
