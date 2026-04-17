import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textLinkVariants = cva(
  "text-link inline-flex items-center gap-1.5 font-label uppercase tracking-[0.18em] text-xs",
  {
    variants: {
      tone: {
        default: "text-parchment hover:text-champagne",
        gold: "text-champagne hover:text-cream",
        muted: "text-muted-foreground hover:text-champagne",
      },
      size: {
        sm: "text-[10px] tracking-[0.2em]",
        default: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "default",
    },
  },
);

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface TextLinkProps
  extends Omit<AnchorProps, "href">, VariantProps<typeof textLinkVariants> {
  href: string;
  asChild?: boolean;
  external?: boolean;
}

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    { className, tone, size, href, external, asChild, children, ...props },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(textLinkVariants({ tone, size }), className)}
          ref={ref as React.Ref<HTMLElement>}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(textLinkVariants({ tone, size }), className)}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(textLinkVariants({ tone, size }), className)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
TextLink.displayName = "TextLink";

export { TextLink, textLinkVariants };
