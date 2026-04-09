const FooterCTA = () => (
  <footer className="footer-section relative z-[2] glass-surface">
    <div className="max-w-[1240px] mx-auto px-6 py-24 text-center">
      <div className="text-accent text-[12px] tracking-[0.22em] uppercase font-extrabold mb-4">Ready to begin?</div>
      <h2 className="text-foreground text-[clamp(30px,5vw,56px)] font-extrabold leading-[1.05] tracking-tight mb-6">
        Smart Living,
        <br />
        Perfectly Synced.
      </h2>
      <p className="text-muted-foreground text-lg max-w-[500px] mx-auto mb-10">
        Experience the future of home automation. One system. Total control.
      </p>
      <button
        className="group relative px-12 py-4 rounded-[20px] text-[16px] font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-1"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-strong)))",
          boxShadow: "0 8px 32px hsl(var(--primary-glow))",
        }}
        onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className="relative z-[1]">Get Started</span>
        <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(var(--primary-strong)), hsl(var(--primary)))", boxShadow: "0 12px 48px hsl(var(--primary-glow))" }} />
      </button>
    </div>
  </footer>
);

export default FooterCTA;
