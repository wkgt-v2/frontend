import type { HttpSuccessWithPagination } from "~/types/http";
import type { Series } from "~/types/product";

export const useOptsSeries = (state?: Ref<Record<string, any>>) => {
  const p = reactive<Record<string, any>>({});
  const params = computed(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("limit", "9999");
    for (const key in p) {
      if (p[key]) searchParams.append(key, p[key]);
    }
    return searchParams.toString();
  });

  const { data: series, status: onLoadSeries, refresh: refreshSeries } = useFetch(
    () => `${useRuntimeConfig().public.apiBase}/series?${params.value}`,
    {
      transform: (value: HttpSuccessWithPagination<Series[]>) => {
        return value.data.data.map(s => ({
          label: s.series_name,
          value: s.series_id,
        }));
      },
    }
  );

  if (state) {
    watch(state, (val) => {
      Object.assign(p, val);
    }, { immediate: true });
  }

  return { series, onLoadSeries, refreshSeries };
};
