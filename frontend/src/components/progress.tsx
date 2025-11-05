"use client"

const Progress = ({
  progress,
}: {
  progress: number
}) => {
  const steps = [
    { label: "Student", percent: 25 },
    { label: "Faculty Advisor", percent: 50 },
    { label: "Departments", percent: 75 },
  ]

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* Progress bar with filled background */}
        <div className="relative">
          {/* Background track */}
          <div className="h-3  rounded-full overflow-hidden">
            {/* Filled progress */}
            <div
              className="h-full bg-gradient-to-r from-accent to-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = progress > step.percent - 25
              const isCurrent = progress >= step.percent - 25 && progress < step.percent

              return (
                <div key={step.label} className="flex flex-col items-center">
                  {/* Step circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      isCompleted
                        ? "bg-accent text-white shadow-lg"
                        : isCurrent
                          ? "bg-white border-2 border-accent text-accent shadow-md"
                          : "bg-white border-2 border-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step labels */}
        <div className="flex justify-between w-full text-center">
          {steps.map((step) => (
            <div key={step.label} className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Progress
