import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Printer, Mail, Phone, MapPin, Download, Briefcase, GraduationCap, Award, FileText } from "lucide-react";
import { personalInfo, aboutText, educationList, experienceList, skillsList } from "../data/portfolioData";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
          
          {/* Dark Glass Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-none"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#0D0D0D] border border-white/[0.08] flex flex-col overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)] rounded-none print:max-h-none print:border-none print:bg-white text-left text-white"
          >
            
            {/* Header / Actions Panel */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.05] bg-luxury-black max-h-[60px] select-none print:hidden">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-accent-blue font-bold">
                <FileText className="w-4 h-4 text-accent-blue" />
                <span>RANVEER_SINGH_RESUME.CJS</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  data-cursor="print"
                  className="p-2 bg-white/[0.02] border border-white/[0.05] hover:border-accent-blue/30 text-[#BFC0C0] hover:text-[#4DA8FF] text-xs transition-colors flex items-center gap-1.5 font-mono uppercase tracking-widest"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[9px]">Print Node</span>
                </button>
                <button
                  onClick={onClose}
                  data-cursor="close"
                  className="p-2 bg-white/[0.02] border border-white/[0.05] hover:border-rose-500/30 text-white/50 hover:text-rose-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Curriculum Vitae Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 print:overflow-visible print:p-0 print:text-black">
              
              {/* Cover/Top Panel: Information */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-8 print:border-neutral-230">
                <div className="space-y-3">
                  <span className="text-xs font-mono text-accent-blue tracking-[0.3em] uppercase block print:text-neutral-500 print:text-[10px]">
                    PORTFOLIO CURRICULUM VITAE
                  </span>
                  <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white print:text-black">
                    {personalInfo.name}
                  </h1>
                  <p className="text-sm md:text-md text-white/55 font-mono tracking-wider print:text-neutral-600">
                    {personalInfo.role}
                  </p>
                </div>

                {/* Direct info list */}
                <div className="space-y-2 text-xs font-mono text-[#BFC0C0] md:text-right print:text-black print:space-y-1">
                  <div className="flex items-center md:justify-end gap-2.5">
                    <span className="text-[10px] text-white/20 print:hidden">// TELEPHONY</span>
                    <a href={`tel:${personalInfo.phone}`} className="hover:text-accent-blue print:text-black font-medium">{personalInfo.phone}</a>
                    <Phone className="w-3.5 h-3.5 text-accent-blue/60 print:hidden" />
                  </div>
                  <div className="flex items-center md:justify-end gap-2.5">
                    <span className="text-[10px] text-white/20 print:hidden">// ADDRESS_COM</span>
                    <a href={`mailto:${personalInfo.email}`} className="hover:text-accent-blue print:text-black font-medium">{personalInfo.email}</a>
                    <Mail className="w-3.5 h-3.5 text-accent-blue/60 print:hidden" />
                  </div>
                  <div className="flex items-center md:justify-end gap-2.5">
                    <span className="text-[10px] text-white/20 print:hidden">// COORDINATES</span>
                    <span className="text-[#BFC0C0] print:text-black">{personalInfo.location}</span>
                    <MapPin className="w-3.5 h-3.5 text-accent-blue/60 print:hidden" />
                  </div>
                </div>
              </div>

              {/* Personal Statement / Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-widest font-semibold uppercase print:text-neutral-700">
                  <FileText className="w-4 h-4" />
                  <span>Personal Synopsis</span>
                </div>
                <p className="text-base text-white/70 leading-relaxed font-sans font-light tracking-wide print:text-black">
                  {aboutText}
                </p>
              </div>

              {/* Academic Timeline */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-widest font-semibold uppercase border-b border-white/[0.04] pb-2 print:text-neutral-700">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education Matrix // SOU</span>
                </div>
                <div className="space-y-6">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 text-sm">
                      <div className="md:col-span-3 text-xs font-mono text-accent-blue font-semibold print:text-neutral-600">
                        {edu.period}
                      </div>
                      <div className="md:col-span-9 space-y-1">
                        <h4 className="text-base font-display font-bold text-white print:text-black">{edu.degree}</h4>
                        <p className="text-xs text-white/60 print:text-neutral-600">{edu.institution} — <span className="text-accent-blue/80 font-mono text-[11px] font-semibold">{edu.field}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagements / Experiences */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-widest font-semibold uppercase border-b border-white/[0.04] pb-2 print:text-neutral-700">
                  <Briefcase className="w-4 h-4" />
                  <span>Structured Experience</span>
                </div>
                <div className="space-y-8">
                  {experienceList.map((exp, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 text-sm">
                      <div className="md:col-span-3 text-xs font-mono text-accent-blue font-semibold print:text-neutral-600">
                        {exp.period}
                      </div>
                      <div className="md:col-span-9 space-y-2">
                        <h4 className="text-base font-display font-bold text-white print:text-black">
                          {exp.organization} — <span className="font-mono text-xs uppercase text-[#BFC0C0]/60 print:text-neutral-500">{exp.role}</span>
                        </h4>
                        <p className="text-xs leading-relaxed text-white/60 font-light print:text-neutral-600 italic">
                          “{exp.description}”
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Area */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-widest font-semibold uppercase border-b border-white/[0.04] pb-2 print:text-neutral-700">
                  <Award className="w-4 h-4" />
                  <span>Technical Attributes</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsList.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] font-mono text-xs text-white/80 rounded-none print:border-neutral-300 print:text-black print:bg-neutral-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Sign-off */}
            <div className="px-12 py-6 bg-luxury-black border-t border-white/[0.03] flex justify-between items-center text-[9px] font-mono text-white/20 select-none print:hidden">
              <span>DESIGNED AND COMPILED BY RANVEER SINGH © 2026</span>
              <span className="text-accent-blue">SYSTEM_PORT_ONLINE</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
