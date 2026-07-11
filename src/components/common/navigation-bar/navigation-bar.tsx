import { delagothic } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NavigationBarProps {
  backHref: string | (() => void) | null;
  title?: string;
  className?: string;
}

export default function NavigationBar({
  backHref,
  title,
  className,
}: NavigationBarProps) {
  return (
    <nav
      className={cn(
        "w-full sticky z-20 top-0 p-2 flex items-center justify-between [&_button]:text-white",
        className,
      )}
    >
      {typeof backHref === "string" ? (
        <Link href={backHref}>
          <button className="bg-[#FFFFFF1A] size-9 aspect-square flex justify-center items-center rounded-lg">
            <ArrowLeft size={16} />
          </button>
        </Link>
      ) : typeof backHref === "function" ? (
        <button
          onClick={() => backHref()}
          className="bg-[#FFFFFF1A] size-9 aspect-square flex justify-center items-center rounded-lg"
        >
          <ArrowLeft size={16} />
        </button>
      ) : (
        <button
          className="bg-[#FFFFFF1A] size-9 aspect-square flex justify-center items-center rounded-lg"
          onClick={() => backHref}
        >
          <ArrowLeft size={16} />
        </button>
      )}

      {title && (
        <h1 className={cn(delagothic.className, "grow text-center")}>
          {title}
        </h1>
      )}

      {/* <button className="bg-[#FFFFFF1A] size-9 aspect-square flex justify-center items-center rounded-lg">
        <EllipsisVertical size={20} />
      </button> */}
    </nav>
  );
}
