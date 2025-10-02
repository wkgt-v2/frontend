import type { BlogCategory } from "~/types/blog";
import type { HttpSuccessWithPagination } from "~/types/http";

export const useOptsBlogCategories = (state?: Ref<Record<string, any>>) => {
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

  const { data: categories, status: onLoadCategories, refresh: refreshCategories } = useFetch(
    () => `${useRuntimeConfig().public.apiBase}/blog-categories?${params.value}`,
    {
      headers: { ...bearer },
      transform: (value: HttpSuccessWithPagination<BlogCategory[]>) => {
        return value.data.data.map(c => ({
          label: c.blog_category_name,
          value: c.blog_category_id,
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
