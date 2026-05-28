import React from "react";
import { motion } from "motion/react";
import { ArrowDown, Mail, FileText, MapPin, Sparkles } from "lucide-react";
import { personalInfo } from "../data/portfolioData";

interface HeroProps {
  onContactClick: () => void;
  onResumeClick: () => void;
}

export default function Hero({ onContactClick, onResumeClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 lg:px-12 py-24 select-none overflow-hidden"
    >
      {/* Absolute Glow Spotlights */}
      <div className="absolute top-[20%] left-[20%] w-[150px] md:w-[350px] h-[150px] md:h-[350px] bg-accent-blue/10 rounded-full blur-[80px] md:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[120px] md:w-[250px] h-[120px] md:h-[250px] bg-white/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Premium Typography Content */}
        <div className="lg:col-span-7 flex flex-col text-left space-y-8 z-10">

          {/* Heading Name Masked Reveal */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight text-[#F5F5F5] leading-none">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="block"
              >
                RANVEER
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BFC0C0] to-accent-blue"
              >
                SINGH
              </motion.span>
            </h1>

            {/* Tagline / Subtitle */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
            </span>
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-accent-blue font-semibold">
              {personalInfo.role}
            </span>
          </motion.div>

            {/* Core Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg text-[#BFC0C0] max-w-xl font-sans font-light leading-relaxed"
            >
              Motivated engineering student passionate about technology, innovation, and problem solving.
            </motion.p>
          </div>

          {/* Minimal Location info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-3 text-white/40 text-xs font-mono"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-blue" />
              <span>{personalInfo.location}</span>
            </div>
            <span className="opacity-40">|</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BFC0C0]" />
              <span>Silver Oak University</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <button
              onClick={onResumeClick}
              data-cursor="open"
              id="hero-resume-btn"
              className="cursor-none px-6 py-3.5 rounded-none border border-white hover:border-accent-blue bg-white hover:bg-transparent text-black hover:text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center gap-2 group relative overflow-hidden"
            >
              <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
              View Resume
            </button>

            <button
              onClick={onContactClick}
              data-cursor="click"
              id="hero-contact-btn"
              className="cursor-none px-6 py-3.5 rounded-none border border-white/10 hover:border-accent-blue/80 bg-luxury-gray/40 hover:bg-accent-blue/5 text-[#F5F5F5] hover:text-accent-blue font-mono text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center gap-2 group relative overflow-hidden"
            >
              <Mail className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Contact Me
            </button>
          </motion.div>
        </div>

        {/* Right Column: Premium Interactive Portrait Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full max-w-[340px] md:max-w-[380px] aspect-[4/5] md:aspect-[3/4]"
          >
            {/* Ambient Background Glow of Avatar Frame */}
            <div className="absolute -inset-1.5 bg-gradient-to-b from-accent-blue/20 to-white/5 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            
            {/* Outer Box / Frame */}
            <div className="relative w-full h-full rounded-xl overflow-hidden glass-panel-neon p-3 flex items-center justify-center group">
              
              {/* Corner brackets simulating camera capture or cinematic lens frame */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-accent-blue/30 group-hover:border-accent-blue transition-colors duration-500" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-accent-blue/30 group-hover:border-accent-blue transition-colors duration-500" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-accent-blue/30 group-hover:border-accent-blue transition-colors duration-500" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-accent-blue/30 group-hover:border-accent-blue transition-colors duration-500" />

              {/* Inner Picture */}
              <div className="w-full h-full relative overflow-hidden rounded-md">
                <motion.img
                  src={personalInfo.avatarImage}
                  alt={personalInfo.name}
                  referrerPolicy="no-referrer"
                  initial={{ scale: 1.1, filter: "blur(8px)" }}
                  animate={{ scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  whileHover={{ scale: 1.04 }}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-cover transition-all duration-700 select-none pointer-events-none"
                />
                {!personalInfo.avatarImage && (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs uppercase tracking-[0.3em] text-white/40">
                    Avatar image unavailable
                  </div>
                )}

                {/* Cyber Tech Layer Graphic Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-6 left-6 text-left space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-mono tracking-widest text-[#BFC0C0] block">DESIGNATION // 01</span>
                  <span className="font-display text-sm font-semibold text-white tracking-wider uppercase">{personalInfo.role}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Down Floating Signifier */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 cursor-pointer text-white/30 hover:text-[#4DA8FF] flex flex-col items-center gap-1 transition-colors z-10"
        onClick={onContactClick}
        data-cursor="scroll"
      >
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase">SCROLL TIMELINE</span>
        <ArrowDown className="w-4 h-4 text-accent-blue/60" />
      </motion.div>
    </section>
  );
}
