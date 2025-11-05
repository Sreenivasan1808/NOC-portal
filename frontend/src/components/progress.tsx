import { Check } from "lucide-react";
import React from "react";

const Progress = ({
  progress,
}: {
  // steps: { key: string; label: string }[];
  // currentStep: number;
  progress: number;
}) => {
  const bg1 = progress > 25 ? "bg-primary" : "bg-accent";
  const bg2 = progress > 50 ? "bg-primary" : "bg-accent";
  const bg3 = progress > 75 ? "bg-primary" : "bg-accent";
  return (
    <div className="w-full md:w-[75%]">
      <div className="min-w-full bg-accent/80 rounded-lg h-2.5 relative">
        <div
          className="bg-primary h-2.5 rounded-lg absolute z-0"
          style={{ width: `${progress}%` }}
        ></div>

        {/* dots centered on the bar at 25%, 50%, 75% */}
        <div
          className={`absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full ${bg1} z-10`}
        >
          {bg1 == "bg-primary" && <Check size={24} />}
        </div>
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full ${bg2} z-10`}
        >
          {bg2 == "bg-primary" && <Check size={24} />}
        </div>
        <div
          className={`absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full ${bg3} z-10`}
        >
          {" "}
          {bg3 == "bg-primary" && <Check size={24} />}
        </div>
      </div>
      <div className="flex justify-evenly text-center p-4">
        <p>Student</p>
        <p className="text-center">
          Faculty <br />
          advisor
        </p>
        <p>Departments</p>
      </div>
    </div>
  );
};

export default Progress;
