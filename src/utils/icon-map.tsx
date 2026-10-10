import {
  IcModalAlertDangerIcon,
  IcModalAlertSuccessIcon,
  IcModalAlertInfoIcon,
  IcModalAlertWarningIcon,
} from "@/assets/svgs";

import {
  BoxIcon,
  CoffeeIcon,
  FileText,
  Grid,
  Grid2X2,
  ListOrderedIcon,
  PackageIcon,
  ReceiptIcon,
  SettingsIcon,
  Ticket,
  Users2Icon,
} from "lucide-react";

export const iconMap = {
  package: PackageIcon,
  grid: Grid2X2,
  boxCube: BoxIcon,
  task: FileText,
  receipt: ReceiptIcon,
  coffee: CoffeeIcon,
  listOrdered: ListOrderedIcon,
  setting: SettingsIcon,
  coupon: Ticket,
  customers: Users2Icon,

  "modal-alert-success": IcModalAlertSuccessIcon,
  "modal-alert-info": IcModalAlertInfoIcon,
  "modal-alert-warning": IcModalAlertWarningIcon,
  "modal-alert-danger": IcModalAlertDangerIcon,

  instagram: PackageIcon,
  threads: PackageIcon,
  tiktok: PackageIcon,
  phone: PackageIcon,
  mail: PackageIcon,
  mapPin: PackageIcon,
} as const;

export type IconKey = keyof typeof iconMap;

export function getIcon(iconKey: string) {
  const IconComponent = iconMap[iconKey as IconKey];
  return IconComponent || Grid; // Fallback to GridIcon if not found
}
