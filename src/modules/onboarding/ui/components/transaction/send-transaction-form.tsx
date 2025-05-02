import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SendTransactionFormProps {
  balance: number;
}

export default function SendTransactionForm({
  balance,
}: SendTransactionFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient Address</Label>
        <Input id="recipient" placeholder="Enter a Solana address..." />
        <p className="text-xs text-slate-500">
          The wallet address that will receive the SOL
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (SOL)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.1"
          step="0.1"
          min="0.001"
          max={balance}
        />
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Transaction fee: ~0.000005 SOL</span>
          <span className="text-slate-500">Balance: {balance} SOL</span>
        </div>
      </div>

      <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
        <Send className="mr-2 h-4 w-4" />
        Send Transaction
      </Button>
    </div>
  );
}
