"use client";

import { useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  opacity: number;
}

export default function Home() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    /* =======================
       PARALLAX
    ======================= */
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 90;
      const y = (window.innerHeight / 2 - e.clientY) / 90;
      setOffset({ x, y });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    /* =======================
       COUNTDOWN
    ======================= */
    const targetDate = new Date("2026-03-06T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    /* =======================
       INTERSECTION OBSERVER
    ======================= */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.remove("opacity-0", "translate-y-10");
          entry.target.classList.add("opacity-100", "translate-y-0");

          if (entry.target.id === "features") {
            const cards = entry.target.querySelectorAll(".feature-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.remove("opacity-0", "translate-y-10");
                card.classList.add("opacity-100", "translate-y-0");
              }, index * 150);
            });
          }

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    /* =======================
       GOLD PARTICLES (FIXED TS)
    ======================= */

    const canvas = document.getElementById(
      "particles"
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.speedY;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.opacity})`;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resize);
      clearInterval(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="relative bg-[#05070c] text-white overflow-hidden">
      <canvas
        id="particles"
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* NAV */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-md border-b border-[#D4AF37]/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-[#D4AF37] tracking-widest font-semibold cursor-pointer">
            PANDORA PW
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-end overflow-hidden px-8 md:px-20">
        <img
          src="/images/goddess-hero.png"
          alt="Pandora Goddess"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-left transition-transform duration-200"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/50 to-black/90" />

        <div className="relative z-20 max-w-2xl text-right space-y-6 pr-4">
          <h1 className="text-6xl md:text-8xl tracking-[0.4em] text-[#D4AF37] drop-shadow-[0_0_35px_rgba(212,175,55,0.6)]">
            PANDORA
          </h1>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-24 px-8 md:px-20 text-center bg-[#0b0e14] reveal opacity-0 translate-y-10 transition-all duration-1000">
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-6">
          ОТКРЫТИЕ СЕРВЕРА
        </h2>

        <div className="flex justify-center gap-8 flex-wrap">
          {Object.entries(timeLeft).map(([key, value], i) => (
            <div
              key={i}
              className="border border-[#D4AF37]/30 px-8 py-6 min-w-[110px] backdrop-blur-sm transition duration-300 hover:scale-105 hover:border-[#D4AF37]"
            >
              <div className="text-3xl text-[#D4AF37] font-semibold">
                {value}
              </div>
              <div className="text-xs text-gray-400 tracking-widest mt-2">
                {key.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="py-32 px-8 md:px-20 bg-[#0b0e14] reveal opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-12 text-center">
          ОСОБЕННОСТИ
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {["Баланс PvE / PvP", "Войны кланов", "Авторские модификации"].map(
            (title, i) => (
              <div
                key={i}
                className="feature-card border border-[#D4AF37]/20 p-8 opacity-0 translate-y-10 transition-all duration-700 hover:border-[#D4AF37] hover:-translate-y-3 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.35)]"
              >
                <h3 className="text-[#D4AF37] mb-4 tracking-widest">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm">
                  Продуманная система и премиальный игровой процесс.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}
