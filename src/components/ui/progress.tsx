"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 10, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator 
     className={`h-full w-0 flex-1 transition-all animate-delay-300
       bg-slate-800 animate-duration-1000 animate-fade-right animate-once animate-ease-in`}
    style={{ width: `${value}%` }}
      >
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress }
