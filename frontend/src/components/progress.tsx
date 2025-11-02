import React from "react";

const Progress = ({
  steps,
  currentStep,
  progress,
}: {
  steps: { key: string; label: string }[];
  currentStep: number;
  progress: number;
}) => {
  return (
    <div className="md:w-[75%]">
      <div className="min-w-full bg-accent/80 rounded-lg h-2.5 relative">
        <div
          className="bg-primary h-2.5 rounded-lg absolute z-0"
          style={{ width: `${progress}%` }}
        ></div>

        {/* dots centered on the bar at 25%, 50%, 75% */}
        <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full bg-accent z-10" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full bg-accent z-10" />
        <div className="absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full bg-accent z-10" />
      </div>
      <div className="flex justify-evenly text-center p-4">
        <p>Student</p>
        <p>Faculty</p>
        <p>Dept Rep</p>
      </div>
    </div>
  );
};

export default Progress;
