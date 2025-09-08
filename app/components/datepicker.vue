<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{
        _model ? df.format(_model.toDate(getLocalTimeZone())) : "Select a date"
      }}
    </UButton>

    <template #content>
      <UCalendar v-model="_model" class="p-2" />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const _model = ref<CalendarDate>();
const model = defineModel<string | undefined>();

watch(() => _model.value, (val) => {
  if (val) model.value = val.toDate(getLocalTimeZone()).toISOString();
});

onMounted(() => {
  if (model.value) {
    const date = new Date(model.value);
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    _model.value = new CalendarDate(year, month, day);
  }
});
</script>
