import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SendTransactionForm from "../transaction/send-transaction-form";
import TransactionHistory from "../transaction/transaction-history";

interface FirstTransactionStepProps {
  balance: number;
}

export default function FirstTransactionStep({
  balance,
}: FirstTransactionStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-lg text-slate-600">
        Now that your wallet is funded, let&apos;s send your first transaction
        on the Solana network.
      </p>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send SOL</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        <TabsContent value="send" className="pt-4">
          <SendTransactionForm balance={balance} />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <TransactionHistory />
        </TabsContent>
      </Tabs>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-700">Transaction Tips</AlertTitle>
        <AlertDescription className="text-blue-600">
          <ul className="list-disc pl-5 space-y-1">
            <li>Double-check the recipient address before sending</li>
            <li>Transactions on Solana are fast (under 1 second) and cheap</li>
            <li>All transactions are permanent and cannot be reversed</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
