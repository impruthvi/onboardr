import { useState } from "react";
import { Copy, CheckCircle, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWallet } from "@solana/wallet-adapter-react";
import { requestAirdrop, getWalletBalance } from "@/lib/solana";

interface WalletDisplayProps {
  balance: number;
  setBalance: (balance: number) => void;
}

export default function WalletDisplay({
  balance,
  setBalance,
}: WalletDisplayProps) {
  const { publicKey } = useWallet();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  // get actual address from wallet
  const address = publicKey
    ? publicKey.toBase58()
    : "0x1234567890abcdef1234567890abcdef12345678";

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const requestAirdropHandler = async () => {
    setLoading(true);
    const airdrop = await requestAirdrop(address, 1);

    const walletBalance = await getWalletBalance(address);

    if (airdrop) {
      setBalance(walletBalance);
    } else {
      alert("Airdrop failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-xl font-medium mb-4">Your Wallet</h3>

      <div className="flex items-center justify-between p-3 bg-slate-50 rounded mb-4">
        <div className="font-mono text-sm text-slate-600 truncate">
          {address}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                {copiedAddress ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copiedAddress ? "Copied!" : "Copy address"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-between items-center p-3 bg-indigo-50 rounded">
        <div>
          <div className="text-sm text-slate-500">Balance</div>
          <div className="text-xl font-bold">{balance} SOL</div>
        </div>
        <div>
          <Button
            onClick={requestAirdropHandler}
            disabled={loading || balance > 0}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : balance > 0 ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Funded
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Request Airdrop
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
