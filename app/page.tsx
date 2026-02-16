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
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 80;
      const y = (window.innerHeight / 2 - e.clientY) / 80;
      setOffset({ x, y });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

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
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => {
      observer.observe(section);
    });

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

    const canvas = document.getElementById("particles") as HTMLCanvasElement | null;

    if (canvas) {
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
            ctx.shadowBlur = 6;
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
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-[#D4AF37]/20"
          : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#D4AF37] tracking-widest font-semibold"
          >
            PANDORA
          </button>

          <div className="hidden md:flex gap-8 text-sm tracking-wider text-gray-300">

            <button
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
              className="relative group transition-all duration-300 hover:text-[#D4AF37]"
            >
              О сервере
              <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </button>

            <a
              href="https://t.me/PandoraPw2026"
              target="_blank"
              className="relative group transition-all duration-300 hover:text-[#D4AF37]"
            >
              Форум
              <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>

            <a
              href="/account"
              className="relative group transition-all duration-300 hover:text-[#D4AF37]"
            >
              Личный кабинет
              <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center md:justify-end overflow-hidden px-6 md:px-20">

        <img
          src="/images/goddess-hero.png"
          alt="Pandora"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-center md:object-left"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/50 to-black/90" />

        <div className="relative z-20 text-center md:text-right max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-8xl tracking-[0.4em] text-[#D4AF37]">
            PANDORA
          </h1>

          <p className="text-gray-300 text-lg">
            Perfect World 1.3.6
          </p>

          <p className="text-[#D4AF37] text-sm tracking-wider">
            x150 • PvE / PvP Balance
          </p>

          <div className="flex flex-col md:flex-row gap-4 pt-6 justify-center md:justify-end">
            <a
              href="https://t.me/PandoraPw2026"
              target="_blank"
              className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
            >
              Telegram
            </a>

            <button className="px-8 py-3 border border-gray-600 text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
              Скачать клиент
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section ref={addSectionRef} className="py-24 px-8 text-center bg-[#0b0e14] opacity-0 translate-y-10 transition-all duration-1000">
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-8">
          ОТКРЫТИЕ СЕРВЕРА
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { label: "ДНЕЙ", value: timeLeft.days },
            { label: "ЧАСОВ", value: timeLeft.hours },
            { label: "МИНУТ", value: timeLeft.minutes },
            { label: "СЕКУНД", value: timeLeft.seconds },
          ].map((item, i) => (
            <div key={i} className="border border-[#D4AF37]/30 px-8 py-6 min-w-[100px]">
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

      {/* ABOUT */}
      <section
        id="about"
        ref={addSectionRef}
        className="py-32 px-8 opacity-0 translate-y-10 transition-all duration-1000"
      >
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl tracking-widest text-[#D4AF37]">
            О СЕРВЕРЕ
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Pandora PW — имперский сервер Perfect World 1.3.6 с балансом PvE и PvP.
            Честный рейт x150 и продуманная экономика.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        ref={addSectionRef}
        className="py-32 px-8 bg-[#0b0e14] opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-12 text-center">
          ОСОБЕННОСТИ
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["Баланс PvE / PvP", "Войны кланов", "Авторские модификации"].map((title, i) => (
            <div key={i} className="feature-card border border-[#D4AF37]/20 p-8 opacity-0 translate-y-10 transition-all duration-700">
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

      {/* DOWNLOAD */}
      <section
        ref={addSectionRef}
        className="py-32 px-8 text-center opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-8">
          ГОТОВ ВСТУПИТЬ В PANDORA?
        </h2>

        <button className="px-12 py-4 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition">
          Скачать клиент
        </button>
      </section>

    </main>
  );
}
