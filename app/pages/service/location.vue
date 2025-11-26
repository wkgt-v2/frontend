<template>
  <div
    class="container space-y-8 py-16"
    @mousemove="updateRadialPosition"
  >
    <Teleport to="body">
      <div
        ref="radialRef"
        class="eclipse fixed size-[960px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
      ></div>
    </Teleport>
    <div class="space-y-3 text-center">
      <h5 class="text-primary font-semibold">
        {{ $t("service_center.subtitle") }}
      </h5>
      <h1 class="text-5xl text-tone font-semibold">
        {{ $t("service_center.title") }}
      </h1>
    </div>

    <div class="overflow-x-auto">
      <UTable :columns="column" :data="serviceCenters" :ui="{ tr: 'border-accent', th: 'glass' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { ServiceCenter } from "~/types";
import type { HttpSuccessWithPagination } from "~/types/http";

const { t } = useI18n();
const config = useRuntimeConfig();

const { data: serviceCenters } = await useFetch(
  `${config.public.apiBase}/headquarters?limit=9999`,
  {
    transform: (value: HttpSuccessWithPagination<ServiceCenter[]>) => {
      return value.data.data;
    },
  }
);
console.log(serviceCenters.value)

const column = computed<TableColumn<ServiceCenter>[]>(() => {
  return [
    {
      accessorKey: "city",
      header: t("service_center.city"),
      cell: ({ row }) => `${row.original.city}, ${row.original.province}`,
    },
    {
      accessorKey: "address",
      header: t("service_center.address"),
    },
    {
      accessorKey: "phone",
      header: t("service_center.phone"),
    },
    {
      accessorKey: "open_hour",
      header: t("service_center.operating_hours"),
      cell: ({ row }) => `${row.original.open_hour} - ${row.original.closed_hour}`,
    },
  ];
});

const radialRef = useTemplateRef("radialRef");

function updateRadialPosition(e: MouseEvent) {
  const el = radialRef.value as HTMLDivElement;
  if (el) {
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  }
}
</script>

