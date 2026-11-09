import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "blush";
type Size = "md" | "lg";

export function buttonStyles({
  variant = "primary",
  size = "lg",
  full = false,
  className,
}: {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
}): string {
  const shape =
    variant === "ghost"
      ? "h-11 px-2 text-sm font-bold normal-case tracking-normal text-violet underline-offset-4 hover:underline"
      : cn(
          "uppercase",
          size === "lg" ? "h-14 px-6 text-sm" : "h-11 px-4 text-xs",
        );

  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-center font-extrabold tracking-[0.06em] transition-[transform,background-color,box-shadow] duration-150",
    "disabled:pointer-events-none disabled:opacity-45",
    full && "w-full",
    shape,
    variant === "primary" &&
      "bg-violet text-white shadow-[0_4px_0_#3A2270] hover:bg-[#4C2D96] active:translate-y-1 active:shadow-none",
    variant === "secondary" &&
      "border-2 border-ink bg-white text-ink shadow-[0_4px_0_#DCCBFF] hover:bg-mist active:translate-y-1 active:shadow-none",
    variant === "blush" &&
      "bg-blush text-ink shadow-[0_4px_0_#E7A8CC] hover:bg-[#FFD8F0] active:translate-y-1 active:shadow-none",
    variant === "ghost" && "bg-transparent",
    className,
  );
}

type Common = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = Common & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button(props: ButtonProps | LinkProps) {
  if ("href" in props && props.href) {
    const { href, variant, size, full, className, children, ...rest } = props;
    return (
      <Link
        href={href}
        className={buttonStyles({ variant, size, full, className })}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const { variant, size, full, className, children, type, ...rest } =
    props as ButtonProps;
  return (
    <button
      type={type ?? "button"}
      className={buttonStyles({ variant, size, full, className })}
      {...rest}
    >
      {children}
    </button>
  );
}
