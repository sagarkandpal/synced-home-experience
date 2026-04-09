const features = [
  {
    emoji: "🚶",
    title: "Motion-Based Auto Control",
    desc: "System detects no movement and automatically turns OFF appliances after 10 minutes.",
  },
  {
    emoji: "🌐",
    title: "Internet Failure Handling",
    desc: "If WiFi fails, system switches to AP mode so control is never lost.",
  },
  {
    emoji: "🔄",
    title: "Auto WiFi Reconnection",
    desc: "ESP32 automatically reconnects to saved WiFi without user action.",
  },
  {
    emoji: "🎮",
    title: "Multi-Control Flexibility",
    desc: "If one method fails, the system can still be controlled using IR remote or local web.",
  },
  {
    emoji: "⚡",
    title: "Real-Time Response System",
    desc: "Commands are processed instantly via MQTT with very low latency.",
  },
  {
    emoji: "🔁",
    title: "State Synchronization",
    desc: "Relay states stay synced across IR, web, and MQTT so everything remains consistent.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="features-section relative z-[2] w-full max-w-[1240px] mx-auto px-6 py-32">
    <div className="feature-intro mb-16 max-w-[780px]">
      <div className="text-accent text-[12px] tracking-[0.22em] uppercase font-extrabold mb-3">Capabilities</div>
      <h2 className="text-foreground text-[clamp(30px,4vw,42px)] leading-[1.05] tracking-tight font-extrabold mb-4">Smart control with real fallback logic.</h2>
      <p className="text-muted-foreground text-base leading-relaxed">
        These are the core behaviors powering the system behind the interface.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="feature-card group relative overflow-hidden p-8 rounded-[28px] preserve-3d transition-all duration-500"
          style={{
            background: "linear-gradient(145deg, rgba(5,5,10,1) 0%, rgba(10,10,18,1) 50%, rgba(5,5,10,1) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }} />
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-[28px]" style={{ background: "rgba(80, 120, 255, 0.12)", border: "1px solid rgba(80, 120, 255, 0.22)" }}>
            <span aria-hidden="true">{feature.emoji}</span>
          </div>
          <h3 className="text-foreground text-lg font-bold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
