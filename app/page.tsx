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

  const sectionsRef = useRef<HTMLElement[]>([]);

  const addSectionRef = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    // ================= PARALLAX =================
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 80;
      const y = (window.innerHeight / 2 - e.clientY) / 80;
      setOffset({ x, y });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // ================= ANIMATION OBSERVER =================
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-10");

          if (el.id === "features") {
            const cards = el.querySelectorAll<HTMLElement>(".feature-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("opacity-100", "translate-y-0");
                card.classList.remove("opacity-0", "translate-y-10");
              }, index * 180);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => observer.observe(section));

    // ================= COUNTDOWN =================
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

    // ================= GOLD PARTICLES =================
    const canvas = document.getElementById("particles") as HTMLCanvasElement | null;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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
      <section className="relative min-h-screen flex items-center justify-center md:justify-end px-6 md:px-20 overflow-hidden">
        <img
          src="/images/goddess-hero.png"
          alt="Pandora Goddess"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-center md:object-left scale-110 md:scale-100"
        />

        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/60 to-black/90" />

        <div className="relative z-20 w-full max-w-2xl text-center md:text-right space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl tracking-[0.25em] md:tracking-[0.4em] text-[#D4AF37] drop-shadow-[0_0_35px_rgba(212,175,55,0.6)]">
            PANDORA
          </h1>

          <p className="text-gray-300 text-base md:text-lg">
            Perfect World 1.3.6
          </p>

          <p className="text-[#D4AF37] text-sm tracking-wider">
            x150 • PvE / PvP Balance
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4 pt-4">
            <button className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]">
              НАЧАТЬ ИГРУ
            </button>

            <button className="px-8 py-3 border border-gray-600 text-gray-300 tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300">
              СКАЧАТЬ КЛИЕНТ
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section
        ref={addSectionRef}
        className="py-24 px-8 md:px-20 text-center bg-[#0b0e14] opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-6">
          ОТКРЫТИЕ СЕРВЕРА
        </h2>

        <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
          {[
            { label: "ДНЕЙ", value: timeLeft.days },
            { label: "ЧАСОВ", value: timeLeft.hours },
            { label: "МИНУТ", value: timeLeft.minutes },
            { label: "СЕКУНД", value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="border border-[#D4AF37]/30 px-5 py-4 md:px-8 md:py-6 min-w-[85px] md:min-w-[110px]"
            >
              <div className="text-3xl text-[#D4AF37] font-semibold">
                {item.value}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        ref={addSectionRef}
        className="py-32 px-8 md:px-20 bg-[#0b0e14] opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-12 text-center">
          ОСОБЕННОСТИ
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            "Баланс PvE / PvP",
            "Войны кланов",
            "Авторские модификации",
          ].map((title, i) => (
            <div
              key={i}
              className="feature-card border border-[#D4AF37]/20 p-8 opacity-0 translate-y-10 transition-all duration-700 hover:border-[#D4AF37]"
            >
              <h3 className="text-[#D4AF37] mb-4 tracking-widest">
                {title}
              </h3>
              <p className="text-gray-400 text-sm">
                Продуманная система и премиальный игровой процесс.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
