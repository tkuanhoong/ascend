import { AlertTriangle, CheckCircleIcon, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ModalForm } from "../form/modal-form";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full gap-x-2",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-yellow-600",
        success: "bg-emerald-200/80 border-emerald-30 text-emerald-600",
        danger: "bg-red-200/80 border-red-30 text-red-600",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface AlertBannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
  reason?: string | null;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
  danger: X,
};

export const AlertBanner = ({ label, variant, reason }: AlertBannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 " /> {label}
      {reason && (
        <ModalForm
          title="Reason"
          trigger={<p className="underline hover:cursor-pointer">Why?</p>}
        >
          <div>{reason}</div>
        </ModalForm>
      )}
    </div>
  );
};
