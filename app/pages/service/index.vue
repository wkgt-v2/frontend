<template>
  <div class="container grid xl:grid-cols-2 gap-6 py-16">
    <div class="space-y-8">
      <div class="space-y-3">
        <h5 class="text-base text-primary font-semibold">
          {{ $t("service.subtitle") }}
        </h5>
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary">
          {{ $t("service.title") }}
        </h1>
      </div>
      <p class="max-w-lg text-base text-tone">
        {{ $t("service.content1") }}
        <br />
        <br />
        {{ $t("service.content2") }}
        <br />
        <br />
        {{ $t("service.content3") }}
      </p>
      <div class="flex w-full max-w-lg items-end gap-4">
        <div class="space-y-1 w-full">
          <label for="id_perbaikan" class="text-base text-tone">
            {{ $t("service.field_label") }}
          </label>
          <UInput name="id_perbaikan" size="lg" variant="subtle" placeholder="IDXXXXXXXX" v-model="form.id" />
        </div>
        <UButton size="lg" class="whitespace-nowrap" :loading="onCheck" @click="checkStatus">
          {{ $t("service.button_label") }}
        </UButton>
      </div>
    </div>
    <img
      src="/assets/images/illustrations/planning.jpg"
      alt="Planning"
      width="600"
      height="600"
      class="not-xl:hidden size-full object-cover rounded-2xl"
      loading="lazy"
    />
  </div>

  <UModal :title="$t('service.repair_details')" v-model:open="showModal" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div v-if="serviceOrder" class="space-y-4">
        <div class="space-y-1">
          <h6 class="text-sm text-primary">
            {{ $t("service.receipt_number") }}
          </h6>
          <div class="text-tone">
            {{ serviceOrder.no_resi }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              {{ $t("service.customer_name") }}
            </h6>
            <div class="text-tone">
              {{ serviceOrder.customer_name }}
            </div>
          </div>
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              {{ $t("service.customer_phone") }}
            </h6>
            <div class="text-tone">
              {{ maskPhoneNumber(serviceOrder.customer_phone) }}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              {{ $t("service.start_date") }}
            </h6>
            <div class="text-tone">
              {{ serviceOrder.start_date }}
            </div>
          </div>
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              {{ $t("service.status") }}
            </h6>
            <div class="text-tone">
              <UBadge :label="parseStatus(serviceOrder).label" :color="parseStatus(serviceOrder).color" />
            </div>
          </div>
        </div>
        <div class="space-y-1">
          <h6 class="text-sm text-primary">
            {{ $t("service.product") }}
          </h6>
          <div class="text-tone">
            {{ serviceOrder.product.category.category_name }} - {{ serviceOrder.product.product_name }}
          </div>
        </div>
        <div class="space-y-1">
          <h6 class="text-sm text-primary">
            {{ $t("service.description") }}
          </h6>
          <div class="text-tone" v-html="serviceOrder.description"></div>
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton :label="$t('service.close')" @click="close" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { ServiceOrder } from "~/types";
import type { HttpError, HttpSuccess } from "~/types/http";

const { t } = useI18n();

useHead({
  title: t("nav.services"),
});

const form = reactive({
  id: ref(""),
});
const onCheck = ref(false);
const serviceOrder = ref<ServiceOrder>();
const showModal = ref(false);
const toast = useToast();

async function checkStatus() {
  if (!form.id.trim()) return;
  onCheck.value = true;
  serviceOrder.value = undefined;
  try {
    const res = await $fetch<HttpSuccess<ServiceOrder>>(`${useRuntimeConfig().public.apiBase}/service-orders/${form.id}`);
    serviceOrder.value = res.data;
    showModal.value = true;
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: t("service.error_title"),
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
  onCheck.value = false;
}

function parseStatus(serviceOrder: ServiceOrder): { label: string; color: "info" | "success" | "error" | "neutral"; } {
  switch (serviceOrder.status) {
    case "in_progress":
      return { label: t("service.in_progress"), color: "info" };
    case "completed":
      return { label: t("service.completed"), color: "success" };
    case "cancelled":
      return { label: t("service.cancelled"), color: "error" };
    default:
      return { label: t("service.pending"), color: "neutral" };
  }
}
</script>
