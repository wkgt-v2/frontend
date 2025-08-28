import type { User } from "~/types";

export const useUser = () => {
  const user = useState<User>("user");
  return user;
}
