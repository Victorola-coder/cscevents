import React, { Fragment } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

export const DialogContent = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[85vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DialogHeader = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

export const DialogTitle = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={clsx("text-xl font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

export const DialogDescription = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p className={clsx("text-sm text-gray-500 mt-1", className)} {...props}>
      {children}
    </p>
  );
};

export const DialogFooter = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx("flex justify-end gap-3 mt-6", className)} {...props}>
      {children}
    </div>
  );
};

export default Dialog;
