"use client";

import { useEffect, useState, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  opacity: number;
};

export default function Home() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 80;
      const y = (window.innerHeight / 2 - e.clientY) / 80;
      setOffset({ x, y });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      sectionsRef.current.forEach((section) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.classList.add("opacity-100", "translate-y-0");
          section.classList.remove("opacity-0", "translate-y-10");
        }
      });
    };

    const targetDate = new Date("2026-03-06T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = Date.now();
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

    // ===== FIXED PARTICLES =====
    const canvas = document.getElementById("particles");
    if (canvas instanceof HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Particle[] = [];

      for (let i = 0; i < 80; i++) {
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

        requestAnimationFrame(animate);
      };

      animate();
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <main className="relative bg-[#05070c] text-white overflow-hidden">

      <canvas id="particles" className="fixed inset-0 z-0 pointer-events-none" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-[#D4AF37]/20"
          : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#D4AF37] tracking-widest font-semibold"
          >
            PANDORA PW
          </button>

          <div className="hidden md:flex gap-6">
            <button
              onClick={() =>
                document.getElementById("info-section")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-5 py-2 border border-[#D4AF37] text-[#D4AF37]
                         hover:bg-[#D4AF37] hover:text-black transition"
            >
              О сервере
            </button>

            <button className="px-5 py-2 border border-[#D4AF37] text-[#D4AF37]
                         hover:bg-[#D4AF37] hover:text-black transition">
              Форум
            </button>

            <button className="px-5 py-2 border border-[#D4AF37] text-[#D4AF37]
                         hover:bg-[#D4AF37] hover:text-black transition">
              Личный кабинет
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-end px-8 md:px-20">

        <img
          src="/images/goddess-hero.png"
          alt="Pandora Goddess"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-left transition-transform duration-200"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/40 to-black/80" />

        <div className="relative z-20 max-w-2xl text-right space-y-6 pr-4">

          <h1 className="text-6xl md:text-8xl tracking-[0.4em] text-[#D4AF37]">
            PANDORA
          </h1>

          <p className="text-gray-300 text-lg">
            Perfect World 1.3.6
          </p>

          {/* TELEGRAM NOW HERE */}
          <div className="flex justify-end gap-4 pt-4">
            <a
              href="https://t.me/PandoraPw2026"
              target="_blank"
              className="px-10 py-3 border border-[#D4AF37] text-[#D4AF37]
                         hover:bg-[#D4AF37] hover:text-black transition"
            >
              Telegram
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="info-section"
        ref={(el) => (sectionsRef.current[0] = el)}
        className="py-32 px-8 md:px-20 opacity-0 translate-y-10 transition-all duration-1000"
      >
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl tracking-widest text-[#D4AF37]">
            О СЕРВЕРЕ
          </h2>
          <p className="text-gray-400">
            Pandora PW — имперский сервер Perfect World 1.3.6
            с балансом PvE и PvP.
          </p>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-32 px-8 md:px-20 text-center opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-8">
          ГОТОВ ВСТУПИТЬ В PANDORA?
        </h2>

        <button className="px-12 py-4 border border-[#D4AF37] text-[#D4AF37]
                           hover:bg-[#D4AF37] hover:text-black transition">
          Скачать клиент
        </button>
      </section>

    </main>
  );
}
