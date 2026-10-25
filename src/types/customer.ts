import { LoyaltySource } from "./common";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  points_balance: number;
  created_at?: string;
  updated_at?: string;
}
export interface LoyaltyClaim {
  id: string;
  phone_number: string;
  order_code: string;
  source: LoyaltySource;
  created_at?: string;
  updated_at?: string;
}
export interface LoyaltyClaimResponse {
  success: boolean;
  claim_id: string;
  status: string;
  message: string;
  error_code?: string;
}

export interface LoyaltyImportBatch {
  id: string;
  source: LoyaltySource;
  file_name: string;
  file_hash: string;
  status: ImportStatus;
  total_rows: number;
  matched_rows: number;
  verified_claims: number;
  rejected_claims: number;
  unmatched_rows: number;
  error_message: string;
  started_at: string;
  completed_at: string;
  created_at?: string;
}

export enum ImportStatus {
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  COMPLETED_WITH_ERRORS = "completed_with_errors",
}
