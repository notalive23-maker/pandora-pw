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

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* ================= NAVBAR + PARALLAX ================= */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 60;
      const y = (window.innerHeight / 2 - e.clientY) / 60;
      setOffset({ x, y });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
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

    return () => clearInterval(timer);
  }, []);

  /* ================= INTERSECTION OBSERVER ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ================= GOLD PARTICLES ================= */
  useEffect(() => {
    const canvas = document.getElementById("particles");
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speedY: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.5 + 0.2,
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
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <main className="relative bg-[#05070c] text-white overflow-hidden">
      <canvas
        id="particles"
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-md border-b border-[#D4AF37]/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="text-[#D4AF37] tracking-widest font-semibold cursor-pointer hover:scale-105 transition">
            PANDORA PW
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-end px-8 md:px-20 overflow-hidden">
        <img
          src="/images/goddess-hero.png"
          alt="Pandora Goddess"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-left transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/50 to-black/90" />
        <div className="relative z-20 max-w-2xl text-right space-y-6 pr-4">
          <h1 className="text-7xl md:text-8xl tracking-[0.4em] text-[#D4AF37] drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]">
            PANDORA
          </h1>
          <p className="text-gray-300 text-lg">Perfect World 1.3.6</p>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        className="py-24 px-8 md:px-20 text-center bg-[#0b0e14] opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-6">
          ОТКРЫТИЕ СЕРВЕРА
        </h2>

        <div className="flex justify-center gap-8 flex-wrap">
          {[
            { label: "ДНЕЙ", value: timeLeft.days },
            { label: "ЧАСОВ", value: timeLeft.hours },
            { label: "МИНУТ", value: timeLeft.minutes },
            { label: "СЕКУНД", value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="border border-[#D4AF37]/30 px-8 py-6 min-w-[110px] backdrop-blur-sm hover:border-[#D4AF37] hover:scale-105 transition duration-300"
            >
              <div className="text-3xl text-[#D4AF37] font-semibold">
                {item.value}
              </div>
              <div className="text-xs text-gray-400 tracking-widest mt-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={(el) => (sectionRefs.current[1] = el)}
        className="py-32 px-8 md:px-20 bg-[#0b0e14] opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-12 text-center">
          ОСОБЕННОСТИ
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {["Баланс PvE / PvP", "Войны кланов", "Авторские модификации"].map(
            (title, i) => (
              <div
                key={i}
                className="group relative border border-[#D4AF37]/20 p-8 transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-3 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
              >
                <h3 className="text-[#D4AF37] mb-4 tracking-widest group-hover:tracking-[0.2em] transition-all">
                  {title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-200 transition">
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
