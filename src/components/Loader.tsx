import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoaderProps {
  onComplete: () => void;
  key?: string;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1000; // 1.0 second total loading duration

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const calculated = Math.min(Math.floor((elapsed / duration) * 100), 100);

      setProgress(calculated);

      if (calculated < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onComplete]);

  // Letters of RANVEER SINGH for stagger revealing
  const nameLetters = "RANVEER SINGH".split("");

  return (
    <div id="loader-viewport" className="fixed inset-0 bg-[#000000] z-[999999] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden">
      {/* Upper Subtle Branding */}
      <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.25em] text-white/40">
        <div />
        <div>2026/EDITION</div>
      </div>

      {/* Centered Masked Typography / Reveal */}
      <div className="flex flex-col items-center justify-center relative my-auto">
        <div className="flex overflow-hidden py-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-[0.18em] text-white">
          {nameLetters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: "150%", opacity: 0, scale: 0.8 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1,
                textShadow: [
                  "0 0 0px rgba(77, 168, 255, 0)",
                  "0 0 15px rgba(77, 168, 255, 0.4)",
                  "0 0 0px rgba(77, 168, 255, 0)"
                ]
              }}
              transition={{
                delay: index * 0.03,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                textShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
              }}
              className={char === " " ? "mr-4" : ""}
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-xs font-mono tracking-[0.4em] text-accent-blue/80 mt-4 md:mt-6 uppercase flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          SYSTEMS INITIALIZING
        </motion.div>
      </div>

      {/* Progress Counter & Progress Bar at bottom */}
      <div className="flex flex-col gap-4 text-white/50 font-mono">
        <div className="flex justify-between items-end text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 tracking-widest uppercase">COMPILING EXPERIENCES</span>
            <span className="text-white/60 tracking-wider">PORTFOLIO v1.0.0</span>
          </div>
          <motion.div
  animate={{
    scale: [1, 1 + progress / 500, 1],
    opacity: [0.7, 1, 0.7],
    textShadow: [
      `0 0 ${progress / 10}px rgba(77,168,255,0.3)`,
      `0 0 ${progress / 4}px rgba(77,168,255,1)`,
      `0 0 ${progress / 10}px rgba(77,168,255,0.3)`
    ]
  }}
  transition={{
    repeat: Infinity,
    duration: Math.max(0.4, 1.8 - progress / 60),
    ease: "easeInOut"
  }}
  className="text-xl font-display font-medium text-white select-none"
>
  {progress}%
</motion.div>
</div>
       
        {/* Loading Bar Frame */}
        <div className="h-[2px] w-full bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-accent-blue shadow-[0_0_8px_#4DA8FF]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
