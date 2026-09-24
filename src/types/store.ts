export enum StoreStatusType {
  opening = "opening",
  closed = "closed",
  break = "break",
}

export interface StoreStatus {
  id: number;
  status: StoreStatusType;
  time_start: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  time_end?: string;
}

export interface Table {
  id: string;
  name: string;
  qr_token: string;
  is_active: boolean;
  created_at: string;
}
