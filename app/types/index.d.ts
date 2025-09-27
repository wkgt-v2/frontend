export interface RolePermission {
  permission_id: number;
  permission_name: string;
  permission_group: string;
}

export interface ServiceCenter {
  headquarter_id: number;
  province: string;
  city: string;
  address: string;
  phone: string;
  open_hour: string;
  closed_hour: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface ServiceOrder {
  service_order_id: number;
  no_resi: string;
  product_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: null | string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  product: {
    product_id: number;
    product_name: string;
    product_code: string;
    category: {
      category_id: number;
      category_name: string;
    },
    series: {
      series_id: number;
      series_name: string;
    };
  };
}

export interface User {
  user_id: number;
  user_username: string;
  user_email: string;
  role: UserRole;
}

export interface UserRole {
  role_id: number;
  role_nama: string;
  role_permission: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
