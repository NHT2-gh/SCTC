import { mutationKeys } from "@/config/mutation-keys";
import { customerService } from "@/services/customer.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoyaltyClaimValidationType } from "@/schemas/validation/customer-service.validation";
import { queryKeys } from "@/config/query-keys";
import { GetParams } from "@/types/common";
import { LoyaltyImportBatch } from "@/types/customer";

export function useLoyaltyClaim() {
  return useMutation({
    mutationKey: mutationKeys.customerService.loyaltyClaim,
    mutationFn: (data: LoyaltyClaimValidationType) =>
      customerService.submitLoyaltyClaim(data),
  });
}

export function useLoyaltyImportBatches(
  params?: GetParams<LoyaltyImportBatch>,
) {
  return useQuery({
    queryKey: queryKeys.loyalty.importBatches(params),
    queryFn: () => customerService.loyaltyImportBatches(),
  });
}
