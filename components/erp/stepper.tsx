import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Vertical layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={index} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn("mt-1 h-6 w-0.5 rounded", isCompleted ? "bg-primary" : "bg-muted")} />
                )}
              </div>
              <div className="flex flex-col pb-2">
                <span
                  className={cn(
                    "text-sm font-medium leading-none",
                    isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
                {step.description && <span className="mt-1 text-xs text-muted-foreground">{step.description}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex items-center gap-2 lg:gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "whitespace-nowrap text-sm font-medium",
                      isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="hidden text-xs text-muted-foreground lg:block">{step.description}</span>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1 rounded lg:mx-4", isCompleted ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
