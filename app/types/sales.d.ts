export interface Activity {
  activity_id: number;
  lead_id: number;
  salesperson_id: number;
  activity_type: ActivityType;
  activity_notes: null | string;
  follow_up_date: string;
  audit_status: "pending" | "approved" | "rejected";
  audit_notes: null | string;
  audited_at: string;
  audited_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export type ActivityType = "Call" | "Chat" | "Visit" | "Demo" | "Follow Up";

export interface Lead {
  lead_id: number;
  date_in: string;
  lead_source: string;
  customer_name: string;
  contact_person: string;
  phone: string;
  address: string;
  area: string;
  category: string;
  status: LeadStatus;
  notes: null | string;
  salesperson_id: number;
  closed_date: null | string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  activities: Activity[];
  salesperson: {
    user_id: number;
    user_username: string;
  };
  last_activity: ActivityType;
  follow_up_date: string;
}

export type LeadStatus = "New" | "Qualified" | "Contacted" | "Follow Up" | "Quotation" | "Negotiation" | "Won" | "Lost";
