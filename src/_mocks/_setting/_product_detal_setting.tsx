import { ProductType } from "@/types/menu";
import { OrderStatus } from "@/types/order";

type OptionFixedType = "sweet" | "ice" | "alcoholic";

export const allOptionFixedType: OptionFixedType[] = [
  "sweet",
  "ice",
  "alcoholic",
];

const fixedOptionType: Record<keyof typeof ProductType, OptionFixedType[]> = {
  food: [],
  coffee: ["sweet", "ice"],
  cocktail: ["alcoholic"],
  matcha: ["sweet", "ice"],
  houjicha: ["sweet", "ice"],
  tea: ["sweet", "ice"],
  cacao: ["sweet", "ice"],
};

export const _product_setting = {
  quantity: {
    min: 1,
    max: 10,
  },

  fixedOptions: fixedOptionType,

  processOrder: {
    [OrderStatus.PENDING]: {
      label: "Pending",
      color: "#e7e9e5",
      value: 0,
    },
    [OrderStatus.CONFIRMED]: {
      label: "Confirmed",
      color: "#d7f2f8",
      value: 1,
    },
    [OrderStatus.PREPARING]: {
      label: "Preparing",
      color: "#89cff0",
      value: 2,
    },
    [OrderStatus.READY]: {
      label: "Ready for pickup",
      color: "#f9c74f",
      value: 3,
    },
    [OrderStatus.DONE]: {
      label: "Done",
      color: "#43aa8b",
      value: 4,
    },
    [OrderStatus.COMPLETED]: {
      label: "Completed",
      color: "#90be6d",
      value: 5,
    },
    [OrderStatus.CANCELLED]: {
      label: "Cancelled",
      color: "#f94144",
      value: 6,
    },
  },
};
