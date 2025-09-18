export interface Banner {
  banner_id: number;
  banner_title: string;
  banner_image: string;
  banner_url: null | string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface BannerSchedule {
  schedule_id: number;
  banner_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  banner: null | Banner;
}

export interface SocialMedia {
  sm_id: number;
  sm_name: string;
  sm_icon: string;
  sm_url: string;
  sm_type: "social_media",
  created_at: string;
  updated_at: string;
}
