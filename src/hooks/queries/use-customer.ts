import { queryKeys } from "@/config/query-keys";
import { customerService } from "@/services/customer.service";
import { GetParams } from "@/types/common";
import { Customer } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";

export function useGetAllCustomer(params?: GetParams<Customer>) {
  return useQuery({
    queryKey: queryKeys.customer.getAll(),
    queryFn: () => customerService.getAllCustomers(params),
  });
}
