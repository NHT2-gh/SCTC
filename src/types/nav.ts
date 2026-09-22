import { IconKey } from "@/utils/icon-map";
import { SystemRole } from "./common";

// Navigation
export interface NavItem {
  name: string;
  icon: IconKey;
  path?: string;
  subItems?: SubMenu[];
  new?: boolean;
  role?: (keyof typeof SystemRole)[];
}

export interface SubMenu {
  pro?: boolean;
  new?: boolean;
  name: string;
  path: string;
}

export interface Menu {
  [key: string]: {
    title: string;
    items: NavItem[];
  };
}
