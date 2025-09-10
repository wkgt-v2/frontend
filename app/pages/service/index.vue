<template>
  <div class="container grid xl:grid-cols-2 gap-6 py-16">
    <div class="space-y-8">
      <div class="space-y-3">
        <h5 class="text-base text-primary font-semibold">
          CEK PERBAIKAN
        </h5>
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary">
          Cek Status Perbaikan.
        </h1>
      </div>
      <p class="max-w-lg text-base text-tone">
        Perkiraan tanggal penyelesaian hanyalah referensi dan tidak selalu ditampilkan. Tanggal penyelesaian dapat berubah berdasarkan pada kondisi perbaikan.
        <br />
        <br />
        Anda dapat mengetahui status perbaikan produk Anda dengan memasukkan Nomor Perbaikan yang tertera pada form perbaikan yang Anda terima saat menyerahkan Produk Anda untuk diperbaiki di WAHANA Service Center ataupun dengan cara memasukan Serial Number dari produk Anda.
        <br />
        <br />
        Dalam hal ini Anda tidak dapat mengetahui status perbaikan produk Anda, jika produk Anda perbaiki belum mendapatkan Nomor Perbaikan dari WAHANA Service Center terkait. Untuk Nomor Perbaikan, silahkan cek pada form tanda terima penyerahan perbaikan produk Anda. Contoh Nomor Perbaikan (IDXXXXXXXX).
      </p>
      <div class="flex w-full max-w-lg items-end gap-4">
        <div class="space-y-1 w-full">
          <label for="id_perbaikan" class="text-base text-tone">
            Nomor ID Perbaikan
          </label>
          <UInput name="id_perbaikan" size="lg" variant="subtle" placeholder="IDXXXXXXXX" v-model="form.id" />
        </div>
        <UButton size="lg" class="whitespace-nowrap" :loading="onCheck" @click="checkStatus">
          Cek Status
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

  <UModal title="Data Perbaikan" v-model:open="showModal" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div v-if="serviceOrder" class="space-y-4">
        <div class="space-y-1">
          <h6 class="text-sm text-primary">
            No. Resi
          </h6>
          <div class="text-tone">
            {{ serviceOrder.no_resi }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              Customer Name
            </h6>
            <div class="text-tone">
              {{ serviceOrder.customer_name }}
            </div>
          </div>
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              Customer Phone
            </h6>
            <div class="text-tone">
              {{ maskPhoneNumber(serviceOrder.customer_phone) }}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              Start Date
            </h6>
            <div class="text-tone">
              {{ serviceOrder.start_date }}
            </div>
          </div>
          <div class="space-y-1">
            <h6 class="text-sm text-primary">
              Status
            </h6>
            <div class="text-tone">
              <UBadge :label="parseStatus(serviceOrder).label" :color="parseStatus(serviceOrder).color" />
            </div>
          </div>
        </div>
        <div class="space-y-1">
          <h6 class="text-sm text-primary">
            Product
          </h6>
          <div class="text-tone">
            {{ serviceOrder.product.category.category_name }} - {{ serviceOrder.product.product_name }}
          </div>
        </div>
        <div class="space-y-1">
          <h6 class="text-sm text-primary">
            Description
          </h6>
          <div class="text-tone" v-html="serviceOrder.description"></div>
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton label="Tutup" @click="close" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { ServiceOrder } from "~/types";
import type { HttpError, HttpSuccess } from "~/types/http";

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
      title: "Failed to get service data!",
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
      return { label: "In Progress", color: "info" };
    case "completed":
      return { label: "Completed", color: "success" };
    case "cancelled":
      return { label: "Cancelled", color: "error" };
    default:
      return { label: "Pending", color: "neutral" };
  }
}
</script>
