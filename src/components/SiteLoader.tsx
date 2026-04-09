import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SiteLoaderProps {
  onComplete: () => void;
}

const SiteLoader = ({ onComplete }: SiteLoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = "none";
        onComplete();
      },
    });

    tl.fromTo(".loader-glow", { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 0.92, duration: 1.5, ease: "power2.out" }, 0)
      .fromTo(".loader-line", { scaleX: 0, opacity: 0.2 }, { scaleX: 1, opacity: 1, duration: 0.95 }, 0.72)
      .to(".loader-word", { y: 0, opacity: 1, duration: 1.25, stagger: 0.16 }, 0.22)
      .fromTo(".loader-label", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, 1.02)
      .to(".loader-wordmark", { y: -118, scale: 0.9, opacity: 0, letterSpacing: "0.34em", duration: 1.15, ease: "power2.inOut" }, 2.35)
      .to(".loader-line", { y: -80, opacity: 0, duration: 0.95, ease: "power2.inOut" }, 2.42)
      .to(".loader-label", { y: -56, opacity: 0, duration: 0.85, ease: "power2.inOut" }, 2.38)
      .to(loaderRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 3.05);
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 45%, rgba(80, 120, 255, 0.14), transparent 22%), linear-gradient(180deg, rgba(3, 4, 12, 0.98) 0%, rgba(6, 8, 18, 0.99) 100%)",
      }}
    >
      <div
        className="loader-glow absolute rounded-[40px] opacity-0"
        style={{
          width: "min(74vw, 920px)",
          height: "min(42vw, 520px)",
          background: "radial-gradient(circle, rgba(80, 120, 255, 0.35) 0%, rgba(150, 100, 255, 0.08) 42%, transparent 72%)",
          filter: "blur(42px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-[22px] uppercase">
        <div className="loader-wordmark flex items-center gap-5 text-foreground font-extrabold leading-none" style={{ fontSize: "clamp(48px, 9vw, 132px)", letterSpacing: "0.26em" }}>
          <span className="loader-word inline-block opacity-0 translate-y-[84px] text-foreground/80">sync</span>
          <span className="loader-word inline-block opacity-0 translate-y-[84px] text-foreground" style={{ textShadow: "0 0 28px rgba(80, 120, 255, 0.16)" }}>home</span>
        </div>
        <div
          className="loader-line origin-center"
          style={{
            width: "min(520px, 58vw)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.76), transparent)",
          }}
        />
        <p className="loader-label text-[11px] font-bold tracking-[0.42em] text-foreground/50 opacity-0">
          Smart living system
        </p>
      </div>
    </div>
  );
};

export default SiteLoader;
