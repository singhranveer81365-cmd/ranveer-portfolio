import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Crown, Cpu, Layers, Clipboard, Users, MessageSquare, Lightbulb, Zap, PenTool, Film, 
  ExternalLink, Sparkles, FolderKanban, CheckCircle2
} from "lucide-react";
import { skillsList } from "../data/portfolioData";

interface ProofWork {
  title: string;
  role: string;
  date: string;
  description: string;
  metrics?: string;
  links?: { label: string; url: string }[];
  tags: string[];
}

const SKILL_PROOFS: Record<string, ProofWork[]> = {
  Figma: [],
  Canva: [],
  Editing: [],
  Technical: [],
  Management: []
};

export default function Skills() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  const handleSkillSelect = (skillName: string) => {
    setSelectedSkill(skillName);
    // Smooth scroll down to the proof archives display
    setTimeout(() => {
      proofRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  // Return a unique icon for each skill
  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case "Leadership":
        return <Crown className="w-3.5 h-3.5" />;
      case "Technical":
        return <Cpu className="w-3.5 h-3.5" />;
      case "Figma":
        return <Layers className="w-3.5 h-3.5" />;
      case "Management":
        return <Clipboard className="w-3.5 h-3.5" />;
      case "Teamwork":
        return <Users className="w-3.5 h-3.5" />;
      case "Communication":
        return <MessageSquare className="w-3.5 h-3.5" />;
      case "Problem Solving":
        return <Lightbulb className="w-3.5 h-3.5" />;
      case "Innovation":
        return <Zap className="w-3.5 h-3.5" />;
      case "Canva":
        return <PenTool className="w-3.5 h-3.5" />;
      case "Editing":
        return <Film className="w-3.5 h-3.5" />;
      default:
        return <Zap className="w-3.5 h-3.5" />;
    }
  };

  const getSkillDesc = (skill: string) => {
    switch (skill) {
      case "Leadership":
        return "Coordinating teams and directing project timelines with high clarity.";
      case "Technical":
        return "Building engineering core concepts and program structures.";
      case "Figma":
        return "Structuring high-fidelity software mocks and user flows.";
      case "Management":
        return "Scheduling operations, volunteer logs, and micro-stages.";
      case "Teamwork":
        return "Coordinating with cross-functional structures toward collective success.";
      case "Communication":
        return "Bridging complex technical workflows to broad user domains.";
      case "Problem Solving":
        return "Resolving algorithmic anomalies with mathematical focus.";
      case "Innovation":
        return "Deconstructing stale modules to apply modern, fast patterns.";
      case "Canva":
        return "Creating striking visual collateral, posts, and display sheets.";
      case "Editing":
        return "Trimming dynamic video content, frame pacing, audio design, and narrative timing.";
      default:
        return "Synthesizing theoretical details into structural real-world output.";
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  return (
    <section
      id="skills"
      className="relative py-28 px-6 lg:px-12 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background soft lighting spotlights */}
      <div className="absolute top-[40%] left-[8%] w-[300px] h-[300px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-4 text-left font-sans">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-accent-blue tracking-widest font-semibold">04 // ATTRIBUTES</span>
              <div className="h-[1px] w-12 bg-accent-blue/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#F5F5F5] uppercase">
              CAPABILITIES <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#BFC0C0]">&amp; SKILLS</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-white/30 tracking-wider">
            CLICK ON A SKILL TO OPEN VERIFIED PROOF OF WORK
          </p>
        </div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-left"
        >
          {skillsList.map((skill, index) => {
            const hasProofs = !!SKILL_PROOFS[skill];
            const isSelected = selectedSkill === skill;
            
            return (
              <motion.div
                key={index}
                variants={itemVars}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleSkillSelect(skill)}
                className={`relative group cursor-none rounded-none transition-all duration-500 overflow-hidden select-none border ${
                  isSelected 
                    ? "border-accent-blue bg-accent-blue/[0.04] shadow-[0_0_20px_rgba(77,168,255,0.08)]" 
                    : "border-white/[0.03] hover:border-white/10"
                }`}
                data-cursor="click"
              >
                {/* Box container */}
                <div className="relative h-full p-5 flex flex-col justify-between">
                  
                  {/* Horizontal dynamic line on hover */}
                  <div className={`absolute top-0 left-0 h-[1.5px] bg-gradient-to-r from-accent-blue to-white transition-all duration-700 ease-in-out ${
                    isSelected ? "w-full" : "w-0 group-hover:w-full"
                  }`} />

                  <div className="space-y-4">
                    {/* Icon Area */}
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 bg-white/[0.01] border transition-all duration-300 ${
                        isSelected 
                          ? "border-accent-blue text-accent-blue scale-105" 
                          : "border-white/[0.04] group-hover:border-accent-blue/20 text-[#BFC0C0] group-hover:text-accent-blue group-hover:scale-105"
                      }`}>
                        {getSkillIcon(skill)}
                      </div>
                      {/* Catalog number */}
                      <span className="text-[9px] font-mono tracking-widest text-white/20">
                        SKL // 0{index + 1}
                      </span>
                    </div>

                    {/* Skill Name */}
                    <div className="space-y-1">
                      <h3 className={`text-md font-display font-medium tracking-wide transition-colors duration-300 ${
                        isSelected ? "text-accent-blue" : "text-white group-hover:text-accent-blue"
                      }`}>
                        {skill}
                      </h3>
                      {hasProofs && (
                        <span className="text-[8px] font-mono tracking-widest text-[#4DA8FF]/60 uppercase flex items-center gap-1">
                          <span className="w-1 h-1 bg-accent-blue rounded-full animate-ping" />
                          Proof available
                        </span>
                      )}
                    </div>

                    {/* Descriptive text */}
                    <p className="text-xs text-[#BFC0C0]/60 leading-relaxed font-sans font-light line-clamp-3">
                      {getSkillDesc(skill)}
                    </p>
                  </div>

                  {/* Quality tracker meter at bottom */}
                  <div className="mt-6 pt-4 border-t border-white/[0.02]">
                    <div className="flex justify-between text-[8px] font-mono tracking-wider text-white/20 uppercase mb-1.5">
                      <span>status</span>
                      <span className="text-accent-blue/50 font-semibold uppercase">
                        {isSelected ? "active view" : "click to view"}
                      </span>
                    </div>
                    {/* Mini solid line meter */}
                    <div className="h-[1.5px] w-full bg-white/5 relative overflow-hidden">
                      <motion.div 
                        className="h-full bg-accent-blue" 
                        initial={{ width: "0%" }}
                        animate={{ width: isSelected ? "100%" : "30%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Separate interactive showcase section for Selected Skill Projects */}
        <div 
          ref={proofRef} 
          className="pt-10 scroll-mt-28"
        >
          <AnimatePresence mode="wait">
            {selectedSkill && SKILL_PROOFS[selectedSkill] && (
              <motion.div
                key={selectedSkill}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="glass-panel border border-white/[0.03] p-8 md:p-10 relative overflow-hidden text-left"
              >
                {/* Tech Deco absolute background label */}
                <div className="absolute top-4 right-4 text-[9px] font-mono text-white/10 tracking-widest uppercase select-none">
                  proof sector // {selectedSkill.substring(0, 3)}
                </div>

                <div className="space-y-8">
                  {/* Proof Header details */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.03] pb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-accent-blue uppercase tracking-widest font-semibold">
                        <FolderKanban className="w-4 h-4" />
                        <span>Verifiable Project Artifacts</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                        Works Done in <span className="text-accent-blue">{selectedSkill}</span>
                      </h3>
                    </div>
                    
                    <div className="px-4 py-2 bg-white/[0.01] border border-white/5 text-[10px] font-mono tracking-widest text-[#BFC0C0]/60 uppercase flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
                      <span>{SKILL_PROOFS[selectedSkill].length} Artifacts Registered</span>
                    </div>
                  </div>

                  {/* List of projects */}
                  {SKILL_PROOFS[selectedSkill] && SKILL_PROOFS[selectedSkill].length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {SKILL_PROOFS[selectedSkill].map((work, widx) => (
                        <motion.div
                          key={widx}
                          className="p-6 bg-white/[0.01] border border-white/[0.03] hover:border-accent-blue/30 transition-all duration-500 overflow-hidden flex flex-col justify-between h-[250px]"
                          whileHover={{ y: -4 }}
                        >
                          <div className="space-y-4">
                            {/* Date and Role line */}
                            <div className="flex justify-between items-center text-[9px] font-mono text-white/35 uppercase">
                              <span>{work.role}</span>
                              <span>{work.date}</span>
                            </div>

                            {/* Work Title */}
                            <h4 className="text-sm font-semibold font-sans text-white uppercase tracking-tight line-clamp-1">
                              {work.title}
                            </h4>

                            {/* Work Description */}
                            <p className="text-xs text-[#BFC0C0]/55 line-clamp-3 leading-relaxed">
                              {work.description}
                            </p>
                          </div>

                          {/* Metrics and Tags, Links */}
                          <div className="pt-4 border-t border-white/[0.03] space-y-3">
                            {work.metrics && (
                              <div className="text-[10px] font-mono text-accent-blue uppercase font-semibold">
                                {work.metrics}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-1">
                              {work.tags.map((tag, tIdx) => (
                                <span 
                                  key={tIdx} 
                                  className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 bg-white/[0.02] border border-white/5 text-[#BFC0C0]/40 rounded-none"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {work.links && work.links.map((link, lIdx) => (
                              <div key={lIdx} className="pt-1 flex items-center justify-between text-[9px] font-mono text-white/30 uppercase">
                                <span className="flex items-center gap-1.5 text-emerald-400">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400/80" /> Verified proof
                                </span>
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-accent-blue hover:text-white transition-colors flex items-center gap-1 cursor-none"
                                >
                                  {link.label}
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-white/[0.02] bg-white/[0.005] py-16 px-6 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent-blue/10 rounded-full blur-xl scale-125" />
                        <FolderKanban className="w-10 h-10 text-accent-blue/40 relative z-10" />
                      </div>
                      <div className="space-y-1.5 max-w-md">
                        <h4 className="text-[#F5F5F5] font-display text-sm tracking-widest uppercase font-semibold">
                          Workspace Prepared // No Projects Logged Yet
                        </h4>
                        <p className="text-xs text-[#BFC0C0]/50 leading-relaxed font-sans font-light">
                          Nothing here yet. You can document and showcase your live links relative to <span className="text-accent-blue font-medium font-mono">{selectedSkill}</span> directly. This area is framed and ready to host your future works!
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
