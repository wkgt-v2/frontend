import type { User } from "~/types";

export default defineNuxtRouteMiddleware((to, from) => {
  const localePath = useLocalePath();
  const path = to.path;
  const pathName = to.name as string;
  const user = useState<User>("user");

  if (pathName.startsWith("cms")) {
    const token = useToken();
    if (!token.value && path !== localePath("cms-login")) {
      return navigateTo(localePath("cms-login"));
    }
  }
});
