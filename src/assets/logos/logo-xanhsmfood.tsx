import { IconComponentProps } from "@/types/common";
import Image from "next/image";
import React from "react";

export default function LogoXanhSMFood({ ...props }: IconComponentProps) {
  return (
    <Image
      unoptimized
      src={"/images/logos-platform/logo-greensmfood.webp"}
      width={props.size || 24}
      height={props.size || 24}
      alt={"Logo XanhSMFood"}
      className={props.className}
    />
  );
}
