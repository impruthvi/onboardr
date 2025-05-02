import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CreateTokenForm from "../token/create-token-form";

export default function CreateTokenStep() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-slate-600">
        Create your own token using Solana&apos;s powerful Token Extensions.
        This feature allows anyone to mint and manage their own tokens.
      </p>

      <CreateTokenForm />

      <Alert className="bg-purple-50 border-purple-200">
        <Info className="h-5 w-5 text-purple-500" />
        <AlertTitle className="text-purple-700">
          About Token Extensions
        </AlertTitle>
        <AlertDescription className="text-purple-600">
          Solana&apos;s Token Extensions allow you to add advanced functionality
          to your tokens, such as transfer fees, non-transferability, and more.
          This is an advanced feature unique to Solana.
        </AlertDescription>
      </Alert>
    </div>
  );
}
