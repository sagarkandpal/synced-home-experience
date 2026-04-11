import { useState, useCallback } from "react";
import DotGrid from "@/components/DotGrid";
import SiteLoader from "@/components/SiteLoader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DevicesSection from "@/components/DevicesSection";
import ExperienceSection from "@/components/ExperienceSection";
import FooterCTA from "@/components/FooterCTA";
import useGsapAnimations from "@/hooks/useGsapAnimations";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const onLoaderComplete = useCallback(() => setLoaded(true), []);

  useGsapAnimations(loaded);

  return (
    <div className="bg-gradient-dark min-h-screen relative">
      <SiteLoader onComplete={onLoaderComplete} />
      <DotGrid />
      {/* Ambient orbs */}
      <div className="fixed z-0 rounded-full pointer-events-none opacity-75 w-[340px] h-[340px] top-[12%] right-[6%]" style={{ background: "radial-gradient(circle, rgba(120,80,255,0.18) 0%, rgba(120,80,255,0) 70%)", filter: "blur(12px)" }} />
      <div className="fixed z-0 rounded-full pointer-events-none opacity-75 w-[420px] h-[420px] left-[-4%] bottom-[10%]" style={{ background: "radial-gradient(circle, rgba(80,120,255,0.16) 0%, rgba(80,120,255,0) 72%)", filter: "blur(12px)" }} />
      {/* Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(6,8,18,0.34) 0%, rgba(6,8,18,0.58) 100%), radial-gradient(circle at 50% 20%, rgba(80, 120, 255, 0.09), transparent 24%)" }} />

      <Navbar />
      <HeroSection />
      <DevicesSection />
      <ExperienceSection />
      <FeaturesSection />
      <FooterCTA />
    </div>
  );
};

export default Index;
