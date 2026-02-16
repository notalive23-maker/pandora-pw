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
  const animationRef = useRef<number>();

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

    // ================= NAVBAR =================
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // ================= INTERSECTION OBSERVER =================
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

    sectionsRef.current.forEach((section) => {
      observer.observe(section);
    });

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
    const canvas = document.getElementById(
      "particles"
    ) as HTMLCanvasElement | null;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Particle[] = [];

        for (let i = 0; i < 85; i++) {
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
            ctx.shadowBlur = 7;
            ctx.fill();
          });

          animationRef.current = requestAnimationFrame(animate);
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
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
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#D4AF37] tracking-widest font-semibold cursor-pointer"
          >
            PANDORA PW
          </div>
        </div>
      </nav>

      {/* HERO */}
<section className="relative min-h-screen flex items-center justify-center md:justify-end px-6 md:px-20 z-20 overflow-hidden">

  {/* Image */}
  <img
    src="/images/goddess-hero.png"
    alt="Pandora Goddess"
    style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    className="
      absolute inset-0 
      w-full h-full 
      object-cover 
      object-center md:object-left
      transition-transform duration-200
    "
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/70 via-black/60 to-black/90" />

  {/* Content */}
  <div className="
    relative z-30 
    w-full 
    text-center md:text-right 
    max-w-2xl 
    space-y-6
  ">
    <h1 className="
      text-4xl sm:text-6xl md:text-8xl
      tracking-[0.25em] md:tracking-[0.4em]
      text-[#D4AF37]
      drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]
    ">
      PANDORA
    </h1>

    <p className="text-gray-300 text-base md:text-lg">
      Perfect World 1.3.6
    </p>

    <p className="text-[#D4AF37] text-sm tracking-wider">
      x150 • PvE / PvP Balance
    </p>

    <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4 pt-4">
      <button className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
        НАЧАТЬ ИГРУ
      </button>

      <button className="px-8 py-3 border border-gray-600 text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300">
        СКАЧАТЬ КЛИЕНТ
      </button>
    </div>
  </div>
</section>
    </main>
  );
}
