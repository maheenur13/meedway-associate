import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[11px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-ink hover:brightness-110 active:scale-[0.98] shadow-sm shadow-accent/20",
        dark: "bg-ink text-paper hover:opacity-90 active:scale-[0.98]",
        outline:
          "border border-line-2 bg-transparent text-ink hover:bg-black/[0.03] active:scale-[0.98]",
        ghost: "text-ink hover:bg-black/[0.04]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-12 px-6 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ComponentProps<typeof Link>, "className" | "children" | "href"> & {
    href: string;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant, size, className, children } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link href={href as any} className={classes} {...(rest as any)}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
