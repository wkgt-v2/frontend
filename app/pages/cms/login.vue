<template>
  <div
    class="flex items-center justify-center w-full min-h-dvh bg-[url('/assets/images/pattern/jigsaw.svg')] dark:bg-[url('/assets/images/pattern/jigsaw_dark-mode.svg')] bg-repeat"
    @mousemove="updateRadialPosition"
  >
    <Teleport to="body">
      <div
        ref="radialRef"
        class="eclipse fixed size-[960px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
      ></div>
    </Teleport>
    <div
      class="relative w-96 glass p-6 border border-accent rounded-xl shadow-md z-10"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="flex items-center justify-between">
          <NuxtLink :to="localePath('/')">
            <img src="/assets/images/logo.png" alt="Logo" class="h-10 select-none dark:hidden" />
            <img src="/assets/images/logo_dark-mode.png" alt="Logo" class="h-10 select-none hidden dark:block" />
          </NuxtLink>
          <DarkModeToggler class="ml-auto" />
        </div>
        <UFormField label="Username" name="user_username">
          <UInput v-model="state.user_username" />
        </UFormField>

        <UFormField label="Password" name="user_password">
          <UInput v-model="state.user_password" type="password" />
        </UFormField>

        <UButton
          type="submit"
          class="cursor-pointer"
          :loading="onLoading"
          block
        >
          Sign In
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { FetchError } from "ofetch";
import type { HttpError, HttpSuccess } from "~/types/http";
import type { User } from "~/types";

definePageMeta({
  layout: "app",
});

const schema = v.object({
  user_username: vRequired(),
  user_password: vRequired(),
});

type Schema = v.InferOutput<typeof schema>;

const config = useRuntimeConfig();
const localePath = useLocalePath();
const onLoading = ref(false);
const radialRef = ref<HTMLDivElement>();
const state = reactive({
  user_username: "",
  user_password: "",
});
const toast = useToast();
const { token } = useToken();
const uid = useUid();
const user = useUser();

async function onSubmit(e: FormSubmitEvent<Schema>) {
  if (!onLoading.value) {
    onLoading.value = true;
    try {
      const res = await $fetch<HttpSuccess<{ token: string; user: User }>>(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: e.data,
      });
      token.value = res.data.token;
      uid.value = `${res.data.user.user_id}`;
      user.value = res.data.user;
      navigateTo(localePath("cms-dashboard"));
    } catch (error) {
      console.log(error)
      const e = error as FetchError<HttpError>;
      toast.add({
        title: "Authentication failed!",
        description: e.data?.message,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
        duration: 0,
      });
    }

    onLoading.value = false;
  }
}

function updateRadialPosition(e: MouseEvent) {
  const el = radialRef.value as HTMLDivElement;
  if (el) {
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  }
}
</script>

