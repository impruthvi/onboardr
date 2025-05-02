import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ConnectWalletStep from "./steps/connect-wallet-step";
import GetTestnetSolStep from "./steps/get-testnet-sol-step";
import FirstTransactionStep from "./steps/first-transaction-step";
import CreateTokenStep from "./steps/create-token-step";

interface StepContainerProps {
  currentStep: number;
  totalSteps: number;
  prevStep: () => void;
  nextStep: () => void;
  connected: boolean;
  balance: number;
  setBalance: (balance: number) => void;
}

export default function StepContainer({
  currentStep,
  totalSteps,
  prevStep,
  nextStep,
  connected,
  balance,
  setBalance,
}: StepContainerProps) {
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Connect Your Wallet";
      case 1:
        return "Get Testnet SOL";
      case 2:
        return "Send Your First Transaction";
      case 3:
        return "Create Your Own Token";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ConnectWalletStep connected={connected} />;
      case 1:
        return <GetTestnetSolStep balance={balance} setBalance={setBalance} />;
      case 2:
        return <FirstTransactionStep balance={balance} />;
      case 3:
        return <CreateTokenStep />;
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
      </CardHeader>

      <CardContent className="p-6">{renderStepContent()}</CardContent>

      <CardFooter className="flex justify-between p-6 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>

        <Button
          onClick={nextStep}
          disabled={
            currentStep === totalSteps - 1 || (currentStep === 0 && !connected)
          }
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
