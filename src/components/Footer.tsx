import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUp, Github, Linkedin, Instagram } from "lucide-react";
import { socialLinks } from "../data/portfolioData";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const handleMagneticMove = (event: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    target.style.transform = `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
  };

  const resetMagnetic = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.transform = "translate3d(0, 0, 0)";
  };

  const socialItems = [
    { label: "LinkedIn", href: socialLinks.linkedin, icon: <Linkedin className="w-4 h-4" /> },
    { label: "GitHub", href: socialLinks.github, icon: <Github className="w-4 h-4" /> },
    { label: "Instagram", href: socialLinks.instagram, icon: <Instagram className="w-4 h-4" /> }
  ].filter((item) => item.href);

  return (
    <motion.footer
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-luxury-black border-t border-white/[0.03] px-6 lg:px-12 pt-20 pb-12 select-none z-10 overflow-hidden"
    >
      <div className="absolute top-0 left-0 h-[1px] w-full overflow-hidden bg-white/[0.03]">
        <motion.div
          initial={shouldReduceMotion ? false : { x: "-100%" }}
          whileInView={shouldReduceMotion ? undefined : { x: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full bg-gradient-to-r from-transparent via-accent-blue/60 to-transparent"
        />
      </div>

      <button
        onClick={scrollToTop}
        data-cursor="top"
        id="scroll-to-top-btn"
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-luxury-gray border border-white/[0.08] hover:border-accent-blue hover:bg-accent-blue/5 text-[#BFC0C0] hover:text-[#4DA8FF] hover:shadow-[0_0_15px_rgba(77,168,255,0.2)] transition-all duration-500 rounded-none cursor-none flex items-center justify-center group"
        title="Scroll To Top"
      >
        <ArrowUp className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-1" />
      </button>

      <div className="w-full max-w-7xl mx-auto space-y-12">
        <div className="glass-panel-neon p-6 md:p-8 rounded-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-10 h-[1px] bg-accent-blue/40" />
          <div className="absolute top-0 left-0 w-[1px] h-10 bg-accent-blue/40" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <span className="text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase block">
              Social Links
            </span>
            <div className="flex items-center gap-3">
              {socialItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  data-cursor={item.label.toLowerCase()}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={resetMagnetic}
                  className="p-3 bg-white/[0.01] hover:bg-accent-blue/5 border border-white/[0.04] hover:border-accent-blue/30 text-white/45 hover:text-accent-blue transition-all duration-500 group"
                >
                  <span className="block transition-transform duration-500 group-hover:-translate-y-0.5">
                    {item.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-white/30 tracking-wider">
          <p>Designed and developed by Ranveer Singh</p>
          <p className="text-white/20 select-none">
            Copyright {currentYear} Ranveer Singh. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
