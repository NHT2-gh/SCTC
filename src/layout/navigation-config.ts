// CMS Navigation Configuration
// For original TailAdmin navigation reference, see _nav.template.ts

import { APP_ROUTES } from "@/config/app-routes";
import { Menu, NavItem } from "@/types/nav";

// Main navigation items for CMS
const NavItems: NavItem[] = [
  {
    icon: "grid",
    name: "Overview",
    path: APP_ROUTES.ADMIN.BASE,
    role: ["super_admin"],
  },
  {
    icon: "package",
    name: "Ingredients",
    path: APP_ROUTES.ADMIN.INGREDIENTS.LIST(),
    subItems: [
      { name: "Ingredients List", path: APP_ROUTES.ADMIN.INGREDIENTS.LIST() },
      { name: "Add Ingredients", path: APP_ROUTES.ADMIN.INGREDIENTS.ADD() },
    ],
    role: ["admin"],
  },
  {
    icon: "listOrdered",
    name: "Recipes",
    path: APP_ROUTES.ADMIN.RECIPES.DRINK_RECIPES(),
    subItems: [
      {
        name: "Recipe",
        path: APP_ROUTES.ADMIN.RECIPES.DRINK_RECIPES(),
      },
      {
        name: "Component Recipes",
        path: APP_ROUTES.ADMIN.RECIPES.COMPONENTS_RECIPES(),
      },
    ],
    role: ["admin"],
  },
  {
    icon: "coffee",
    name: "Product",
    path: APP_ROUTES.ADMIN.PRODUCTS.ADD(),
    role: ["admin"],
    subItems: [{ name: "Add Product", path: APP_ROUTES.ADMIN.PRODUCTS.ADD() }],
  },
  {
    icon: "task",
    name: "Menu",
    path: APP_ROUTES.ADMIN.MENUS.BASE,
    subItems: [
      {
        name: "Menus",
        path: APP_ROUTES.ADMIN.MENUS.BASE,
      },
    ],
    role: ["admin"],
  },

  {
    icon: "receipt",
    name: "Orders",
    path: APP_ROUTES.ADMIN.ORDER.BASE,
    subItems: [
      {
        name: "Order List",
        path: APP_ROUTES.ADMIN.ORDER.BASE,
      },
    ],
    role: ["admin"],
  },
];

// CMS Sidebar Configuration
export const NavigationConfig: Menu = {
  main: {
    title: "BASE",
    items: NavItems,
  },
};
