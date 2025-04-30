"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FeatureListing } from "./feature-listing";
import { Progress } from "@/components/ui/progress";
import { StepCard } from "./step-card";
import { STEP_CARDS } from "../../constants";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const router = useRouter();

  const startOnboarding = () => {
    router.push("/onboarding");
  };
  return (
    <main className="flex-1">
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Solana, made simple.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12">
          Onboardr guides you step-by-step through creating, funding, and using
          your first Solana wallet. Start your Web3 journey in minutes.
        </p>
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6"
          onClick={startOnboarding}
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features */}
      <FeatureListing />

      {/* Onboarding Preview */}
      <section className="bg-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Your onboarding journey
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Progress Tracker
                </h3>
                <Progress value={0} className="h-2 mb-4" />

                {STEP_CARDS.map((step) => (
                  <StepCard
                    key={step.number}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    active={step.active}
                  />
                ))}

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Begin Step 1
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
