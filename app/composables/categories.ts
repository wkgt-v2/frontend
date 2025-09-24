import type { HttpSuccessWithPagination } from "~/types/http";
import type { Category } from "~/types/product";

export const useCategories = () => {
  const categories = useState<Category[]>("categories");

  const { refresh: refreshCategories } = useFetch<HttpSuccessWithPagination<Category[]>>(
    `${useRuntimeConfig().public.apiBase}/categories?limit=9999`,
    {
      onResponse({ response }) {
        categories.value = response._data.data.data;
      },
    }
  );
  return { categories, refreshCategories };
}
