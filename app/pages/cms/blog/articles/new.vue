<template>
  <div class="p-6">
    <div class="space-y-6 glass p-6 border border-accent rounded-xl">
      <h4 class="text-xl text-tone font-semibold">
        Create New Article
      </h4>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="handleSubmit"
        @error="(e: { errors: FormError[] }) => formErrors = e.errors"
      >
        <UFormField label="Thumbnail" name="thumbnail">
          <UFileUpload
            accept=".jpg,.jpeg,.png,.webp"
            class="w-full h-48"
            description="JPG, JPEG, PNG, WebP"
            v-model="state.thumbnail"
          />
        </UFormField>
        <UFormField label="Title" name="title">
          <UInput v-model="state.title" />
        </UFormField>
        <div class="grid grid-cols-2 gap-6">
          <UFormField label="Slug" name="slug">
            <UInput v-model="state.slug" />
          </UFormField>
          <UFormField label="Category" name="blog_category_id">
            <USelectMenu
              v-model="state.blog_category_id"
              :items="categories"
              value-key="value"
              :loading="onLoadCategories === 'pending'"
            />
          </UFormField>
        </div>

        <UFormField label="Content" name="content">
          <TiptapEditor
            v-model="state.content"
            :is-error="!!formErrors?.find(e => e.name === 'content')"
          />
        </UFormField>

        <div class="flex justify-end gap-4">
          <UButton
            variant="outline"
            :class="{ 'pointer-events-none': onSubmit }"
            :disabled="onSubmit"
            :to="$localePath('cms-blog-articles')"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            variant="outline"
            :class="{ 'pointer-events-none': onSubmit }"
            :disabled="onSubmit"
            @click="state.publish = false"
          >
            Save as Draft
          </UButton>
          <UButton type="submit" :loading="onSubmit" @click="state.publish = true">
            Create & Publish
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
import type { BlogArticle, BlogCategory } from "~/types/blog";

const schema = v.object({
  blog_category_id: vRequiredSelect(),
  title: vRequired(),
  slug: v.pipe(
    v.string(),
    v.nonEmpty("This field is required."),
    v.regex(/^[a-z0-9-]+$/, "Use only lowercase letters, numbers, and dashes. No spaces."),
  ),
  content: vRequired(),
  thumbnail: v.pipe(
    v.file("Please select an image file."),
    v.mimeType(
      ["image/jpeg", "image/png", "image/jpg", "image/webp"],
      "Please select a JPG, JPEG, PNG or WebP file."
    )
  ),
});
type Schema = v.InferOutput<typeof schema>;

const { bearer } = useToken();
const config = useRuntimeConfig();
const formErrors = ref<FormError[]>();
const localeRoute = useLocaleRoute();
const onSubmit = ref(false);
const state = reactive({
  blog_category_id: undefined,
  title: "",
  slug: "",
  content: "",
  thumbnail: undefined,
  publish: false,
});
const toast = useToast();

const { data: categories, status: onLoadCategories } = await useFetch(
  `${config.public.apiBase}/blog-categories?limit=9999`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<BlogCategory[]>) => {
      return value.data.data.map(c => {
        return {
          label: c.blog_category_name,
          value: c.blog_category_id,
        }
      });
    },
  }
);

async function handleSubmit(e: FormSubmitEvent<Schema>) {
  formErrors.value = undefined;
  if (onSubmit.value) return;

  onSubmit.value = true;
  try {
    const body = new FormData();
    for (const key in e.data) {
      const value = e.data[key as keyof typeof e.data];
      if (key === "thumbnail") {
        body.append(key, value as File);
      } else {
        body.append(key, `${value}`);
      }
    }
    body.append("is_published", `${state.publish}`);

    const res = await $fetch<HttpSuccess<BlogArticle>>(`${config.public.apiBase}/blog-articles`, {
      headers: { ...bearer },
      method: "POST",
      body
    });

    navigateTo(localeRoute(`/cms/blog/articles/${res.data.blog_article_id}`));
    toast.add({
      title: `Article created successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to create article!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  onSubmit.value = false;
}
</script>
