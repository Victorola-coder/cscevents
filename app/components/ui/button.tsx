import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  noDefault?: boolean;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "danger"
    | "google"
    | "ghost"
    | "outline"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export default function Button(props: ButtonProps) {
  const {
    loading,
    noDefault,
    className,
    onClick,
    children,
    disabled,
    size = "default",
    variant = "default",
    asChild,
    ...prop
  } = props;

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={clsx(
        !noDefault &&
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md",
        {
          // Size variants
          "h-10 px-4 py-2 text-sm": size === "default",
          "h-9 px-3 py-2 text-xs rounded-md": size === "sm",
          "h-11 px-8 py-3 text-base rounded-md": size === "lg",
          "h-10 w-10 p-0": size === "icon",

          // Color and style variants
          "bg-primary text-primary-foreground hover:bg-primary/90":
            variant === "default" || variant === "primary",
          "bg-secondary text-secondary-foreground hover:bg-secondary/90":
            variant === "secondary",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90":
            variant === "danger",
          "bg-[#4285F4] text-white hover:bg-[#4285F4]/90": variant === "google",
          "bg-transparent hover:bg-muted text-text-primary":
            variant === "ghost",
          "border border-input bg-background text-foreground hover:bg-accent":
            variant === "outline",
          "p-0 h-auto underline-offset-4 hover:underline text-primary bg-transparent":
            variant === "link",
        },
        className
      )}
      aria-busy={loading ? true : false}
      {...prop}
    >
      <div
        className={clsx("flex items-center justify-center gap-2", {
          "w-full h-full": true,
          "flex-1": size === "icon",
        })}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
      </div>
    </button>
  );
}

// For convenience, also export a named Button component
export { Button };
