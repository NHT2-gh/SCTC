import { SelectedOption } from "./cart";
import { MenuItem } from "./menu";

export interface ProductDetail {
  info: MenuItem;
  options: {
    custom: SelectedOption[];
    fixed: SelectedOption[];
  };
  is_allow_order: boolean;
}
