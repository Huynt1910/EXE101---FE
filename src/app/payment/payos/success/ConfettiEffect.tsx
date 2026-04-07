"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "circle" | "rect" | "star";
}

const COLORS = [
  "#22c55e",
  "#16a34a",
  "#facc15",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#ffffff",
];

function createBurst(
  canvas: HTMLCanvasElement,
  particles: Particle[],
  count: number,
) {
  const cx = Math.random() * canvas.width;
  const cy = canvas.height * (0.2 + Math.random() * 0.4);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;
    const shapes: Particle["shape"][] = ["circle", "rect", "star"];

    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    });
  }
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  const spikes = 5;
  const outerRadius = size;
  const innerRadius = size / 2;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(x, y - outerRadius);

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(
      x + Math.cos(rot) * outerRadius,
      y + Math.sin(rot) * outerRadius,
    );
    rot += step;
    ctx.lineTo(
      x + Math.cos(rot) * innerRadius,
      y + Math.sin(rot) * innerRadius,
    );
    rot += step;
  }

  ctx.lineTo(x, y - outerRadius);
  ctx.closePath();
  ctx.fill();
}

export default function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    let lastBurst = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Initial bursts
    createBurst(canvas, particles, 40);
    setTimeout(() => createBurst(canvas!, particles, 35), 300);
    setTimeout(() => createBurst(canvas!, particles, 30), 600);

    function animate(time: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Continuous bursts every ~1.5s
      if (time - lastBurst > 1500) {
        createBurst(canvas!, particles, 25 + Math.floor(Math.random() * 15));
        lastBurst = time;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.99; // air resistance
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.004;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx!.fill();
        } else if (p.shape === "rect") {
          ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        } else {
          drawStar(ctx!, 0, 0, p.size);
        }

        ctx!.restore();
      }

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
