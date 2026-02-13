"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
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

          // === STAGGER FOR FEATURE CARDS ===
          if (section.id === "features") {
            const cards = section.querySelectorAll(".feature-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("opacity-100", "translate-y-0");
                card.classList.remove("opacity-0", "translate-y-10");
              }, index * 180);
            });
          }
        }
      });
    };

    // === COUNTDOWN ===
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // === GOLD PARTICLES ===
    const canvas = document.getElementById("particles") as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: any[] = [];

      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2,
          speedY: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }

      function animate() {
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
      }

      animate();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative bg-[#05070c] text-white overflow-hidden">

      {/* PARTICLES CANVAS */}
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
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#D4AF37] tracking-widest font-semibold cursor-pointer"
          >
            PANDORA PW
          </div>
          <div className="flex gap-8 text-sm tracking-wider text-gray-300">
            <button
              onClick={() => {
                document.getElementById("info-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#D4AF37] transition"
            >
              О СЕРВЕРЕ
            </button>
            <button className="hover:text-[#D4AF37] transition">ЛИЧНЫЙ КАБИНЕТ</button>
            <button className="hover:text-[#D4AF37] transition">
              ФОРУМ
            </button>
          </div>
        </div>
      </nav>

      {/* HERO WITH GODDESS */}
      <section className="relative min-h-screen flex items-center justify-end overflow-hidden px-8 md:px-20">

        <img
          src="/images/goddess-hero.png"
          alt="Pandora Goddess"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="absolute inset-0 w-full h-full object-cover object-left transition-transform duration-200"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/40 to-black/80" />

        <div className="relative z-20 max-w-2xl text-right space-y-6 pr-4">
          <h1 className="text-6xl md:text-8xl tracking-[0.4em] text-[#D4AF37] drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            PANDORA
          </h1>

          <p className="text-gray-300 text-lg">
            Perfect World 1.3.6
          </p>

          <p className="text-[#D4AF37] text-sm tracking-wider">
            x150 • PvE / PvP Balance
          </p>

          <div className="flex justify-end gap-5 pt-6">
            <button className="px-10 py-3 border border-[#D4AF37] text-[#D4AF37] tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
              НАЧАТЬ ИГРУ
            </button>

            <button className="px-10 py-3 border border-gray-600 text-gray-300 tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300">
              СКАЧАТЬ КЛИЕНТ
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN SECTION */}
      <section className="py-24 px-8 md:px-20 text-center bg-[#0b0e14] relative z-10">
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-6">
          ОТКРЫТИЕ СЕРВЕРА
        </h2>
        <p className="text-gray-400 mb-10">6 МАРТА 2026</p>

        <div className="flex justify-center gap-8 text-center flex-wrap">
          {[
            { label: "ДНЕЙ", value: timeLeft.days },
            { label: "ЧАСОВ", value: timeLeft.hours },
            { label: "МИНУТ", value: timeLeft.minutes },
            { label: "СЕКУНД", value: timeLeft.seconds },
          ].map((item, i) => (
            <div key={i} className="border border-[#D4AF37]/30 px-8 py-6 min-w-[110px] backdrop-blur-sm hover:border-[#D4AF37] transition duration-300">
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

      {/* ABOUT */}
      <section id="info-section" className="py-32 px-8 md:px-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl tracking-widest text-[#D4AF37]">
            О СЕРВЕРЕ
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Pandora PW — имперский сервер Perfect World 1.3.6 с балансом PvE и PvP.
            Честный рейт x150 и продуманная экономика.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Открытие 6 марта 2026 года. Уникальные ивенты, активное сообщество и
            постоянные обновления.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-32 px-8 md:px-20 bg-[#0b0e14] opacity-0 translate-y-10 transition-all duration-1000"
        id="features"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-12 text-center">ОСОБЕННОСТИ</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {["Баланс PvE / PvP", "Войны кланов", "Авторские модификации"].map((title, i) => (
            <div
              key={i}
              className="feature-card group relative overflow-hidden border border-[#D4AF37]/20 p-8 opacity-0 translate-y-10 transition-all duration-700 hover:border-[#D4AF37] hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)]" />
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />
              <h3 className="text-[#D4AF37] mb-4 tracking-widest transition-all duration-300 group-hover:tracking-[0.2em] group-hover:text-[#f5d76e]">{title}</h3>
              <p className="text-gray-400 text-sm transition-all duration-300 group-hover:text-gray-200">
                Продуманная система и премиальный игровой процесс.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DOWNLOAD */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="py-32 px-8 md:px-20 text-center opacity-0 translate-y-10 transition-all duration-1000"
        id="download"
      >
        <h2 className="text-4xl tracking-widest text-[#D4AF37] mb-8">
          ГОТОВ ВСТУПИТЬ В PANDORA?
        </h2>
        <button className="px-12 py-4 border border-[#D4AF37] text-[#D4AF37] tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
          СКАЧАТЬ КЛИЕНТ
        </button>
      </section>
    </main>
  );
}
