"use client";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container min-h-screen flex items-center justify-center font-delagothic">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Oops!</h1>
        <p className="text-gray-600 font-itim">{error.message}</p>
        <Button className="min-w-[6.25rem]" onClick={() => reset()}>
          Thử lại
        </Button>
      </div>
    </div>
  );
}
