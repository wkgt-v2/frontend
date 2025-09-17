import type { HttpSuccessWithPagination } from "~/types/http";
import type { Category } from "~/types/product";

export const useOptsCategories = (state?: Ref<Record<string, any>>) => {
  const p = reactive<Record<string, any>>({});
  const params = computed(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("limit", "9999");
    for (const key in p) {
      if (p[key]) searchParams.append(key, p[key]);
    }
    return searchParams.toString();
  });

  const { data: categories, status: onLoadCategories, refresh: refreshCategories } = useFetch(
    () => `${useRuntimeConfig().public.apiBase}/categories?${params.value}`,
    {
      transform: (value: HttpSuccessWithPagination<Category[]>) => {
        return value.data.data.map(c => ({
          label: c.category_name,
          value: c.category_id,
        }));
      },
    }
  );

  if (state) {
    watch(state, (val) => {
      Object.assign(p, val);
    }, { immediate: true });
  }

  return { categories, onLoadCategories, refreshCategories };
};
