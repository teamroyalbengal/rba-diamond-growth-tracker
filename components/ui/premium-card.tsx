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
        "premium-shadow soft-ring animate-card-in rounded-[22px] bg-card/95",
        padded && "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
