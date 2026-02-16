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

  // ===== COUNTDOWN =====
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

  // ===== GOLD PARTICLES (FIXED FOR TYPESCRIPT) =====
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

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("scroll", handleScroll);
    clearInterval(timer);
  };
}, []);
