interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex w-full justify-between items-start mb-8 overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start justify-center flex-1 w-full">
          {index !== 0 && (
            <div
              className={`flex-1 h-px mx-2 mt-5 transition-all ${
                currentStep > step.id ? 'bg-lnd-accent dark:bg-lnd-accent' : 'bg-lnd-surface-2 dark:bg-lnd-surface-2'
              }`}
            />
          )}
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= step.id
                  ? 'bg-lnd-accent dark:bg-lnd-accent text-lnd-accent-fg dark:text-lnd-accent-fg'
                  : 'bg-lnd-surface-2 dark:bg-lnd-surface-2 text-lnd-fg-muted dark:text-lnd-fg-muted'
              }`}
            >
              {currentStep > step.id ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <p className="text-xs lg:text-sm w-20 lg:w-auto font-medium text-lnd-fg-muted dark:text-lnd-fg-muted mt-2 text-center text-wrap lg:text-nowrap">
              {step.title}
            </p>
          </div>
          {index !== steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 mt-5 transition-all ${
                currentStep > step.id ? 'bg-lnd-accent dark:bg-lnd-accent' : 'bg-lnd-surface-2 dark:bg-lnd-surface-2'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}