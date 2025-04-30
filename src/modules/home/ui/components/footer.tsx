import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Wallet className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-xl text-white">Onboardr</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <a
              href="#"
              className="text-slate-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Button
              variant="outline"
              className="border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white"
            >
              Contribute
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
          <p>Built for the Solana community. Open source and free to use.</p>
        </div>
      </div>
    </footer>
  );
};
