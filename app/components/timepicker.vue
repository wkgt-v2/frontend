<template>
  <UPopover v-model:open="open">
    <UButton color="neutral" variant="outline" icon="i-lucide-calendar" class="justify-start" block>
      {{ label }}
    </UButton>

    <template #content>
      <VueDatePicker
        v-model="internalTime"
        :dark="colorMode.value === 'dark'"
        minutes-grid-increment="1"
        time-picker
        inline
        teleport
      />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

const colorMode = useColorMode();
const model = defineModel<string | undefined>();
const open = ref(false);

const internalTime = computed<{ hours: number, minutes: number } | null>({
  get() {
    if (!model.value) return null;
    const [hour, minute] = model.value.split(":");
    return { hours: +hour!, minutes: +minute! };
  },
  set(t) {
    if (!t) {
      model.value = undefined;
      return;
    }

    const hours = `${t.hours}`.padStart(2, "0");
    const minutes = `${t.minutes}`.padStart(2, "0");
    model.value = `${hours}:${minutes}`;
  }
});

const label = computed(() => {
  if (internalTime.value) {
    const hours = `${internalTime.value.hours}`.padStart(2, "0");
    const minutes = `${internalTime.value.minutes}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return "Select time";
});

watch(() => model.value, () => {
  open.value = false;
});
</script>
