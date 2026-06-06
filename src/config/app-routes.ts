// Application routes for the CMS

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
      COMPONENTS_RECIPES: () => `${APP_ROUTES.ADMIN.BASE}/recipes/components`,
      DRINK_RECIPES: () => `${APP_ROUTES.ADMIN.BASE}/recipes/drinks`,
    },
  },
};
