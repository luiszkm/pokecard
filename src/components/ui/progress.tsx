"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow",
      className
    )}
    
    {...props}
  >
     <AnimatePresence>
      <ProgressPrimitive.Indicator asChild>
        <motion.div>
          <motion.div
            className="absolute h-full bg-slate-800"
            style={{ width: `${value}%` }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 2,
              type: 'spring',
              stiffness: 25
            }}
          />
        </motion.div>
      </ProgressPrimitive.Indicator>
    </AnimatePresence>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
