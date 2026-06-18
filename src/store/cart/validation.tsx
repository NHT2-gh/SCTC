import { CartItem } from "@/types/cart";
import { OptionType } from "@/types/menu";

export type CartValidationIssue =
  | {
      type: "MENU_ITEM_UNAVAILABLE";
      menu_item_id: string;
    }
  | {
      type: "OPTION_REMOVED";
      option_id: string;
    }
  | {
      type: "OPTION_DISABLED";
      option_id: string;
    }
  | {
      type: "OPTION_LIMIT_EXCEEDED";
      option_type: OptionType;
    };

export interface CartValidationResult {
  is_valid: boolean;

  issues: CartValidationIssue[];

  repaired_items: CartItem[];
}
