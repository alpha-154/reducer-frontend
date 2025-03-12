"use client";

import { useState } from "react";

import { TimeFrameNav } from "./_daily/_components/time-frame-nav";

import { TimeFrame } from "./types";
import Daily from "./_daily";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";


export default function TodoApp() {
  const {
    userId
  } = useSelector((state: RootState) => state.user);
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>("daily");

  return (
    <div className="h-fit bg-albasterInnerBg">
      <h1 className="text-2xl md:text-3xl text-brownText font-styrene-a-thin-trial text-center">
        Task Manager
      </h1>
      <div className="max-w-md md:max-w-2xl  mx-auto p-4">
        <div className="w-full flex items-center justify-center">
          <TimeFrameNav
            activeTimeFrame={activeTimeFrame}
            onTimeFrameChange={setActiveTimeFrame}
          />
          
        </div>
        {activeTimeFrame === "daily" ? (
            <Daily userId={userId} />
          ) : (
            <div>Not implemented yet</div>
          )}
      </div>
    </div>
  );
}
