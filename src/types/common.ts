import { FilterValue } from "@/components/filter/filter-box-render/type";

// Other types used across the application
export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
}

export interface MutationResult {
  success: boolean;
  message?: string;
}

export interface ResponseStandard<T> extends MutationResult {
  data: T;
  pagination?: Pagination;
}

export interface GetWithFilterParams {
  page?: number;
  limit?: number;
  searchText?: string;
  filters?: Record<string, FilterValue>;
}

export interface ServerActionResponse<T> extends MutationResult {
  data: T;
  error: string | Error | null;
}

export enum SystemRole {
  super_admin = "Quản trị cấp cao",
  admin = "Quản trị viên",
  user = "Người dùng",
}
