<template>
  <footer>
    <div class="w-full h-px bg-accent"></div>
    <div class="container flex flex-col md:flex-row justify-between gap-8 py-8">
      <div class="space-y-2 max-w-sm">
        <div class="space-y-1">
          <Logo />
          <div class="text-sm text-tone font-semibold">
            {{ $t("footer.label") }}
          </div>
        </div>
        <div class="text-sm text-tone leading-tight">
          {{ getCompanySettings("company_address") }}
        </div>
      </div>
      <div class="flex flex-wrap md:justify-end gap-3 w-60">
        <ClientOnly>
          <UTooltip v-for="social in socials" :key="social.sm_id" :text="social.sm_name" :delay-duration="0">
            <UButton
              :to="social.sm_url"
              target="_blank"
              variant="link"
              size="xl"
              class="h-fit p-0"
              :icon="social.sm_icon"
            />
          </UTooltip>
        </ClientOnly>
      </div>
    </div>
    <div class="bg-inverted text-inverted">
      <div class="container flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-2 py-2">
        <div class="flex flex-col md:flex-row gap-2 md:gap-6">
          <UButton
            :to="$localePath('privacy-policy')"
            size="sm"
            variant="link"
            color="neutral"
            class="p-0 text-inverted hover:text-inverted"
          >
            {{ $t("footer.privacy_policy") }}
          </UButton>
          <UButton
            :to="$localePath('terms-of-services')"
            size="sm"
            variant="link"
            color="neutral"
            class="p-0 text-inverted hover:text-inverted"
          >
            {{ $t("footer.terms_of_service") }}
          </UButton>
        </div>
        <div class="text-sm">
          {{ $t("footer.copyright") }}
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { HttpSuccessWithPagination } from "~/types/http";
import type { SocialMedia } from "~/types/marketing";

const { getCompanySettings } = useCompanySettings();
const { data: socials } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/social-medias?sm_type=social_media`,
  {
    transform: (value: HttpSuccessWithPagination<SocialMedia[]>) => {
      return value.data.data;
    },
  }
);
</script>
