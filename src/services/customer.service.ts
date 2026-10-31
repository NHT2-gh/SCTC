import { handlePostgresError } from "@/lib/error/postgres-error";
import { LoyaltyClaimValidationType } from "@/schemas/validation/customer-service.validation";
import { supabase } from "@/supabase/supabaseClients";
import {
  GetParams,
  LoyaltySourceMapCode,
  ResponseStandard,
} from "@/types/common";
import {
  Customer,
  LoyaltyClaimResponse,
  LoyaltyImportBatch,
} from "@/types/customer";

class CustomerService {
  private customerTable: string;
  private loyaltyImportBatchesTable: string;
  private submitLoyaltyClaimRpc: string;
  constructor() {
    this.customerTable = "customers";
    this.loyaltyImportBatchesTable = "loyalty_import_batches";
    this.submitLoyaltyClaimRpc = "submit_loyalty_claim";
  }

  async getAllCustomers(
    params?: GetParams<Customer>,
  ): Promise<ResponseStandard<Customer[]>> {
    const query = supabase.from(this.customerTable).select("*");

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

  async submitLoyaltyClaim(
    data: LoyaltyClaimValidationType,
  ): Promise<ResponseStandard<LoyaltyClaimResponse>> {
    const query = supabase.rpc(this.submitLoyaltyClaimRpc, {
      p_phone: data.phone_number,
      p_order_number: data.order_number,
      p_source: data.source,
    });

    const { data: result, error } = await query;

    if (error) handlePostgresError(error);

    return {
      data: result as LoyaltyClaimResponse,
      success: true,
    };
  }

  async loyaltyImportBatches(params?: GetParams<LoyaltyImportBatch>) {
    const query = supabase.from(this.loyaltyImportBatchesTable).select("*");
    const { data, error } = await query;
    if (error) handlePostgresError(error);
    return {
      data: data || [],
      success: true,
    };
  }
}
export const customerService = new CustomerService();
