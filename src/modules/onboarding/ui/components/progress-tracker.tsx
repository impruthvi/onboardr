import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
    currentStep: number;
    totalSteps: number;
    progress: number;
}

const  ProgressTracker = ({ currentStep, totalSteps, progress }: ProgressTrackerProps) =>{
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Your Onboarding Progress</h2>
        <span className="text-indigo-600 font-medium">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

export default ProgressTracker;