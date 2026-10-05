import Image from "next/image";

export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Ghulam Qadir Logo"
      width={size}
      height={size}
      priority
      className={`object-contain ${className || ""}`}
    />
  );
}
