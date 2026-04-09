import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useGsapAnimations = (loaded: boolean) => {
  useEffect(() => {
    if (!loaded) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Navbar reveal
      gsap.to(".navbar-el", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });

      // Hero content reveal
      gsap.to(".hero-copy > *", { opacity: 1, y: 0, duration: 0.95, stagger: 0.1, ease: "power3.out", delay: 0.1 });

      // Hero frame
      gsap.to(".hero-frame", { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 });

      // Floating devices
      gsap.to(".floating-device", { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.4 });
      gsap.to(".hero-chip-wide", { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.5 });
      gsap.to(".hero-subtitle", { y: 0, opacity: 1, duration: 0.85, stagger: 0.08, ease: "power3.out", delay: 0.58 });

      // Hero parallax on scroll
      gsap.to(".hero-video-wrap", {
        yPercent: 18, scale: 1.1, rotation: -1.8, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.2 },
      });

      gsap.to(".hero-video", {
        scale: 1.22, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 },
      });

      // Hero content parallax
      const heroTl = gsap.timeline({
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.9 },
      });
      heroTl
        .to(".hero-copy", { yPercent: -24, z: 90, ease: "none" }, 0)
        .to(".hero-kicker", { yPercent: -18, opacity: 0.72, ease: "none" }, 0)
        .to(".hero-headline", { yPercent: -8, scale: 1.05, ease: "none" }, 0)
        .to(".hero-sub", { yPercent: 8, opacity: 0.82, ease: "none" }, 0)
        .to(".hero-scene", { yPercent: 8, ease: "none" }, 0)
        .to(".hero-frame", { rotateX: 18, rotateY: -20, yPercent: 12, z: 160, ease: "none" }, 0)
        .to(".hero-frame-inner", { rotateZ: -8, scale: 1.02, ease: "none" }, 0)
        .to(".hero-word-top", { xPercent: -8, yPercent: -6, ease: "none" }, 0)
        .to(".hero-word-bottom", { xPercent: 10, yPercent: 8, ease: "none" }, 0)
        .to(".ring-one", { rotateZ: 22, scale: 1.12, ease: "none" }, 0)
        .to(".ring-two", { rotateZ: -28, scale: 0.92, ease: "none" }, 0)
        .to(".device-a", { xPercent: 14, yPercent: -24, ease: "none" }, 0)
        .to(".device-b", { xPercent: -14, yPercent: 20, ease: "none" }, 0)
        .to(".device-c", { xPercent: 10, yPercent: 16, ease: "none" }, 0)
        .to(".chip-d", { xPercent: -10, yPercent: -18, ease: "none" }, 0)
        .to(".chip-e", { xPercent: 12, yPercent: 16, ease: "none" }, 0)
        .to(".hero-subtitle", { yPercent: -10, xPercent: 6, ease: "none" }, 0);

      // Story panels reveal
      gsap.fromTo(".story-panel",
        { y: 40, opacity: 0, rotateX: -8 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: "#story", start: "top 80%" } }
      );

      // Features section
      gsap.fromTo(".feature-intro",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: "#features", start: "top 72%" } }
      );

      gsap.fromTo(".feature-card",
        { y: 36, opacity: 0, rotateX: -8 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.85, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: "#features", start: "top 68%" } }
      );

      // Devices section
      gsap.fromTo(".device-intro",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: "#devices", start: "top 72%" } }
      );

      gsap.fromTo(".relay-grid .rc, .conn-bar, .pir-card, .dev-banner",
        { y: 36, opacity: 0, rotateX: -8, transformOrigin: "top center" },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.85, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: "#devices", start: "top 68%" } }
      );

      gsap.fromTo(".device-house",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: "#devices", start: "top 60%" } }
      );

      // Experience section
      gsap.fromTo(".experience-intro",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: "#experience", start: "top 72%" } }
      );

      gsap.fromTo(".form-card, .saved-list, .full-log",
        { y: 36, opacity: 0, rotateX: -6 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.85, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: "#experience", start: "top 68%" } }
      );

      // Footer
      gsap.fromTo(".footer-section",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".footer-section", start: "top 85%" } }
      );

      // 3D tilt on hover for feature cards (desktop)
      if (window.innerWidth > 860) {
        document.querySelectorAll<HTMLElement>(".feature-card, .story-panel, .tilt-card, .form-card, .saved-list, .full-log").forEach((card) => {
          const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, { rotateY: px * 12, rotateX: py * -10, y: -6, duration: 0.35, ease: "power2.out", transformPerspective: 1000, transformOrigin: "center center" });
          };
          const onLeave = () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.5, ease: "power3.out" });
          };
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
        });

        const heroFrame = document.querySelector<HTMLElement>(".hero-frame");
        const heroInner = document.querySelector<HTMLElement>(".hero-frame-inner");
        const heroWords = document.querySelectorAll<HTMLElement>(".hero-word-top, .hero-word-bottom");
        const heroChips = document.querySelectorAll<HTMLElement>(".hero-chip-wide, .floating-device, .hero-subtitle");

        if (heroFrame && heroInner) {
          const onHeroMove = (e: MouseEvent) => {
            const rect = heroFrame.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(heroInner, {
              rotateY: px * 12,
              rotateX: 58 + py * -10,
              rotateZ: -18 + px * 3,
              duration: 0.35,
              ease: "power2.out",
              transformPerspective: 1200,
              transformOrigin: "center center",
            });

            gsap.to(heroWords, {
              x: px * 10,
              y: py * 8,
              duration: 0.45,
              ease: "power2.out",
            });

            gsap.to(heroChips, {
              x: px * 14,
              y: py * 10,
              duration: 0.4,
              ease: "power2.out",
            });
          };

          const onHeroLeave = () => {
            gsap.to(heroInner, {
              rotateY: 0,
              rotateX: 58,
              rotateZ: -18,
              duration: 0.55,
              ease: "power3.out",
            });

            gsap.to(heroWords, {
              x: 0,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
            });

            gsap.to(heroChips, {
              x: 0,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
            });
          };

          heroFrame.addEventListener("mousemove", onHeroMove);
          heroFrame.addEventListener("mouseleave", onHeroLeave);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaded]);
};

export default useGsapAnimations;
