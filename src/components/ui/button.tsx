import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utilities/ui"

const buttonVariants = cva(
  // Base: layout, typography, interactivity, svg handling
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:drop-shadow-sm",
  {
    variants: {
      variant: {
        // Solid primary — embossed with darkened inner ring via color-mix
        default: [
          "bg-primary text-primary-foreground text-shadow-sm",
          "shadow-md shadow-black/15",
          "border-[0.5px] border-white/10 dark:border-transparent",
          "ring-1 ring-(--btn-ring)",
          "[--btn-ring:color-mix(in_oklab,black_15%,var(--color-primary))]",
          "dark:[--btn-ring:color-mix(in_oklab,white_15%,var(--color-primary))]",
          "hover:bg-primary/90",
        ],
        // Solid destructive — same emboss technique, destructive palette
        destructive: [
          "bg-destructive text-white text-shadow-sm",
          "shadow-md shadow-black/15",
          "border-[0.5px] border-white/10 dark:border-transparent",
          "ring-1 ring-(--btn-ring)",
          "[--btn-ring:color-mix(in_oklab,black_20%,var(--color-destructive))]",
          "dark:[--btn-ring:color-mix(in_oklab,white_15%,var(--color-destructive))]",
          "hover:bg-destructive/90",
        ],
        // Card-surface outline — actual border so it stays within the box model
        outline: [
          "bg-card text-foreground",
          "shadow-sm shadow-black/10",
          "border border-foreground/10 dark:border-foreground/15",
          "hover:bg-muted/50 dark:hover:bg-muted/50",
        ],
        // Secondary — same card-surface treatment on secondary bg
        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-sm shadow-black/10",
          "border border-foreground/10 dark:border-foreground/15",
          "hover:bg-secondary/80",
        ],
        // Ghost — no chrome, just hover fill
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link — inline text style
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs:      "h-7 px-2.5 text-xs rounded",
        sm:      "h-8 px-3 text-xs rounded-md",
        default: "h-9 px-4 py-2",
        lg:      "h-10 px-5 rounded-md",
        xl:      "h-11 px-6 rounded-md text-base",
        icon:    "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
