"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/components/ui";

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  size,
  className,
  disabled,
  name,
  value,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm";
  className?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending || disabled}
      className={cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className)}
    >
      {pending && <Loader2 className="spin h-4 w-4" />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
