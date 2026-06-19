import { ArrowLeft, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NavigationBarProps {
  backHref: string;
}

export default function NavigationBar({ backHref }: NavigationBarProps) {
  return (
    <nav className="w-full fixed top-0 p-2 flex items-center justify-between">
      <Link href={backHref}>
        <button className="bg-[#FFFFFF1A] size-9 aspect-square flex justify-center items-center rounded-lg">
          <ArrowLeft color="white" size={16} />
        </button>
      </Link>

      <button className="">
        <EllipsisVertical color="white" size={20} />
      </button>
    </nav>
  );
}
