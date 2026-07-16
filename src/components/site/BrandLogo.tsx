import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <img
      src="/healthy-grins-logo.svg"
      alt="Healthy Grins Dental Clinic"
      className={cn(
        "block h-auto shrink-0 object-contain",
        compact ? "w-28 sm:w-36" : "w-40 sm:w-48",
        className,
      )}
    />
  );
}
