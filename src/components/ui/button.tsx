import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utilities/ui"

const buttonVariants = cva(
  // Base: layout, typography, interactivity, svg handling
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-base font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:drop-shadow-sm [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out",
  {
    variants: {
      variant: {
        // Solid primary — flat, sharp corners, text left / icon right
        default: [
          "bg-primary text-primary-foreground",
          "justify-start",
          "[&_svg]:ml-auto [&_svg]:box-content",
          "hover:bg-foreground",
          "hover:[&_svg]:translate-x-0.5",
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
          "bg-background text-foreground",
          "justify-start",
          "[&_svg]:ml-auto [&_svg]:box-content",
          "border border-foreground dark:border-foreground/15",
          "hover:bg-foreground hover:text-background dark:hover:bg-primary",
          "hover:[&_svg]:translate-x-0.5",
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
        xs: "h-7 px-2.5 text-xs min-w-20",
        sm: "h-8 px-3 text-xs min-w-28",
        default: "h-10 px-4 py-2 min-w-36",
        lg: "h-12 px-5 text-lg min-w-44",
        xl: "h-15 px-6 text-lg min-w-52",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-11 w-11",
      },
    },
    compoundVariants: [
      // Icon left-padding scales with size for variants that pin the icon to the right
      { variant: "default",  size: "xs",      class: "[&_svg]:pl-2" },
      { variant: "default",  size: "sm",      class: "[&_svg]:pl-3" },
      { variant: "default",  size: "default", class: "[&_svg]:pl-4" },
      { variant: "default",  size: "lg",      class: "[&_svg]:pl-6" },
      { variant: "default",  size: "xl",      class: "[&_svg]:pl-8" },
      { variant: "outline",  size: "xs",      class: "[&_svg]:pl-2" },
      { variant: "outline",  size: "sm",      class: "[&_svg]:pl-3" },
      { variant: "outline",  size: "default", class: "[&_svg]:pl-4" },
      { variant: "outline",  size: "lg",      class: "[&_svg]:pl-6" },
      { variant: "outline",  size: "xl",      class: "[&_svg]:pl-8" },
    ],
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
