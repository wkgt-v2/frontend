import type { HttpSuccessWithPagination } from "~/types/http";
import type { Item } from "~/types/product";

export const useOptsProducts = (state?: Ref<Record<string, any>>) => {
  const p = reactive<Record<string, any>>({});
  const params = computed(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("limit", "9999");
    for (const key in p) {
      if (p[key]) searchParams.append(key, p[key]);
    }
    return searchParams.toString();
  });

  const { data: products, status: onLoadProducts, refresh: refreshProducts } = useFetch(
    () => `${useRuntimeConfig().public.apiBase}/products?${params.value}`,
    {
      transform: (value: HttpSuccessWithPagination<Item[]>) => {
        return value.data.data.map(p => ({
          label: p.product_name,
          value: p.product_id,
        }));
      },
    }
  );

  if (state) {
    watch(state, (val) => {
      Object.assign(p, val);
    }, { immediate: true });
  }

  return { products, onLoadProducts, refreshProducts };
}
