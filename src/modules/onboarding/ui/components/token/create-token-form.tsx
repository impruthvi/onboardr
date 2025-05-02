import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateTokenForm() {
  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-medium mb-2">
        Create New Token
      </h3>

      <div className="space-y-2">
        <Label htmlFor="tokenName">Token Name</Label>
        <Input id="tokenName" placeholder="My Awesome Token" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tokenSymbol">Token Symbol</Label>
        <Input id="tokenSymbol" placeholder="MAT" maxLength={5} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tokenSupply">Initial Supply</Label>
        <Input
          id="tokenSupply"
          type="number"
          placeholder="1000000"
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="decimals">Decimals</Label>
        <Input
          id="decimals"
          type="number"
          placeholder="9"
          min="0"
          max="9"
          value="9"
        />
        <p className="text-xs text-slate-500">
          Standard Solana tokens use 9 decimals
        </p>
      </div>

      <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
        Create Token
      </Button>
    </div>
  );
}