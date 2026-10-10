import { ErrorCode } from "@/lib/error/error-codes";
import { FilterValue } from "@/components/filter/filter-box-render/type";

// Other types used across the application
export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
}

export interface MutationResult {
  success: boolean;
  code?: string;
  message?: string;
}

export interface ResponseStandard<T> extends MutationResult {
  data: T;
  pagination?: Pagination;
}

export interface GetParams<T> {
  page?: number;
  limit?: number;
  searchText?: string;
  filters?: Record<keyof T | string, FilterValue>;
  orderBy?: { columnName: keyof T; asc: boolean };
}

export interface ServerActionResponse<T> {
  data: T;
  success: boolean;
  error: {
    code?: ErrorCode;
    message: string;
  } | null;
}

export enum SystemRole {
  super_admin = "Quản trị cấp cao",
  admin = "Quản trị viên",
  user = "Người dùng",
}

export type ItemStateMap = Map<
  string,
  {
    isEditting?: boolean;
    isDeleting?: boolean;
    isSuccess?: boolean;
    message?: string;
  }
>;
