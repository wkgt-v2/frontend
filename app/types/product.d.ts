export interface Category {
  category_id: number;
  category_name: string;
  category_code: string;
  category_image: string;
  category_description: null | string;
  category_instruction: string;
  category_main: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface Image {
  product_image_id: number;
  image_url: string;
  is_main: boolean;
}

export interface Item {
  product_id: number;
  product_name: string;
  product_code: string;
  category_id: number;
  series_id: number;
  product_description: string;
  product_detail: null | string;
  product_info: null | string;
  product_marketplace: {
    shopee: string;
    tokopedia: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  category: {
    category_id: number;
    category_name: string;
  };
  series: {
    series_id: number;
    series_name: string;
  };
  specifications: {
    spec_id: number;
    product_id: number;
    spec_type: string;
    spec_value: string;
    created_at: string;
    updated_at: string;
  }[];
  images: Image[];
}

export interface Series {
  series_id: number;
  series_name: string;
  series_code: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}
