import React, { ReactNode } from "react";

interface TableTitleProps {
  title: string;
  subTitle?: string;
  children?: ReactNode;
}

export default function TableTitle({
  title,
  subTitle,
  children,
}: TableTitleProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
      <div className="hidden md:block xl:shrink-0">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subTitle}</p>
      </div>

      <div className="w-full flex items-center justify-end gap-3.5 relative">
        {children}
      </div>
    </div>
  );
}
