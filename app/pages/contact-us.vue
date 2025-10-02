<template>
  <div class="container space-y-8 py-16">
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="flex flex-col justify-center gap-3">
        <h5 class="text-primary font-semibold">
          {{ $t("contact_us.subtitle") }}
        </h5>
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary" v-html="parseI18n($t('contact_us.title'))"></h1>
      </div>
      <div class="space-y-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="flex gap-2">
            <UIcon name="i-material-symbols:pin-drop-outline" mode="svg" class="shrink-0 size-5 text-primary" />
            <div class="space-y-1">
              <h5 class="text-primary font-semibold">
                {{ $t("contact_us.address") }}
              </h5>
              <p class="text-tone">
                {{ getCompanySettings("company_address") }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <UIcon name="i-material-symbols:schedule-outline" mode="svg" class="shrink-0 size-5 text-primary" />
            <div class="space-y-1">
              <h5 class="text-primary font-semibold">
                {{ $t("contact_us.opening_hours") }}
              </h5>
              <p class="block text-tone whitespace-pre-line">
                {{ getCompanySettings("company_opening_hours") }}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-8">
          <div class="flex gap-2">
            <UIcon name="i-material-symbols:mail-outline" mode="svg" class="shrink-0 size-5 text-primary" />
            <div class="space-y-1">
              <h5 class="text-primary font-semibold">
                {{ $t("contact_us.email") }}
              </h5>
              <p class="text-tone">
                <a :href="`mailto:${getCompanySettings('company_email')}`">
                  {{ getCompanySettings("company_email") }}
                </a>
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <UIcon name="i-material-symbols:call-outline" mode="svg" class="shrink-0 size-5 text-primary" />
            <div class="space-y-1">
              <h5 class="text-primary font-semibold">
                {{ $t("contact_us.call_center") }}
              </h5>
              <p class="text-tone">
                  {{ getCompanySettings("company_call_center") }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex gap-6">
          <UButton
            size="lg"
            :to="`https://wa.me/${getCompanySettings('company_whatsapp_number')}`"
            target="_blank"
          >
            <template #leading>
              <icon-whatsapp class="size-5" />
            </template>
            Whatsapp
          </UButton>
          <UButton size="lg" :to="$localePath('/service/location')">
            {{ $t("contact_us.service_center_location") }}
          </UButton>
        </div>
      </div>
    </div>
    <iframe
      :src="getCompanySettings('company_gmap_embed_url')"
      width="1216"
      height="468"
      class="w-full border-0 rounded-2xl"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("nav.contact"),
});

const { getCompanySettings } = useCompanySettings();
</script>
