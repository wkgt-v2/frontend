export interface BlogArticle {
  blog_article_id: number;
  blog_category_id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  published_at: null | string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  category: BlogCategory;
}

export interface BlogCategory {
  blog_category_id: number;
  blog_category_name: string;
  blog_category_slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}
