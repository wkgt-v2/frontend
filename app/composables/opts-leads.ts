import type { HttpSuccessWithPagination } from "~/types/http";
import type { Lead } from "~/types/sales";

export const useOptsLeads = (state?: Ref<Record<string, any>>) => {
  const { bearer } = useToken();
  const p = reactive<Record<string, any>>({});
  const params = computed(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("limit", "9999");
    for (const key in p) {
      if (p[key]) searchParams.append(key, p[key]);
    }
    return searchParams.toString();
  });

  const { data: leads, status: onLoadLeads, refresh: refreshLeads } = useFetch(
    () => `${useRuntimeConfig().public.apiBase}/leads?${params.value}`,
    {
      headers: { ...bearer },
      transform: (value: HttpSuccessWithPagination<Lead[]>) => {
        return value.data.data.map(l => ({
          label: l.customer_name,
          value: l.lead_id,
        }));
      },
    }
  );

  if (state) {
    watch(state, (val) => {
      Object.assign(p, val);
    }, { immediate: true });
  }

  return { leads, onLoadLeads, refreshLeads };
}
