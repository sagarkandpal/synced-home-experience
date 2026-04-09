const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="navbar-el fixed top-0 left-0 right-0 z-[200] glass-surface h-[72px] flex items-center justify-between px-10 opacity-0 translate-y-9">
      <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }} className="flex items-center gap-[10px] no-underline">
        <div className="text-[15px] font-extrabold tracking-[0.22em] uppercase flex gap-[10px]">
          <span className="text-foreground/70 font-semibold">sync</span>
          <span className="text-primary font-extrabold">home</span>
        </div>
      </a>
      <nav className="hidden md:flex items-center gap-2">
        {[
          { label: "Home", target: "hero" },
          { label: "Features", target: "features" },
          { label: "Dashboard", target: "devices" },
          { label: "Connections", target: "experience" },
        ].map((item) => (
          <button
            key={item.target}
            onClick={() => scrollTo(item.target)}
            className="px-4 py-2 rounded-[20px] text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-200"
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-[6px] px-[14px] py-[6px] rounded-[20px] border border-border text-[12px] font-semibold text-muted-foreground backdrop-blur-[10px]">
          <div className="w-[6px] h-[6px] rounded-full bg-accent" style={{ boxShadow: "0 0 8px hsl(var(--accent))" }} />
          <span>Smart Home</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
