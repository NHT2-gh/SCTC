import React from "react";
import Input, { InputProps } from "./Input";
import { EyeClosed, EyeIcon } from "lucide-react";

export default function PasswordInput({ ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        placeholder="Enter your password"
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
      >
        {showPassword ? (
          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
        ) : (
          <EyeClosed className="fill-gray-500 dark:fill-gray-400" />
        )}
      </span>
    </div>
  );
}
