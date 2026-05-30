import React, { useEffect, useRef } from "react";

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener("resize", handleResize);

    // Render a high-end static luxury dark background with ultra subtle vignette
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep rich slate-black background solid fill
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);

      // Super quiet, elegant center glow for a premium vignette look
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, "#08080a");
      bgGrad.addColorStop(0.6, "#040405");
      bgGrad.addColorStop(1, "#030303");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    const glow = glowRef.current;
    if (!grid || !glow) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const pointer = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      current.x += (pointer.x - current.x) * 0.055;
      current.y += (pointer.y - current.y) * 0.055;

      grid.style.transform = `translate3d(${current.x * 7}px, ${current.y * 7}px, 0)`;
      glow.style.transform = `translate3d(${current.x * -14}px, ${current.y * -10}px, 0)`;

      raf = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
  <div className="noise-overlay" style={{ opacity: 0.015 }} />
  <div ref={gridRef} className="grid-overlay" />
  <div ref={glowRef} className="ambient-blueprint-glow" />

  {/* Luxury White Light Sweep */}
  <div className="light-sweep" />

  <canvas
    id="bg-canvas"
    ref={canvasRef}
    className="fixed top-0 left-0 w-screen h-screen -z-50 pointer-events-none"
  />
</>
  );
}
