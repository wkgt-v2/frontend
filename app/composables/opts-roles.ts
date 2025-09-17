import type { UserRole } from "~/types";
import type { HttpSuccessWithPagination } from "~/types/http";

export const useOptsRoles = (state?: Ref<Record<string, any>>) => {
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

  const { data: roles, status: onLoadRoles, refresh: refreshRoles } = useFetch(
    () => `${useRuntimeConfig().public.apiBase}/roles?${params.value}`,
    {
      headers: { ...bearer },
      transform: (value: HttpSuccessWithPagination<UserRole[]>) => {
        return value.data.data.map(r => ({
          label: r.role_nama,
          value: r.role_id,
        }));
      },
    }
  );

  if (state) {
    watch(state, (val) => {
      Object.assign(p, val);
    }, { immediate: true });
  }

  return { roles, onLoadRoles, refreshRoles };
}
