import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PremiumCardProps = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

export function PremiumCard({
  children,
  className,
  padded = true,
  ...props
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        "premium-shadow soft-ring rba-panel animate-card-in rounded-[24px]",
        padded && "p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
