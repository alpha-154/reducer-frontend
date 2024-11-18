import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full text-lg md:text-xl rounded-xl border border-input bg-colors-custom-orange-thin px-3 py-2  shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-colors-custom-orange disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      style={{
        resize: "none",
        overflowY: "auto",
      }}
      rows={1}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
