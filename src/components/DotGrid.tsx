import { useEffect, useRef } from "react";

interface DotGridProps {
  className?: string;
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
}

const DotGrid = ({
  className = "",
  dotSize = 1.9,
  gap = 18,
  baseColor = "#271E37",
  activeColor = "#FF8D47",
  proximity = 120,
}: DotGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const shockRef = useRef({ x: -9999, y: -9999, time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: { x: number; y: number; offsetX: number; offsetY: number; strength: number }[] = [];
    let raf: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(w / gap) + 2;
      const rows = Math.ceil(h / gap) + 2;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: c * gap, y: r * gap, offsetX: 0, offsetY: 0, strength: 0 });
        }
      }
    };

    const mixColor = (from: string, to: string, amount: number) => {
      const parse = (hex: string) => {
        const clean = hex.replace("#", "");
        return {
          r: parseInt(clean.slice(0, 2), 16),
          g: parseInt(clean.slice(2, 4), 16),
          b: parseInt(clean.slice(4, 6), 16),
        };
      };
      const a = parse(from);
      const b = parse(to);
      const mix = (s: number, e: number) => Math.round(s + (e - s) * amount);
      return `rgb(${mix(a.r, b.r)}, ${mix(a.g, b.g)}, ${mix(a.b, b.b)})`;
    };

    const animate = () => {
      const now = performance.now();
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      ctx.clearRect(0, 0, w, h);

      for (const dot of dots) {
        let targetX = 0, targetY = 0, intensity = 0;
        const ptr = pointerRef.current;
        if (ptr.active) {
          const dx = ptr.x - dot.x;
          const dy = ptr.y - dot.y;
          const distance = Math.hypot(dx, dy);
          if (distance < proximity) {
            const force = 1 - distance / proximity;
            targetX -= (dx / Math.max(distance, 1)) * force * 12;
            targetY -= (dy / Math.max(distance, 1)) * force * 12;
            intensity = Math.max(intensity, force);
          }
        }

        const shock = shockRef.current;
        const elapsed = (now - shock.time) / 1000;
        if (elapsed < 1.8) {
          const sdx = dot.x - shock.x;
          const sdy = dot.y - shock.y;
          const sdist = Math.hypot(sdx, sdy);
          if (sdist < 250) {
            const wave = Math.max(0, 1 - sdist / 250);
            const decay = Math.exp(-elapsed * 0.75);
            targetX += (sdx / Math.max(sdist, 1)) * wave * 40 * decay;
            targetY += (sdy / Math.max(sdist, 1)) * wave * 40 * decay;
            intensity = Math.max(intensity, wave * decay);
          }
        }

        dot.offsetX += (targetX - dot.offsetX) * 0.1;
        dot.offsetY += (targetY - dot.offsetY) * 0.1;
        dot.strength += (intensity - dot.strength) * 0.12;

        ctx.beginPath();
        ctx.fillStyle = mixColor(baseColor, activeColor, Math.min(dot.strength, 1));
        ctx.globalAlpha = 0.18 + dot.strength * 0.72;
        ctx.arc(dot.x + dot.offsetX, dot.y + dot.offsetY, dotSize + dot.strength * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => {
      pointerRef.current = { ...pointerRef.current, active: false, x: -9999, y: -9999 };
    };
    const onClick = (e: MouseEvent) => {
      shockRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, [dotSize, gap, baseColor, activeColor, proximity]);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};

export default DotGrid;
