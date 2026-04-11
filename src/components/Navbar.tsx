import { useSmartHome } from "@/context/SmartHomeContext";
import type { ConnectionStatus } from "@/context/SmartHomeContext";

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { dot: string; ping: boolean }
> = {
  connected:  { dot: "#22c55e", ping: true  },
  connecting: { dot: "#f59e0b", ping: true  },
  error:      { dot: "#ef4444", ping: false },
  offline:    { dot: "#ef4444", ping: false },
  idle:       { dot: "#6b7280", ping: false },
};

const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const { connectionStatus, pillText } = useSmartHome();
  const cfg = STATUS_CONFIG[connectionStatus] ?? STATUS_CONFIG.idle;

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
          { label: "Home",        target: "hero"       },
          { label: "Features",    target: "features"   },
          { label: "Dashboard",   target: "devices"    },
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

      {/* Live connection status — clicking jumps to Connections section */}
      <button
        onClick={() => scrollTo("experience")}
        title="Go to Connections"
        className="flex items-center gap-[7px] px-[14px] py-[7px] rounded-[20px] border border-border text-[12px] font-semibold backdrop-blur-[10px] hover:bg-white/5 transition-colors duration-200 cursor-pointer"
      >
        <span className="relative flex h-[8px] w-[8px] shrink-0">
          {cfg.ping && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: cfg.dot }}
            />
          )}
          <span
            className="relative inline-flex rounded-full h-[8px] w-[8px]"
            style={{ backgroundColor: cfg.dot, boxShadow: `0 0 7px ${cfg.dot}` }}
          />
        </span>
        <span className="text-foreground/80">{pillText}</span>
      </button>
    </div>
  );
};

export default Navbar;

