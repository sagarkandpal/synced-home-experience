const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="hero-section relative w-full min-h-screen flex items-center justify-center overflow-hidden z-[1] mt-[72px]"
      style={{ scrollMarginTop: "88px" }}
    >
      <div className="hero-video-wrap absolute inset-0 z-0 overflow-hidden origin-center">
        <video
          className="hero-video w-full h-full object-cover scale-[1.08]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ filter: "saturate(0.88) contrast(1.05) brightness(0.58)" }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,18,0.2) 0%, rgba(6,8,18,0.12) 24%, rgba(6,8,18,0.5) 100%), radial-gradient(circle at 20% 20%, rgba(80,120,255,0.14), transparent 28%), radial-gradient(circle at 80% 30%, rgba(150,100,255,0.12), transparent 32%)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,8,18,0.8) 0%, rgba(6,8,18,0.42) 46%, rgba(6,8,18,0.72) 100%), radial-gradient(circle at 20% 20%, rgba(80,120,255,0.12), transparent 28%), radial-gradient(circle at 75% 30%, rgba(150, 100, 255, 0.15), transparent 32%)",
        }}
      />

      <div className="hero-content relative z-[2] w-full max-w-[1240px] px-6 grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,500px)] gap-12 items-center py-10">
        <div className="hero-copy max-w-[760px] text-center lg:text-left mx-auto lg:mx-0">
          <div
            className="hero-kicker reveal-up inline-flex items-center gap-[10px] px-4 py-[10px] mb-[22px] rounded-full text-foreground text-[12px] font-bold tracking-[0.16em] uppercase"
            style={{ background: "rgba(200,210,240,0.08)", border: "1px solid rgba(200,210,240,0.14)" }}
          >
            <span className="w-2 h-2 rounded-full bg-accent" style={{ boxShadow: "0 0 18px hsl(var(--accent))" }} />
            Spatial Smart Living
          </div>
          <h1
            className="hero-headline reveal-up text-[clamp(34px,6vw,92px)] font-extrabold leading-[1.03] mb-6 text-foreground tracking-tight"
            style={{ textShadow: "0 12px 38px rgba(4,6,16,0.38)" }}
          >
            Motion-first
            <br />
            smart living.
          </h1>
          <p
            className="hero-sub reveal-up text-lg text-foreground/95 mb-10 max-w-[640px] mx-auto lg:mx-0"
            style={{ textShadow: "0 2px 6px rgba(0,0,0,0.35)" }}
          >
            A cinematic smart-home website with real MQTT control, live relay syncing, and fail-safe access across web, IR, and local control.
          </p>
          <div className="hero-cta reveal-up flex gap-4 justify-center lg:justify-start flex-wrap">
            <button
              className="px-10 py-[14px] rounded-[20px] text-[15px] font-bold text-primary-foreground transition-all duration-300 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-strong)))", boxShadow: "0 8px 32px hsl(var(--primary-glow))" }}
              onClick={() => scrollTo("devices")}
            >
              Explore Dashboard
            </button>
            <button
              className="px-10 py-[14px] rounded-[20px] text-[15px] font-bold text-foreground transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "rgba(200,210,240,0.06)", border: "1px solid rgba(200,210,240,0.18)" }}
              onClick={() => scrollTo("experience")}
            >
              Open Connections
            </button>
          </div>
          <div className="hero-metrics reveal-up flex flex-wrap gap-[18px] mt-10 justify-center lg:justify-start">
            {[
              { value: "4", label: "Live relays" },
              { value: "MQTT", label: "Realtime core" },
              { value: "IR + Web", label: "Multi control" },
            ].map((m) => (
              <div
                key={m.label}
                className="min-w-[140px] px-[18px] py-4 rounded-[22px]"
                style={{ background: "rgba(200,210,240,0.07)", border: "1px solid rgba(200,210,240,0.1)", boxShadow: "0 18px 48px rgba(4,6,16,0.18)" }}
              >
                <span className="block text-foreground text-2xl font-extrabold mb-[6px]">{m.value}</span>
                <span className="block text-muted-foreground text-[12px] tracking-[0.08em] uppercase">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-scene relative min-h-[360px] lg:min-h-[540px] flex items-center justify-center perspective-1400">
          <div className="scene-ring ring-one absolute inset-[14%] rounded-full border border-foreground/15 preserve-3d" style={{ transform: "translateZ(-40px) rotateX(72deg)", boxShadow: "0 0 60px rgba(80,120,255,0.18)" }} />
          <div className="scene-ring ring-two absolute inset-[5%] rounded-full preserve-3d" style={{ borderColor: "rgba(150,100,255,0.2)", border: "1px solid", transform: "translateZ(-90px) rotateX(74deg)" }} />

          <div className="hero-frame relative w-full max-w-[470px] aspect-[1/1.06] preserve-3d z-[2]">
            <div className="absolute inset-[12%] rounded-[36px]" style={{ background: "radial-gradient(circle, rgba(80,120,255,0.22) 0%, rgba(80,120,255,0) 60%), radial-gradient(circle at 60% 40%, rgba(150,100,255,0.2) 0%, rgba(150,100,255,0) 66%)", transform: "translateZ(-60px)", filter: "blur(22px)" }} />

            <div className="hero-frame-inner absolute inset-[8%] rounded-[36px] p-8 overflow-hidden preserve-3d backdrop-blur-[16px]" style={{
              background: "linear-gradient(180deg, rgba(200,210,240,0.12), rgba(200,210,240,0.04)), linear-gradient(135deg, rgba(150,100,255,0.08), rgba(80,120,255,0.06))",
              border: "1px solid rgba(200,210,240,0.14)",
              boxShadow: "var(--shadow-lg)",
              transform: "rotateX(58deg) rotateZ(-18deg) translateZ(40px)",
            }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 36%), radial-gradient(circle at 80% 20%, rgba(80,120,255,0.12), transparent 24%)" }} />
              <div className="relative z-[2] text-accent text-[12px] font-extrabold uppercase tracking-[0.22em] mb-5">Realtime Environment</div>
              <div className="hero-word-top relative z-[2] text-[clamp(56px,7vw,96px)] leading-[0.9] tracking-[-0.08em] font-extrabold text-foreground/90" style={{ textShadow: "0 8px 30px rgba(4,6,16,0.2)" }}>SYNC</div>
              <div className="hero-word-bottom relative z-[2] text-[clamp(56px,7vw,96px)] leading-[0.9] tracking-[-0.08em] font-extrabold text-transparent ml-[38px]" style={{ WebkitTextStroke: "1px rgba(220,225,240,0.82)" }}>HOME</div>
              <div className="absolute left-7 right-7 top-[88px] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,210,240,0.8), transparent)", opacity: 0.75 }} />
              <div className="absolute left-7 right-7 bottom-10 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,210,240,0.8), transparent)", opacity: 0.75 }} />
            </div>

            <div className="floating-device device-a absolute top-[12%] right-[-4%] flex items-center gap-[10px] px-4 py-3 rounded-full text-foreground text-[13px] font-bold backdrop-blur-[16px] opacity-0 translate-y-6" style={{ background: "rgba(200,210,240,0.08)", border: "1px solid rgba(200,210,240,0.14)", boxShadow: "0 20px 40px rgba(4,6,16,0.22)", transform: "translateZ(120px)" }}>
              <span className="w-[9px] h-[9px] rounded-full bg-accent" style={{ boxShadow: "0 0 16px hsl(var(--accent))" }} />
              <span>Adaptive Lights</span>
            </div>
            <div className="floating-device device-b absolute left-[-8%] bottom-[22%] flex items-center gap-[10px] px-4 py-3 rounded-full text-foreground text-[13px] font-bold backdrop-blur-[16px] opacity-0 translate-y-6" style={{ background: "rgba(200,210,240,0.08)", border: "1px solid rgba(200,210,240,0.14)", boxShadow: "0 20px 40px rgba(4,6,16,0.22)", transform: "translateZ(80px)" }}>
              <span className="w-[9px] h-[9px] rounded-full bg-accent" style={{ boxShadow: "0 0 16px hsl(var(--accent))" }} />
              <span>Climate Sync</span>
            </div>
            <div className="floating-device device-c absolute right-[8%] bottom-[6%] flex items-center gap-[10px] px-4 py-3 rounded-full text-foreground text-[13px] font-bold backdrop-blur-[16px] opacity-0 translate-y-6" style={{ background: "rgba(200,210,240,0.08)", border: "1px solid rgba(200,210,240,0.14)", boxShadow: "0 20px 40px rgba(4,6,16,0.22)", transform: "translateZ(100px)" }}>
              <span className="w-[9px] h-[9px] rounded-full bg-accent" style={{ boxShadow: "0 0 16px hsl(var(--accent))" }} />
              <span>Live Security</span>
            </div>

            <div className="hero-chip-wide chip-d absolute left-[-2%] top-[12%] flex flex-col gap-[6px] px-[18px] py-4 min-w-[220px] rounded-[22px] text-foreground backdrop-blur-[16px] opacity-0 translate-y-7" style={{ background: "rgba(200,210,240,0.08)", border: "1px solid rgba(200,210,240,0.14)", boxShadow: "0 20px 48px rgba(4,6,16,0.24)" }}>
              <span className="text-accent text-[11px] tracking-[0.18em] uppercase font-extrabold">Scene</span>
              <span className="text-foreground text-[15px] font-bold">Luxury Motion System</span>
            </div>
            <div className="hero-chip-wide chip-e absolute right-[-4%] bottom-[14%] flex flex-col gap-[6px] px-[18px] py-4 min-w-[220px] rounded-[22px] text-foreground backdrop-blur-[16px] opacity-0 translate-y-7" style={{ background: "rgba(200,210,240,0.08)", border: "1px solid rgba(200,210,240,0.14)", boxShadow: "0 20px 48px rgba(4,6,16,0.24)" }}>
              <span className="text-accent text-[11px] tracking-[0.18em] uppercase font-extrabold">Response</span>
              <span className="text-foreground text-[15px] font-bold">Realtime MQTT Control</span>
            </div>

            <div className="hero-subtitle absolute bottom-[26%] left-[4%] text-[11px] font-bold tracking-[0.16em] uppercase text-foreground/80 opacity-0 translate-y-5">
              Live Sync
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
