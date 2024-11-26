import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full text-sm md:text-md rounded-xl border border-boneInnerBg bg-inputBg px-3 py-2  shadow-sm placeholder:text-darkbrownText focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-colors-custom-orange disabled:cursor-not-allowed disabled:opacity-50",
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
