"use client";
import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading = false,
  className,
  ...props
}) => {
  const baseStyles =
    "font-semibold py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
    ghost: "text-gray-600 hover:underline",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
