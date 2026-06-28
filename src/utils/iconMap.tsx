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
} from "lucide-react";

export const iconMap = {
  package: PackageIcon,
  grid: Grid2X2,
  boxCube: BoxIcon,
  task: FileText,
  receipt: ReceiptIcon,
  coffee: CoffeeIcon,
  listOrdered: ListOrderedIcon,
  "modal-alert-success": IcModalAlertSuccessIcon,
  "modal-alert-info": IcModalAlertInfoIcon,
  "modal-alert-warning": IcModalAlertWarningIcon,
  "modal-alert-danger": IcModalAlertDangerIcon,
} as const;

export type IconKey = keyof typeof iconMap;

export function getIcon(iconKey: string) {
  const IconComponent = iconMap[iconKey as IconKey];
  return IconComponent || Grid; // Fallback to GridIcon if not found
}
