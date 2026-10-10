// Application routes for the CMS

import { MenuType } from "@/types/menu";

export const APP_ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/login",
    SIGN_UP: "/auth/signup",
    RESET_PASSWORD: "/auth/reset-password",
  },

  ADMIN: {
    BASE: "/admin",
    INGREDIENTS: {
      LIST: () => `${APP_ROUTES.ADMIN.BASE}/ingredients`,
      ADD: () => `${APP_ROUTES.ADMIN.BASE}/ingredients/add`,
    },
    RECIPES: {
      BASE: "/admin/recipes",
      COMPONENTS_RECIPES: (componentId?: string) =>
        `${APP_ROUTES.ADMIN.RECIPES.BASE}/components${componentId ? `?component_id=${componentId}` : ""}`,
      PRODUCT_RECIPES: () => `${APP_ROUTES.ADMIN.RECIPES.BASE}/products`,
    },
    MENUS: {
      BASE: "/admin/menus",
      DETAIL: (id: string) => `${APP_ROUTES.ADMIN.MENUS.BASE}/${id}`,
      LAYOUTS: (menuId: string, type?: MenuType) =>
        !type
          ? `${menuId}/layouts`
          : `${APP_ROUTES.ADMIN.MENUS.DETAIL(menuId)}/layouts`,
      ITEMS: {
        DETAIL: (menuId: string, itemId: string) =>
          `${APP_ROUTES.ADMIN.MENUS.DETAIL(menuId)}/${itemId}`,
      },
    },
    PRODUCTS: {
      BASE: "/admin/products",
      ADD: () => `${APP_ROUTES.ADMIN.PRODUCTS.BASE}/add`,
    },
    ORDER: {
      BASE: "/admin/orders",
      ADD: () => `${APP_ROUTES.ADMIN.BASE}/orders/add`,
    },
    PROMOTIONS: {
      BASE: "/admin/promotions",
      ADD: () => `${APP_ROUTES.ADMIN.PROMOTIONS.BASE}/add`,
      UPDATE: (id: string) => `${APP_ROUTES.ADMIN.PROMOTIONS.BASE}/${id}`,
    },
    CUSTOMERS: {
      BASE: "./admin/customers",
    },
  },
  GUEST: {
    ROOT: "/",
    PRODUCT: {
      VIEW_DETAIL: (id: string) => `/${id}`,
    },
    CART: {
      VIEW: "/cart",
    },
    CHECKOUT: {
      VIEW: "/checkout",
    },
    ORDER: {
      VIEW: (trackingCode: string) => `/orders/${trackingCode}`,
    },
    TABLE: {
      BASE: "/tables",
      DETAIL: (token: string) => `${APP_ROUTES.GUEST.TABLE.BASE}/${token}`,
    },
  },
};
