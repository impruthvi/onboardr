import { Header } from "@/modules/home/ui/components/header";
import { Footer } from "@/modules/home/ui/components/footer";
import { HeroSection } from "@/modules/home/ui/components/hero-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <HeroSection />
      {/* Footer */}
      <Footer />
    </div>
  );
}
