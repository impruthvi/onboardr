import { Info, ExternalLink, CheckCircle } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConnectWalletStepProps {
  connected: boolean;
}

export default function ConnectWalletStep({
  connected,
}: ConnectWalletStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-lg text-slate-600">
        To get started with Solana, you&apos;ll need a wallet. You can either
        connect an existing wallet or create a new one.
      </p>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-700">
          What is a Solana wallet?
        </AlertTitle>
        <AlertDescription className="text-blue-600">
          A Solana wallet is your gateway to the Solana blockchain. It stores
          your private keys and allows you to interact with dApps, send and
          receive SOL and other tokens.
        </AlertDescription>
      </Alert>

      <div className="bg-indigo-50 p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4 text-indigo-700">
          Connect your wallet
        </h3>
        <div className="flex justify-center mb-6">
          <WalletMultiButton className="bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white py-3 px-6 text-lg transition-colors" />
        </div>
        <p className="text-slate-600 text-center">
          Don&apos;t have a wallet yet? We recommend{" "}
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-medium"
          >
            Phantom Wallet <ExternalLink className="h-4 w-4 inline" />
          </a>
        </p>
      </div>

      {connected && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-700">Wallet Connected!</AlertTitle>
          <AlertDescription className="text-green-600">
            Great job! Your wallet is now connected. You can proceed to the next
            step.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
