import React, { useEffect, useRef } from "react";

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <>
      {/* Noise texture overlay */}
      <div className="noise-overlay" style={{ opacity: 0.015 }} />
      {/* Custom grid-overlay */}
      <div className="grid-overlay" />
      <canvas
        id="bg-canvas"
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen -z-50 pointer-events-none"
      />
    </>
  );
}
