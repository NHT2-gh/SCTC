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
      className={` ${className}`} // Default spacing between form fields
    >
      {children}
    </form>
  );
}
