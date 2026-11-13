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
    <div className="mb-6 flex w-full items-start justify-between sm:mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex w-full min-w-0 flex-1 items-start justify-center">
          {index !== 0 && (
            <div
              className={`mx-1 mt-5 h-px flex-1 transition-all sm:mx-2 ${
                currentStep > step.id ? 'bg-lnd-accent dark:bg-lnd-accent' : 'bg-lnd-surface-2 dark:bg-lnd-surface-2'
              }`}
            />
          )}
          <div className="flex min-w-0 flex-col items-center">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-semibold transition-all ${
                currentStep >= step.id
                  ? 'bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:text-lnd-accent-fg'
                  : 'bg-lnd-surface-2 text-lnd-fg-muted dark:bg-lnd-surface-2 dark:text-lnd-fg-muted'
              }`}
            >
              {currentStep > step.id ? (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <p className="mt-2 w-full max-w-20 text-center text-[0.68rem] font-medium leading-tight text-lnd-fg-muted dark:text-lnd-fg-muted sm:text-xs lg:w-auto lg:max-w-none lg:text-sm lg:whitespace-nowrap">
              {step.title}
            </p>
          </div>
          {index !== steps.length - 1 && (
            <div
              className={`mx-1 mt-5 h-px flex-1 transition-all sm:mx-2 ${
                currentStep > step.id ? 'bg-lnd-accent dark:bg-lnd-accent' : 'bg-lnd-surface-2 dark:bg-lnd-surface-2'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}