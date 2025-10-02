import type { User } from "~/types";
import type { HttpSuccess } from "~/types/http";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { companySettings } = useCompanySettings();
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

    /* Restrict non-superadmin routing */
    if (!useSuperadmin()) {
      const unrestrictedRoute = ["cms-dashboard", "cms-sales"];
      if (!unrestrictedRoute.some(r => pathName.startsWith(r))) {
        return localePath("cms-dashboard");
      }
    }
  }

  if (!companySettings.value) {
    /* TODO: remove headers */
    const { data } = await useFetch<HttpSuccess<Record<string, string>>>(
      `${config.public.apiBase}/company-settings/format`,
      { headers: { ...bearer } },
    );
    console.log(data.value)
    if (data.value) companySettings.value = data.value.data;
  }
});
