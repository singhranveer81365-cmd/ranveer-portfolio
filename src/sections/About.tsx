import React from "react";
import { motion } from "motion/react";
import { aboutText } from "../data/portfolioData";
import { ShieldAlert, BookOpen, Fingerprint } from "lucide-react";

export default function About() {
  // Stagger words for premium cinematic reveal
  const words = aboutText.split(" ");

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.2,
      },
    },
  };

  const wordVars = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="about"
      className="relative py-28 px-6 lg:px-12 glass-panel border-y border-white/[0.02] flex items-center justify-center select-none overflow-hidden"
    >
      {/* Background Soft Spotlight */}
      <div className="absolute top-[50%] left-[5%] w-[300px] h-[300px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Animated Section Code and Title */}
        <div className="lg:col-span-4 flex flex-col space-y-6 text-left">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-accent-blue tracking-widest font-semibold">01 // PROFILE</span>
            <div className="h-[1px] w-12 bg-accent-blue/30" />
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#F5F5F5] uppercase leading-none">
            ENGINEERING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-white to-[#BFC0C0]">
              FOUNDATION
            </span>
          </h2>

          <div className="hidden lg:flex flex-col gap-4 mt-6 text-xs font-mono text-white/30 space-y-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-accent-blue/60" />
              <span>ACADEMIC FOCUS: AI & MACHINE LEARNING</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent-blue/60" />
              <span>CURRENT ENVIRONMENT: FIRST YEAR B.TECH CE</span>
            </div>
          </div>
        </div>

        {/* Right Side: Exact Text Stagger Reveal */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            variants={containerVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg sm:text-xl md:text-2xl font-sans font-light text-[#BFC0C0] leading-relaxed tracking-wide text-left"
          >
            {words.map((word, idx) => (
              <motion.span
                key={idx}
                variants={wordVars}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Core Values Badge Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/[0.04]">
            <div className="p-5 bg-luxury-gray/30 border border-white/[0.01] hover:border-accent-blue/10 transition-colors duration-300">
              <div className="text-accent-blue text-xs font-mono tracking-widest uppercase mb-2">01 / DISCIPLINE</div>
              <p className="text-xs text-white/40 font-sans leading-relaxed">
                Applying rigorous analytical thinking to decompose complex engineering problems.
              </p>
            </div>

            <div className="p-5 bg-luxury-gray/30 border border-white/[0.01] hover:border-accent-blue/10 transition-colors duration-300">
              <div className="text-accent-blue text-xs font-mono tracking-widest uppercase mb-2">02 / CURIOSITY</div>
              <p className="text-xs text-white/40 font-sans leading-relaxed">
                Striving to continuous technical skill acquisition in collaborative systems.
              </p>
            </div>

            <div className="p-5 bg-luxury-gray/30 border border-white/[0.01] hover:border-accent-blue/10 transition-colors duration-300">
              <div className="text-accent-blue text-xs font-mono tracking-widest uppercase mb-2">03 / APPLICATION</div>
              <p className="text-xs text-white/40 font-sans leading-relaxed">
                Eagerly seeking and deploying concepts in modern programmatic environments.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
