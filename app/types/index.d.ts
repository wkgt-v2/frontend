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
