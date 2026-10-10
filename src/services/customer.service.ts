import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { GetParams, ResponseStandard } from "@/types/common";
import { Customer } from "@/types/customer";

class CustomerService {
  private tableName: string;
  constructor() {
    this.tableName = "customers";
  }

  async getAllCustomers(
    params?: GetParams<Customer>,
  ): Promise<ResponseStandard<Customer[]>> {
    const query = supabase.from(this.tableName).select("*");

    if (params) {
      if (params.searchText) {
        query.ilike("name", `%${params.searchText}%`);
      }

      if (params.page && params.limit) {
        query.range(
          (params.page - 1) * params.limit,
          params.page * params.limit - 1,
        );
      }
    }

    const { data, error } = await query;

    if (error) handlePostgresError(error);

    return {
      data: data || [],
      success: true,
    };
  }
}
export const customerService = new CustomerService();
