import { cn } from "@/lib/utils";
import React, { FC, ReactNode, FormEvent } from "react";

interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}

export default function Form({ onSubmit, children, className }: FormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // Prevent default form submission
        onSubmit(event);
      }}
      className={cn(
        "grid gap-5 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(500px,1fr))]",
        className,
      )} // Default spacing between form fields
    >
      {children}
    </form>
  );
}
