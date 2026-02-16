"use client";

import { useEffect, useState } from "react";

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
    /* ================= MOUSE PARALLAX ================= */
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 80;
      const y = (window.innerHeight / 2 - e.clientY) / 80;
      setOffset({ x, y });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    /* ================= COUNTDOWN ================= */
    const targetDate = new Date("2026-03-06T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) return;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    /* ================= GOLD PARTICLES ================= */
    const canvas = document.getElementById("particles") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    type Particle = {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      opacity: number;
    };

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
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <main className="relative bg-[#05070c] text-white overflow-hidden">

      {/* PARTICLES */}
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
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-[#D4AF37] tracking-widest font-semibold">
            PANDORA PW
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

        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/80" />

        <div className="relative z-20 max-w-2xl text-right space-y-6 pr-4">
          <h1 className="text-6xl md:text-8xl tracking-[0.4em] text-[#D4AF37]">
            PANDORA
          </h1>

          <p className="text-gray-300 text-lg">
            Perfect World 1.3.6
          </p>

          <p className="text-[#D4AF37] text-sm tracking-wider">
            x150 • PvE / PvP Balance
          </p>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-24 px-8 md:px-20 text-center bg-[#0b0e14] relative z-10">
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-6">
          ОТКРЫТИЕ СЕРВЕРА
        </h2>

        <div className="flex justify-center gap-8 text-center flex-wrap">
          {[
            { label: "ДНЕЙ", value: timeLeft.days },
            { label: "ЧАСОВ", value: timeLeft.hours },
            { label: "МИНУТ", value: timeLeft.minutes },
            { label: "СЕКУНД", value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="border border-[#D4AF37]/30 px-8 py-6 min-w-[110px]"
            >
              <div className="text-3xl md:text-4xl text-[#D4AF37] font-semibold">
                {item.value}
              </div>
              <div className="text-xs text-gray-400 tracking-widest mt-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
