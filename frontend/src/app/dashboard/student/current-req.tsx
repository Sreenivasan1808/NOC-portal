"use client";
import React from 'react';
import MultiStepProgress from '@/components/progress-bar';
import Progress from '@/components/progress';

export default function CurrentRequest(){
  const [step, setStep] = React.useState(1);
  const steps = [
    { key: 'start', label: 'Student' },
    { key: 'design', label: 'Faculty Advisor Approved' },
    { key: 'build', label: 'Department Representatives approved' },
  ];

  return (
    <div className="p-6 w-full mx-auto flex justify-center items-center">
      {/* <MultiStepProgress
        steps={steps}
        currentStep={step}
        onStepChange={(i)=>setStep(i)}
        size="md"
      /> */}

      <Progress steps={steps} currentStep={step} progress={25}/>

      {/* <div className="mt-6 flex gap-2">
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} className="px-3 py-1 rounded bg-slate-100">Back</button>
        <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} className="px-3 py-1 rounded bg-slate-800 text-white">Next</button>
      </div> */}
    </div>
  );
}
