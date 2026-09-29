import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-2.5 text-base font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-rotary text-white hover:bg-rotary-dark shadow-soft",
        gold: "bg-gold text-navy hover:bg-gold-dark shadow-soft",
        outline: "border-2 border-rotary text-rotary hover:bg-rotary-light",
        "outline-light": "border-2 border-white text-white hover:bg-white/15",
        ghost: "text-rotary hover:bg-rotary-light",
        white: "bg-white text-rotary hover:bg-rotary-light",
      },
      size: { default: "", sm: "min-h-10 px-4 py-2 text-sm", lg: "min-h-12 px-8 text-lg" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";

/** Link styled as a button. Uses <a> for external/mailto/file URLs, next/link for internal routes. */
export function ButtonLink({ href, variant, size, className, children, onClick, ...rest }: { href: string; className?: string; children: React.ReactNode; onClick?: () => void } & VariantProps<typeof buttonVariants> & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(buttonVariants({ variant, size }), className);
  const external = /^(https?:|mailto:|tel:)/.test(href) || href.endsWith(".pdf") || href.endsWith(".ics") || href.includes("/ics");
  if (external) {
    const isWeb = href.startsWith("http");
    return <a href={href} className={cls} onClick={onClick} {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>{children}</a>;
  }
  return <Link href={href} className={cls} onClick={onClick} {...rest}>{children}</Link>;
}
