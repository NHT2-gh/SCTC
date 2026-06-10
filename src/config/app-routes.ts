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
      TYPE: (type: MenuType) => `${APP_ROUTES.ADMIN.MENUS.BASE}/${type}`,
      DETAIL: (type: MenuType, id: string) =>
        `${APP_ROUTES.ADMIN.MENUS.TYPE(type)}/${id}`,
    },
  },
};
