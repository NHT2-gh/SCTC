// CMS Navigation Configuration
// For original TailAdmin navigation reference, see _nav.template.ts

import { APP_ROUTES } from "@/config/app-routes";
import { Menu, NavItem } from "@/types/nav";

// Main navigation items for CMS
const NavItems: NavItem[] = [
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

  {
    icon: "task",
    name: "Menu",
    path: APP_ROUTES.ADMIN.MENUS.BASE,
    role: ["admin"],
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
    path: APP_ROUTES.ADMIN.RECIPES.PRODUCT_RECIPES(),
    subItems: [
      {
        name: "Product Recipes",
        path: APP_ROUTES.ADMIN.RECIPES.PRODUCT_RECIPES(),
      },
      {
        name: "Component Recipes",
        path: APP_ROUTES.ADMIN.RECIPES.COMPONENTS_RECIPES(),
      },
    ],
    role: ["admin"],
  },
  // {
  //   icon: "coffee",
  //   name: "Product",
  //   path: APP_ROUTES.ADMIN.PRODUCTS.ADD(),
  //   role: ["admin"],
  //   subItems: [{ name: "Add Product", path: APP_ROUTES.ADMIN.PRODUCTS.ADD() }],
  // },
  {
    icon: "customers",
    name: "Customers",
    path: APP_ROUTES.ADMIN.CUSTOMERS.BASE,
    role: ["admin"],
  },
  {
    icon: "coupon",
    name: "Promotions",
    path: APP_ROUTES.ADMIN.PROMOTIONS.BASE,
    subItems: [
      {
        name: "Promotions List",
        path: APP_ROUTES.ADMIN.PROMOTIONS.BASE,
      },
      {
        name: "Add Promotion",
        path: APP_ROUTES.ADMIN.PROMOTIONS.ADD(),
      },
    ],
    role: ["admin"],
  },

  {
    icon: "setting",
    name: "Overview",
    path: APP_ROUTES.ADMIN.BASE,
    role: ["admin", "super_admin"],
  },
];

// CMS Sidebar Configuration
export const NavigationConfig: Menu = {
  main: {
    title: "BASE",
    items: NavItems,
  },
};
