<template>
  <UPopover v-model:open="open">
    <UButton color="neutral" variant="outline" icon="i-lucide-calendar" class="justify-start" block>
      {{ label }}
    </UButton>

    <template #content>
      <VueDatePicker
        v-model="internalDate"
        :enable-time-picker="enableTimePicker"
        :dark="colorMode.value === 'dark'"
        minutes-grid-increment="1"
        inline
        auto-apply
        teleport
        time-picker-inline
      />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

const props = withDefaults(defineProps<{
  enableTimePicker?: boolean;
}>(), {
  enableTimePicker: false,
});

const colorMode = useColorMode();

const model = defineModel<string | undefined>();
const open = ref(false);

const internalDate = computed<Date | null>({
  get() {
    if (!model.value) return null;
    const d = new Date(model.value);
    return isNaN(d.getTime()) ? null : d;
  },
  set(d) {
    if (!d) {
      model.value = undefined;
      return;
    }
    if (!props.enableTimePicker) {
      const utcMidnight = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
      model.value = utcMidnight.toISOString();
    } else {
      model.value = d.toISOString();
    }
  }
});

const label = computed(() => {
  if (internalDate.value) {
    return internalDate.value.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: false,
      ...(props.enableTimePicker ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
  }
  return "Select a date";
});

watch(() => model.value, () => {
  if (!props.enableTimePicker) open.value = false;
});
</script>
