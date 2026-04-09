const stories = [
  { step: "01", title: "Scroll and the interface stages itself", desc: "The hero relies on video depth, oversized type, and layered motion — so the opening feels cleaner and more premium." },
  { step: "02", title: "Story blocks reveal system architecture", desc: "Connections, control panels, and activity logs enter in timed sequences — a guided product walkthrough." },
  { step: "03", title: "Devices feel alive, not flat", desc: "Relay cards, badges, and sections animate with layered parallax and perspective transforms." },
];

const StorySection = () => (
  <section id="story" className="story-section relative z-[2] w-full max-w-[1240px] mx-auto px-6 mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
    {stories.map((s) => (
      <div
        key={s.step}
        className="story-panel relative overflow-hidden p-7 rounded-[28px] min-h-[220px] preserve-3d"
        style={{
          background: "linear-gradient(180deg, rgba(200,210,240,0.1), rgba(200,210,240,0.04)), linear-gradient(135deg, rgba(150,100,255,0.08), rgba(80,120,255,0.06))",
          border: "1px solid rgba(200,210,240,0.1)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="absolute -right-[10%] -bottom-[40%] w-[180px] h-[180px] rounded-full" style={{ background: "radial-gradient(circle, rgba(80,120,255,0.12), transparent 70%)" }} />
        <div className="text-accent text-[13px] font-extrabold tracking-[0.2em] uppercase mb-[18px]">{s.step}</div>
        <h3 className="text-foreground text-2xl leading-[1.15] font-bold mb-3">{s.title}</h3>
        <p className="text-muted-foreground text-sm leading-[1.7] max-w-[32ch]">{s.desc}</p>
      </div>
    ))}
  </section>
);

export default StorySection;