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

  const animatedSections = useRef<HTMLElement[]>([]);

  const registerSection = (el: HTMLElement | null) => {
    if (el && !animatedSections.current.includes(el)) {
      animatedSections.current.push(el);
    }
  };

  useEffect(() => {
    // ===== PARALLAX =====
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 80;
      const y = (window.innerHeight / 2 - e.clientY) / 80;
      setOffset({ x, y });
    };

    // ===== NAVBAR =====
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // ===== OBSERVER =====
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        });
      },
      { threshold: 0.2 }
    );

    animatedSections.current.forEach((section) => {
      observer.observe(section);
    });

    // ===== COUNTDOWN =====
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

    // ===== PARTICLES =====
    const canvas = document.getElementById("particles");
    if (canvas instanceof HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
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
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearInterval(timer);
    };
  }, []);

  return (
    <main className="relative bg-[#05070c] text-white overflow-hidden">

      <canvas id="particles" className="fixed inset-0 z-0 pointer-events-none" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black/70 backdrop-blur-md border-b border-[#D4AF37]/20" : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#D4AF37] tracking-widest font-semibold"
          >
            PANDORA
          </button>

          <div className="hidden md:flex gap-6">
            <button
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-5 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
            >
              О сервере
            </button>

            <button className="px-5 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition">
              Форум
            </button>

            <button className="px-5 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition">
              Личный кабинет
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center md:justify-end px-6 md:px-20">
        <img
          src="/images/goddess-hero.png"
          alt="Pandora"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-center md:object-left"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/60 to-black/90" />

        <div className="relative z-20 text-center md:text-right max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-8xl tracking-[0.4em] text-[#D4AF37]">
            PANDORA
          </h1>

          <p className="text-gray-300 text-lg">
            Perfect World 1.3.6
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:justify-end pt-6">
            <button className="px-10 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition">
              Стартовый гайд
            </button>

            <button className="px-10 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition">
              Скачать клиент
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        ref={registerSection}
        className="py-32 px-8 text-center opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-3xl tracking-widest text-[#D4AF37] mb-6">
          О СЕРВЕРЕ
        </h2>

        <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Pandora PW — имперский сервер Perfect World 1.3.6
          с балансом PvE и PvP и честным рейтом x150.
        </p>
      </section>

      {/* TELEGRAM */}
      <section
        ref={registerSection}
        className="py-24 text-center opacity-0 translate-y-10 transition-all duration-1000"
      >
        <a
          href="https://t.me/PandoraPw2026"
          target="_blank"
          className="inline-block px-12 py-4 border border-[#D4AF37] text-[#D4AF37]
                     hover:bg-[#D4AF37] hover:text-black transition"
        >
          Telegram
        </a>
      </section>

    </main>
  );
}
