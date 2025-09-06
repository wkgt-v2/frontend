import type { User } from "~/types";
import type { HttpSuccess, HttpSuccessWithPagination } from "~/types/http";
import type { Category } from "~/types/product";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const categories = useState<Category[] | undefined>("categories");
  const config = useRuntimeConfig();
  const localePath = useLocalePath();
  const path = to.path;
  const pathName = to.name as string;
  const { bearer, token } = useToken();
  const user = useUser();

  const redirectToLogin = () => {
    if (path !== localePath("cms-login")) {
      token.value = null;
      return navigateTo(localePath("cms-login"), { replace: true });
    }
  };

  if (pathName.startsWith("cms")) {
    const uid = useUid();
    if (!token.value) return redirectToLogin();
    if (!user.value && ![undefined, null, ""].includes(uid.value)) {
      const { data } = await useFetch<HttpSuccess<User>>(
        `${config.public.apiBase}/users/${uid.value}`,
        { headers: { ...bearer } },
      );
      if (data.value) {
        user.value = data.value.data;
      } else return redirectToLogin();
    }
  }

  if (!categories.value) {
    const { data } = await useFetch<HttpSuccessWithPagination<Category[]>>(
      `${config.public.apiBase}/categories?limit=9999`,
    );
    categories.value = data.value?.data.data || [];
  }
});
