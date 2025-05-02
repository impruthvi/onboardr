import { StepButton } from "@/modules/onboarding/ui/components/stem-button";

interface StepButtonProps {
  number: number;
  title: string;
  disabled: boolean;
}

interface StepNavigationProps {
  stepButtons: StepButtonProps[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function StepNavigation({
  stepButtons,
  currentStep,
  setCurrentStep,
}: StepNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {stepButtons.map((step) => (
        <StepButton
          key={step.number}
          number={step.number}
          title={step.title}
          active={currentStep === step.number}
          completed={currentStep > step.number}
          onClick={() => !step.disabled && setCurrentStep(step.number)}
          disabled={step.disabled}
        />
      ))}
    </div>
  );
}
