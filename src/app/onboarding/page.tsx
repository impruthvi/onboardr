"use client";

import { useState } from "react";
import { Header } from "@/modules/home/ui/components/header";
import ProgressTracker from "@/modules/onboarding/ui/components/progress-tracker";
import StepNavigation from "@/modules/onboarding/ui/components/step-navigation";
import StepContainer from "@/modules/onboarding/ui/components/step-container";
import { useWallet } from "@solana/wallet-adapter-react";

export default function OnboardingPage() {
  const { connected } = useWallet();
  const [currentStep, setCurrentStep] = useState(connected ? 1 : 0);
  const [balance, setBalance] = useState(0);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const STEP_BUTTONS = [
    { number: 0, title: "Connect Wallet", disabled: false },
    { number: 1, title: "Get Testnet SOL", disabled: !connected },
    { number: 2, title: "First Transaction", disabled: !connected },
    { number: 3, title: "Create a Token", disabled: !connected },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <ProgressTracker
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          />

          <StepNavigation
            stepButtons={STEP_BUTTONS}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />

          <StepContainer
            currentStep={currentStep}
            totalSteps={totalSteps}
            prevStep={prevStep}
            nextStep={nextStep}
            connected={connected}
            balance={balance}
            setBalance={setBalance}
          />
        </div>
      </main>
    </div>
  );
}
