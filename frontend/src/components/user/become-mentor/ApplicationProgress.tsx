// src/components/mentor-application/ApplicationProgress.tsx
import { Progress } from "@/components/ui/progress";

interface ApplicationProgressProps {
  step: number;
  totalSteps: number;
}

export function ApplicationProgress({ step, totalSteps }: ApplicationProgressProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span>Application Progress</span>
        <span>
          Step {step} of {totalSteps}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}