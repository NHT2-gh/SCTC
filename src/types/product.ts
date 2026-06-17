import { SelectedOption } from "./cart";
import { MenuItem } from "./menu";

export interface ProductDetail {
  info: MenuItem;
  options: SelectedOption[];
}
