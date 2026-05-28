import React from "react";
import { motion } from "motion/react";
import { ArrowUp, Github, Linkedin, Instagram, Heart } from "lucide-react";
import { personalInfo, socialLinks } from "../data/portfolioData";

export default function Footer() {
  const scrollHeight = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-luxury-black border-t border-white/[0.03] pt-16 pb-12 px-6 lg:px-12 select-none z-10">
      
      {/* Scroll to Top Trigger */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={scrollHeight}
          data-cursor="top"
          id="scroll-to-top-btn"
          className="p-3 bg-luxury-gray border border-white/[0.08] hover:border-accent-blue hover:bg-accent-blue/5 text-[#BFC0C0] hover:text-[#4DA8FF] hover:shadow-[0_0_15px_rgba(77,168,255,0.2)] transition-all duration-300 rounded-none cursor-none flex items-center justify-center group"
          title="Scroll To Top"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-10">
        
        {/* Core details split layout */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-10 border-b border-white/[0.02]">
          
          <div className="text-left space-y-2">
            <h3 className="text-xl font-display font-bold tracking-wider text-white uppercase">
              {personalInfo.name}
            </h3>
            <p className="text-xs font-mono tracking-widest text-[#BFC0C0]/50 uppercase">
              {personalInfo.role}
            </p>
          </div>

          {/* Social connections links */}
          <div className="flex items-center gap-3">
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor="linkedin"
                className="p-2.5 bg-white/[0.01] hover:bg-accent-blue/5 border border-white/[0.04] hover:border-accent-blue/30 text-white/40 hover:text-accent-blue transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor="instagram"
                className="p-2.5 bg-white/[0.01] hover:bg-accent-blue/5 border border-white/[0.04] hover:border-accent-blue/30 text-white/40 hover:text-accent-blue transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}

            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="github"
                className="p-2.5 bg-white/[0.01] hover:bg-accent-blue/5 border border-white/[0.04] hover:border-accent-blue/30 text-white/40 hover:text-accent-blue transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

        {/* Bottom sign statement with live timezone */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/30 tracking-wider">
          
          <p className="flex items-center gap-1.5 hover:text-white/50 transition-colors">
            Designed & Developed by Ranveer Singh
          </p>

          <p className="text-white/20 select-none">
            © {currentYear} SINGHRANVEER81365 // ALL RIGHTS PERSISTED
          </p>
          
        </div>

      </div>
    </footer>
  );
}
