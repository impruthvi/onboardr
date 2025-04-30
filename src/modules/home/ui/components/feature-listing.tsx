import { FeatureCard } from "./feature-card";
import { Award, Coins, Send, Share2, Wallet, Zap } from "lucide-react";

export const FeatureListing = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
        Everything you need to get started
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Wallet className="h-10 w-10 text-indigo-600" />}
          title="Create Your Wallet"
          description="Connect or create a new Solana wallet securely through popular providers like Phantom."
        />
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-indigo-600" />}
          title="Instant Funding"
          description="Get testnet SOL with a single click to start exploring transactions right away."
        />
        <FeatureCard
          icon={<Send className="h-10 w-10 text-indigo-600" />}
          title="Send & Receive"
          description="Learn to transfer SOL with an intuitive interface designed for beginners."
        />
        <FeatureCard
          icon={<Coins className="h-10 w-10 text-indigo-600" />}
          title="Custom Tokens"
          description="Mint and manage your own tokens using Solana's powerful Token Extensions."
        />
        <FeatureCard
          icon={<Share2 className="h-10 w-10 text-indigo-600" />}
          title="Blinks Integration"
          description="Launch dApps or transactions directly from shared links, showcasing Solana's composability."
        />
        <FeatureCard
          icon={<Award className="h-10 w-10 text-indigo-600" />}
          title="Interactive Learning"
          description="Follow an interactive guide with helpful tooltips and visuals every step of the way."
        />
      </div>
    </section>
  );
};
