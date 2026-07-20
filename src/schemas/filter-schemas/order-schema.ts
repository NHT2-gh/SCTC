import { FilterItemConfig } from "@/components/filter/filter-box-render/type";

export const orderFilterConfig: FilterItemConfig[] = [
  {
    type: "date-range",
    key: "created_at",
    label: "Ngày đặt đơn",
    range: ["", ""],
  },
];
