export enum StoreStatusType {
  opening = "opening",
  closed = "closed",
  break = "break",
}
export interface StoreSetting {
  id: string;
  status: StoreStatusType;
  time_start: string;
  time_end: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}
