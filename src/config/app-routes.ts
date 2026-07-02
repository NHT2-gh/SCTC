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
      // ID: {
      //   DETAIL: (id: string) =>
      //     `${APP_ROUTES.ADMIN.INGREDIENTS.LIST()}/${id}/detail`,
      //   EDIT: (id: string) =>
      //     `${APP_ROUTES.ADMIN.INGREDIENTS.LIST()}/${id}/edit`,
      // },
    },
    RECIPES: {
      BASE: "/admin/recipes",
      COMPONENTS_RECIPES: () => `${APP_ROUTES.ADMIN.RECIPES.BASE}/components`,
      DRINK_RECIPES: () => `${APP_ROUTES.ADMIN.RECIPES.BASE}/drinks`,
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
