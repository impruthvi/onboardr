"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl text-indigo-600">Onboardr</span>
        </div>
        <div className="flex items-center gap-4">
          <WalletMultiButton className="bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white py-2 px-4 transition-colors" />
        </div>
      </div>
    </header>
  );
};
