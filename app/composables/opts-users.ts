import type { User } from "~/types";
import type { HttpSuccessWithPagination } from "~/types/http";

export const useOptsUsers = (state?: Ref<Record<string, any>>) => {
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

  const { data: users, status: onLoadUsers, refresh: refreshUsers } = useFetch(
    () => `${useRuntimeConfig().public.apiBase}/users?${params.value}`,
    {
      headers: { ...bearer },
      transform: (value: HttpSuccessWithPagination<User[]>) => {
        return value.data.data.map(u => ({
          label: u.user_username,
          value: u.user_id,
        }));
      },
    }
  );

  if (state) {
    watch(state, (val) => {
      Object.assign(p, val);
    }, { immediate: true });
  }

  return { users, onLoadUsers, refreshUsers };
}
