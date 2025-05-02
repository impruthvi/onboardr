import { Info, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WalletDisplay from "../transaction/wallet-display";

interface GetTestnetSolStepProps {
  balance: number;
  setBalance: (balance: number) => void;
}

export default function GetTestnetSolStep({
  balance,
  setBalance,
}: GetTestnetSolStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-lg text-slate-600">
        Before you can start using Solana, you&apos;ll need some SOL to pay for
        transactions. Let&apos;s get some free testnet SOL to practice with.
      </p>

      <WalletDisplay balance={balance} setBalance={setBalance} />

      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-amber-700">Good to know</AlertTitle>
        <AlertDescription className="text-amber-600">
          Testnet SOL has no real-world value and is only used for testing.
          You&apos;re using Solana&apos;s testnet environment, a sandbox for
          developers and learners.
        </AlertDescription>
      </Alert>

      {balance > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-700">
            Funding Successful!
          </AlertTitle>
          <AlertDescription className="text-green-600">
            Your wallet now has {balance} SOL. You can now proceed to sending
            your first transaction.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
