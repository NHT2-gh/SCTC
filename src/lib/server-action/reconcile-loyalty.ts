import { API_ROUTES } from "@/config/api-routes";

export async function serverActionReconcileLoyalty(formData: FormData) {
  const response = await fetch(API_ROUTES.ADMIN.LOYALTY.RECONCILE.IMPORT, {
    method: "POST",
    body: formData,
  });
  return response;
}
