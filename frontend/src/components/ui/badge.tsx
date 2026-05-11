import { cn } from "@/lib/utils";

type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "indigo"
  | "ai"
  | "gray"
  | "pro"
  | "pro-plus"
  | "pro-max";

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  success:  "badge-success",
  warning:  "badge-warning",
  error:    "badge-error",
  info:     "badge-info",
  indigo:   "badge-indigo",
  ai:       "badge-ai",
  gray:     "badge-gray",
  "pro":    "badge-pro",
  "pro-plus": "badge-pro-plus",
  "pro-max":  "badge-pro-max",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "gray", className, children }: BadgeProps) {
  return (
    <span className={cn(VARIANT_CLASS[variant], className)}>
      {children}
    </span>
  );
}
