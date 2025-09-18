<template>
  <div v-if="article" class="space-y-6 p-6">
    <img :src="state.newThumbnail || article.thumbnail" :alt="article.title" class="w-full max-w-xl max-h-96 mx-auto object-contain">
    <div class="space-y-2">
      <div class="flex not-2xl:flex-col-reverse items-start justify-between gap-4 2xl:gap-16">
        <h2 class="text-2xl text-tone font-semibold">
          {{ article.title }}
        </h2>
        <div class="flex gap-2">
          <UButton
            icon="i-material-symbols:add-photo-alternate-outline"
            class="whitespace-nowrap"
            @click="openThumbnailModal"
          >
            Change Thumbnail
          </UButton>
          <UButton
            :to="$localeRoute(`/cms/blog/articles/${article.blog_article_id}/edit`)"
            icon="i-material-symbols:visibility-outline"
            class="whitespace-nowrap"
          >
            Edit article
          </UButton>
          <UButton
            v-if="!article.is_published"
            icon="i-material-symbols:publish"
            class="whitespace-nowrap"
            @click="publishArticle"
          >
            Publish article
          </UButton>
        </div>
      </div>
      <div class="flex gap-2">
        <UBadge size="lg" variant="outline">
          {{ article.category.blog_category_name }}
        </UBadge>
        <UBadge size="lg" variant="outline">
          {{ state.published ?? article.is_published ? "Published" : "Draft" }}
        </UBadge>
      </div>
    </div>
    <div class="tiptap ProseMirror" v-html="article.content"></div>
  </div>
  <div v-else class="py-16">
    <h4 class="text-xl text-tone text-center font-semibold">
      Article not found
    </h4>
  </div>

  <UModal
    title="Change Thumbnail"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="changeThumbnail">
        <UFormField label="Thumbnail" name="thumbnail">
          <UFileUpload
            accept=".jpg,.jpeg,.png,.webp"
            description="JPG, JPEG, PNG, WebP"
            v-model="state.thumbnail"
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
            Save
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { BlogArticle } from "~/types/blog";
import type { HttpError, HttpSuccess } from "~/types/http";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
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
const modal = reactive({
  onSubmit: false,
  open: false,
});
const state = reactive({
  newThumbnail: "",
  published: undefined as undefined | boolean,
  thumbnail: undefined as undefined | File,
});
const route = useRoute();
const toast = useToast();

const { data: article } = await useFetch(
  `${config.public.apiBase}/blog-articles/${route.params.id}`,
  {
    transform: (value: HttpSuccess<BlogArticle>) => {
      return value.data;
    },
  }
);

async function changeThumbnail(e: FormSubmitEvent<Schema>) {
  if (modal.onSubmit) return;

  modal.onSubmit = true;
  try {
    const body = new FormData();
    body.append("thumbnail", state.thumbnail as File);

    const res = await $fetch<HttpSuccess<BlogArticle>>(`${config.public.apiBase}/blog-articles/${route.params.id}`, {
      headers: { ...bearer },
      method: "PUT",
      body
    });

    state.newThumbnail = res.data.thumbnail;
    modal.open = false;
    toast.add({
      title: `Article thumbnail changed successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to change article thumbnail!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openThumbnailModal() {
  state.thumbnail = undefined;
  modal.open = true;
}

async function publishArticle() {
  try {
    const res = await $fetch<HttpSuccess<BlogArticle>>(`${config.public.apiBase}/blog-articles/${route.params.id}`, {
      headers: { ...bearer },
      method: "PUT",
      body: { is_published: true },
    });

    state.published = true;
    modal.open = false;
    toast.add({
      title: `Article published!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to publish article!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
}
</script>
