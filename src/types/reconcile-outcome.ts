export enum ImportBatchStatus {
  Completed = "completed",
  CompletedWithErrors = "completed_with_errors",
}

export enum ReconcileOutcomeStatus {
  InvalidImportData = "invalid_import_data",
  InvalidPaidAmount = "invalid_paid_amount",
  SourceMismatch = "source_mismatch",
  Unmatched = "unmatched",
  AlreadyVerified = "already_verified",
  UnsupportedClaimStatus = "unsupported_claim_status",
  InvalidPoints = "invalid_points",
  InvalidClaimPhone = "invalid_claim_phone",
  AlreadyCredited = "already_credited",
  CustomerCreateFailed = "customer_create_failed",
  Verified = "verified",
}

export interface ReconcileLoyaltyImportBatchResult {
  batchId: string;
  status: ImportBatchStatus;
  totalRows: number;
  matchedRows: number;
  verifiedClaims: number;
  rejectedClaims: number;
  unmatchedRows: number;
  errorCount: number;
  outcomes: ReconcileOutcome[];
}

interface OutcomeBase {
  // Có thể null nếu orderNumber trong dữ liệu import bị thiếu.
  orderNumber: string | null;
}

export interface InvalidImportDataOutcome extends OutcomeBase {
  status: ReconcileOutcomeStatus.InvalidImportData;
}

export interface InvalidPaidAmountOutcome extends OutcomeBase {
  status: ReconcileOutcomeStatus.InvalidPaidAmount;
}

export interface SourceMismatchOutcome extends OutcomeBase {
  status: ReconcileOutcomeStatus.SourceMismatch;
}

export interface UnmatchedOutcome extends OutcomeBase {
  status: ReconcileOutcomeStatus.Unmatched;
}

export interface ClaimOutcomeBase extends OutcomeBase {
  claimId: string;
}

export interface AlreadyVerifiedOutcome extends ClaimOutcomeBase {
  status: ReconcileOutcomeStatus.AlreadyVerified;
}

export interface UnsupportedClaimStatusOutcome extends ClaimOutcomeBase {
  status: ReconcileOutcomeStatus.UnsupportedClaimStatus;
}

export interface InvalidPointsOutcome extends ClaimOutcomeBase {
  status: ReconcileOutcomeStatus.InvalidPoints;
  points: number;
}

export interface InvalidClaimPhoneOutcome extends ClaimOutcomeBase {
  status: ReconcileOutcomeStatus.InvalidClaimPhone;
}

export interface AlreadyCreditedOutcome extends ClaimOutcomeBase {
  status: ReconcileOutcomeStatus.AlreadyCredited;
}

export interface CustomerCreateFailedOutcome extends ClaimOutcomeBase {
  status: ReconcileOutcomeStatus.CustomerCreateFailed;
}

export interface VerifiedOutcome extends ClaimOutcomeBase {
  customerId: string;
  status: ReconcileOutcomeStatus.Verified;
  points: number;
}

export type ReconcileOutcome =
  | InvalidImportDataOutcome
  | InvalidPaidAmountOutcome
  | SourceMismatchOutcome
  | UnmatchedOutcome
  | AlreadyVerifiedOutcome
  | UnsupportedClaimStatusOutcome
  | InvalidPointsOutcome
  | InvalidClaimPhoneOutcome
  | AlreadyCreditedOutcome
  | CustomerCreateFailedOutcome
  | VerifiedOutcome;
