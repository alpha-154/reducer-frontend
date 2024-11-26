import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-boneInnerBg bg-transparent px-3 py-1 text-sm md:text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium file:text-burntSienna placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-burntSienna disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
