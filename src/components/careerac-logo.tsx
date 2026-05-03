import Image from "next/image";
import { cn } from "@/lib/utils";

interface CareerAcLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function CareerAcLogo({
  width = 168,
  height = 34,
  className,
  priority,
}: CareerAcLogoProps) {
  const logoStyle = {
    height: `${height}px`,
    width: "auto",
  };

  return (
    <span className="inline-flex items-center">
      <span className="sr-only">CareerAC</span>
      <Image
        src="/logos/careerac-logo-icon.svg"
        alt=""
        width={width}
        height={height}
        priority={priority}
        style={logoStyle}
        className={cn("block dark:hidden", className)}
      />
      <Image
        src="/logos/careerac-logo-icon-dark.svg"
        alt=""
        width={width}
        height={height}
        priority={priority}
        style={logoStyle}
        className={cn("hidden dark:block", className)}
      />
    </span>
  );
}
