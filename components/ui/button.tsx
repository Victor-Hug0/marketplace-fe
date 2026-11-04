import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "border-action bg-action text-action-ink",
  secondary: "border-line bg-surface text-ink",
  danger: "border-danger bg-surface text-danger",
} as const;

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-9 items-center justify-center rounded-sm border px-4 font-semibold ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
