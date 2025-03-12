"use client";

import { cn } from "@/lib/utils";
import { TimeFrame } from "../../types";
interface TimeFrameNavProps {
  activeTimeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export function TimeFrameNav({
  activeTimeFrame,
  onTimeFrameChange,
}: TimeFrameNavProps) {
  const timeFrames: TimeFrame[] = ["daily", "weekly", "monthly"];

  return (
    <nav className="flex flex-wrap gap-4 p-4">
      {timeFrames.map((timeFrame) => (
        <button
          key={timeFrame}
          onClick={() => onTimeFrameChange(timeFrame)}
          className={cn(
            "px-6 py-2 border transition-colors capitalize rounded-xl text-sm font-styrene-a-thin-trial",
            activeTimeFrame === timeFrame
              ? "border-red-500 text-red-600 bg-red-300/10"
              : "border-burntSienna text-darkbrownText hover:border-burntSienna/70 hover:text-darkbrownText"
          )}
        >
          {timeFrame}
        </button>
      ))}
    </nav>
  );
}
