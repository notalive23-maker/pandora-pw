"use client";

import { useEffect, useState } from "react";

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
    const sections = document.querySelectorAll(".animate-section");

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

    sections.forEach((section) => observer.observe(section));

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
      <canvas id="particles" className="fixed inset-0 z-0 pointer-events-none" />

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-md border-b border-[#D4AF37]/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 text-[#D4AF37] font-semibold tracking-widest">
          PANDORA PW
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-end px-8 md:px-20">
        <img
          src="/images/goddess-hero.png"
          alt="Pandora Goddess"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-left"
        />
      </section>

      <section className="animate-section opacity-0 translate-y-10 transition-all duration-1000 py-24 text-center bg-[#0b0e14]">
        <h2 className="text-4xl text-[#D4AF37] mb-6">
          ОТКРЫТИЕ СЕРВЕРА
        </h2>
      </section>
    </main>
  );
}
