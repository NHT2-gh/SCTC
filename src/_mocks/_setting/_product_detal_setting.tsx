import { ProductType } from "@/types/product";
import { OrderStatus } from "@/types/order";
import { OptionType } from "@/types/menu";

export const allOptionFixedType: OptionType[] = [
  OptionType.sweet,
  OptionType.ice,
  OptionType.alcoholic,
];

const fixedOptionType: Record<keyof typeof ProductType, OptionType[]> = {
  food: [],
  coffee: [OptionType.sweet, OptionType.ice],
  cocktail: [OptionType.alcoholic],
  matcha: [OptionType.sweet, OptionType.ice],
  houjicha: [OptionType.sweet, OptionType.ice],
  tea: [OptionType.sweet, OptionType.ice],
  cacao: [OptionType.sweet, OptionType.ice],
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
