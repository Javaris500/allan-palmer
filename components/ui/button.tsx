import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-all duration-300 ease-cinematic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:opacity-80 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        gold: "bg-gold text-gold-foreground hover:bg-gold/90",
        // Editorial — wide-tracked small-caps on flat gold.
        // Used for primary conversion CTAs (Book, Donate, Sign In).
        editorial:
          "bg-gold text-gold-foreground font-label uppercase tracking-[0.2em] text-xs hover:bg-champagne hover:text-ink rounded-sm",
        // Champagne outline — secondary editorial CTA, hairline border.
        "editorial-outline":
          "border border-champagne/40 bg-transparent text-champagne font-label uppercase tracking-[0.2em] text-xs hover:bg-champagne/10 hover:border-champagne rounded-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-base",
        // Editorial CTA — wider padding, airier proportions.
        editorial: "h-12 px-10 py-4",
        icon: "h-10 w-10",
        // FAB — only place `rounded-full` is allowed in the editorial system.
        fab: "h-14 w-14 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
