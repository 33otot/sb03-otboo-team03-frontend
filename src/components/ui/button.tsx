import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // 기본 스타일 - 프로젝트 커스텀과 shadcn/ui 표준 병합
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-[var(--font-weight-bold)] text-[var(--font-size-body-1)] tracking-[-0.45px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // 🔥 프로젝트 커스텀 variants (기존 코드 호환성)
        primary:
          "bg-green-600 text-white hover:bg-green-700 disabled:bg-[var(--color-gray-200)] disabled:text-[var(--color-gray-400)] rounded-[12px]",
        secondary:
          "bg-white border border-[var(--color-gray-300)] text-[var(--color-gray-600)] hover:bg-[var(--color-gray-50)] disabled:bg-[var(--color-gray-100)] disabled:text-[var(--color-gray-400)] rounded-[12px]",
        ghost:
          "bg-transparent text-[var(--color-green-500)] hover:bg-[var(--color-green-100)] disabled:text-[var(--color-gray-400)] rounded-[12px]",
        
        // 🎯 shadcn/ui 표준 variants (AlertDialog 등 호환성)
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive rounded-md",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground rounded-md",
        link: 
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // 🔥 프로젝트 커스텀 sizes (기존 코드 호환성)  
        default: "h-[46px] px-[18px] py-2.5",
        sm: "h-8 px-3 py-1.5 text-[var(--font-size-body-3)]",
        lg: "h-12 px-6 py-3",
        
        // 🎯 shadcn/ui 표준 sizes
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary", // 프로젝트 기본값 유지
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
