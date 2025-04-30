"use client";

import { useState } from "react";
import {
  Zap,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Info,
  ExternalLink,
  Copy,
  RefreshCw,
} from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/modules/home/ui/components/header";
import { StepButton } from "@/modules/onbording/ui/components/stem-button";

export default function OnboardingPage() {

  const { connected, publicKey } = useWallet();
  const [currentStep, setCurrentStep] = useState(connected ? 1 : 0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // get actual address from wallet
  const address = publicKey
    ? publicKey.toBase58()
    : "0x1234567890abcdef1234567890abcdef12345678";

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const requestAirdrop = async () => {
    setLoading(true);
    // Simulate API call
    
    setTimeout(() => {
      setBalance(2);
      setLoading(false);
    }, 1500);
  };

  const STEP_BUTTONS = [
    { number: 0, title: "Connect Wallet", disabled: false },
    { number: 1, title: "Get Testnet SOL", disabled: !connected },
    { number: 2, title: "First Transaction", disabled: !connected },
    { number: 3, title: "Create a Token", disabled: !connected },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <Header />

      {/* Onboarding Container */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">Your Onboarding Progress</h2>
              <span className="text-indigo-600 font-medium">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {STEP_BUTTONS.map((step) => (
              <StepButton
                key={step.number}
                number={step.number}
                title={step.title}
                active={currentStep === step.number}
                completed={currentStep > step.number}
                onClick={() => !step.disabled && setCurrentStep(step.number)}
                disabled={step.disabled}
              />
            ))}
          </div>

          {/* Step Content */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">
                {currentStep === 0 && "Connect Your Wallet"}
                {currentStep === 1 && "Get Testnet SOL"}
                {currentStep === 2 && "Send Your First Transaction"}
                {currentStep === 3 && "Create Your Own Token"}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {/* Step 0: Connect Wallet */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <p className="text-lg text-slate-600">
                    To get started with Solana, you&apos;ll need a wallet. You
                    can either connect an existing wallet or create a new one.
                  </p>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-5 w-5 text-blue-500" />
                    <AlertTitle className="text-blue-700">
                      What is a Solana wallet?
                    </AlertTitle>
                    <AlertDescription className="text-blue-600">
                      A Solana wallet is your gateway to the Solana blockchain.
                      It stores your private keys and allows you to interact
                      with dApps, send and receive SOL and other tokens.
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
                        Phantom Wallet{" "}
                        <ExternalLink className="h-4 w-4 inline" />
                      </a>
                    </p>
                  </div>

                  {connected && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <AlertTitle className="text-green-700">
                        Wallet Connected!
                      </AlertTitle>
                      <AlertDescription className="text-green-600">
                        Great job! Your wallet is now connected. You can proceed
                        to the next step.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Step 1: Get Testnet SOL */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <p className="text-lg text-slate-600">
                    Before you can start using Solana, you&apos;ll need some SOL
                    to pay for transactions. Let&apos;s get some free testnet
                    SOL to practice with.
                  </p>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-xl font-medium mb-4">Your Wallet</h3>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded mb-4">
                      <div className="font-mono text-sm text-slate-600 truncate">
                        {address}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyAddress}
                            >
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
                          onClick={requestAirdrop}
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

                  <Alert className="bg-amber-50 border-amber-200">
                    <Info className="h-5 w-5 text-amber-500" />
                    <AlertTitle className="text-amber-700">
                      Good to know
                    </AlertTitle>
                    <AlertDescription className="text-amber-600">
                      Testnet SOL has no real-world value and is only used for
                      testing. You&apos;re using Solana&apos;s testnet
                      environment, a sandbox for developers and learners.
                    </AlertDescription>
                  </Alert>

                  {balance > 0 && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <AlertTitle className="text-green-700">
                        Funding Successful!
                      </AlertTitle>
                      <AlertDescription className="text-green-600">
                        Your wallet now has {balance} SOL. You can now proceed
                        to sending your first transaction.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Step 2: First Transaction */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <p className="text-lg text-slate-600">
                    Now that your wallet is funded, let&apos;s send your first
                    transaction on the Solana network.
                  </p>

                  <Tabs defaultValue="send" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="send">Send SOL</TabsTrigger>
                      <TabsTrigger value="history">
                        Transaction History
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="send" className="pt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipient">Recipient Address</Label>
                          <Input
                            id="recipient"
                            placeholder="Enter a Solana address..."
                          />
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
                            <span className="text-slate-500">
                              Transaction fee: ~0.000005 SOL
                            </span>
                            <span className="text-slate-500">
                              Balance: {balance} SOL
                            </span>
                          </div>
                        </div>

                        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                          <Send className="mr-2 h-4 w-4" />
                          Send Transaction
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="history" className="pt-4">
                      <div className="text-center py-8 text-slate-500">
                        <p>No transactions yet.</p>
                        <p className="text-sm">
                          Complete your first transaction to see it here.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-5 w-5 text-blue-500" />
                    <AlertTitle className="text-blue-700">
                      Transaction Tips
                    </AlertTitle>
                    <AlertDescription className="text-blue-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Double-check the recipient address before sending
                        </li>
                        <li>
                          Transactions on Solana are fast (under 1 second) and
                          cheap
                        </li>
                        <li>
                          All transactions are permanent and cannot be reversed
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 3: Create Token */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <p className="text-lg text-slate-600">
                    Create your own token using Solana&apos;s powerful Token
                    Extensions. This feature allows anyone to mint and manage
                    their own tokens.
                  </p>

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

                  <Alert className="bg-purple-50 border-purple-200">
                    <Info className="h-5 w-5 text-purple-500" />
                    <AlertTitle className="text-purple-700">
                      About Token Extensions
                    </AlertTitle>
                    <AlertDescription className="text-purple-600">
                      Solana&apos;s Token Extensions allow you to add advanced
                      functionality to your tokens, such as transfer fees,
                      non-transferability, and more. This is an advanced feature
                      unique to Solana.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between p-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>

              <Button
                onClick={nextStep}
                disabled={
                  currentStep === totalSteps - 1 ||
                  (currentStep === 0 && !connected)
                }
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
