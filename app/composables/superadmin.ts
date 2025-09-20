import type { User } from "~/types";

export const useSuperadmin = () => {
  const user = useState<User | null>("user");
  return user.value?.role.role_nama === "superadmin";
}
