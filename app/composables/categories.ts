import type { Category } from "~/types/product";

export const useCategories = () => {
  const categories = useState<Category[]>("categories");
  return categories;
}
