import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cpu, Film, FolderKanban, Layers, Clipboard, PenTool } from "lucide-react";
import { skillsList } from "../data/portfolioData";
import SectionReveal from "../components/SectionReveal";

const skillDetails: Record<string, { icon: React.ReactNode; description: string; focus: string }> = {
  Technical: {
    icon: <Cpu className="w-3.5 h-3.5" />,
    description: "Programming fundamentals, analytical thinking, and structured problem solving.",
    focus: "Engineering Core"
  },
  Figma: {
    icon: <Layers className="w-3.5 h-3.5" />,
    description: "Interface layouts, user flows, and clean visual systems for digital products.",
    focus: "Product Design"
  },
  Management: {
    icon: <Clipboard className="w-3.5 h-3.5" />,
    description: "Volunteer coordination, event planning, and reliable execution under deadlines.",
    focus: "Operations"
  },
  Canva: {
    icon: <PenTool className="w-3.5 h-3.5" />,
    description: "Presentation assets, posters, and communication material with polished hierarchy.",
    focus: "Visual Communication"
  },
  Editing: {
    icon: <Film className="w-3.5 h-3.5" />,
    description: "Frame pacing, concise storytelling, and content refinement for sharper delivery.",
    focus: "Content Craft"
  }
};

interface ProofItem {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

const skillProofs: Record<string, ProofItem[]> = {
  // Add real projects here later.
  // Example:
  // Technical: [
  //   {
  //     title: "Project Name",
  //     description: "Short result-focused project description.",
  //     tags: ["React", "AI/ML", "GitHub"],
  //     link: "https://..."
  //   }
  // ],
  Technical: [],
  Figma: [],
  Management: [],
  Canva: [],
  Editing: []
};

const futureProjectGuides: Record<string, string[]> = {
  Technical: ["Coding projects", "AI/ML experiments", "GitHub repositories"],
  Figma: ["UI case studies", "Wireframes", "Prototype links"],
  Management: ["Event roles", "Volunteer outcomes", "Team coordination proof"],
  Canva: ["Posters", "Presentation assets", "Event creatives"],
  Editing: ["Video edits", "Reels", "Before/after cuts"]
};

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  const handleSkillClick = (skill: string) => {
    setSelectedSkill((current) => (current === skill ? null : skill));
    window.setTimeout(() => {
      proofRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
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
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <section
      id="skills"
      className="relative py-28 px-6 lg:px-12 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <div className="absolute top-[40%] left-[8%] w-[300px] h-[300px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <SectionReveal className="w-full max-w-7xl mx-auto space-y-16">
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
            CLICK A SKILL TO OPEN PROOF OF WORK
          </p>
        </div>

        <motion.div
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-left"
        >
          {skillsList.map((skill, index) => {
            const detail = skillDetails[skill];
            const isSelected = selectedSkill === skill;

            return (
              <motion.div
                key={skill}
                variants={itemVars}
                onClick={() => handleSkillClick(skill)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSkillClick(skill);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isSelected}
                data-cursor="click"
                className={`relative group cursor-none rounded-none transition-all duration-500 overflow-hidden select-none border ${
                  isSelected
                    ? "border-accent-blue bg-accent-blue/[0.04] shadow-[0_0_20px_rgba(77,168,255,0.08)]"
                    : "border-white/[0.03] hover:border-white/10"
                }`}
              >
                <div className="relative h-full p-5 flex flex-col justify-between">
                  <div className={`absolute top-0 left-0 h-[1.5px] bg-gradient-to-r from-accent-blue to-white transition-all duration-700 ease-in-out ${
                    isSelected ? "w-full" : "w-0 group-hover:w-full"
                  }`} />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 bg-white/[0.01] border group-hover:border-accent-blue/20 group-hover:scale-105 transition-all duration-300 ${
                        isSelected ? "border-accent-blue text-accent-blue" : "border-white/[0.04] text-[#BFC0C0] group-hover:text-accent-blue"
                      }`}>
                        {detail.icon}
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-white/20">
                        SKL // 0{index + 1}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className={`text-md font-display font-medium tracking-wide transition-colors duration-300 ${
                        isSelected ? "text-accent-blue" : "text-white group-hover:text-accent-blue"
                      }`}>
                        {skill}
                      </h3>
                      <span className="text-[8px] font-mono tracking-widest text-[#4DA8FF]/60 uppercase">
                        {detail.focus}
                      </span>
                    </div>

                    <p className="text-xs text-[#BFC0C0]/60 leading-relaxed font-sans font-light">
                      {detail.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.02]">
                    <div className="flex justify-between text-[8px] font-mono tracking-wider text-white/20 uppercase mb-1.5">
                      <span>proof</span>
                      <span className="text-accent-blue/50 font-semibold uppercase">
                        {isSelected ? "open" : "click to view"}
                      </span>
                    </div>
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

        <div ref={proofRef} className="scroll-mt-28">
          <AnimatePresence mode="wait">
            {selectedSkill && (
              <motion.div
                key={selectedSkill}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border border-white/[0.03] p-8 md:p-10 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-accent-blue/40" />
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-accent-blue/40" />
                <div className="absolute top-4 right-4 text-[9px] font-mono text-white/10 tracking-widest uppercase select-none">
                  proof sector // {selectedSkill.slice(0, 3)}
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.03] pb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-accent-blue uppercase tracking-widest font-semibold">
                        <FolderKanban className="w-4 h-4" />
                        <span>Future Project Archive</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                        {selectedSkill} <span className="text-accent-blue">Projects</span>
                      </h3>
                      <p className="max-w-2xl text-sm text-[#BFC0C0]/55 leading-relaxed font-light">
                        This space is prepared for real project proof. Once projects are uploaded, they will appear here with links, tags, and concise outcomes.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSkill(null)}
                      data-cursor="close"
                      className="cursor-none px-4 py-2 bg-white/[0.01] border border-white/5 hover:border-accent-blue/30 text-[10px] font-mono tracking-widest text-[#BFC0C0]/60 hover:text-accent-blue uppercase transition-all duration-300"
                    >
                      Close Panel
                    </button>
                  </div>

                  {skillProofs[selectedSkill].length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {skillProofs[selectedSkill].map((work) => (
                        <motion.article
                          key={work.title}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="p-6 bg-white/[0.01] border border-white/[0.03] hover:border-accent-blue/30 transition-all duration-500 overflow-hidden min-h-[230px] flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold font-sans text-white uppercase tracking-tight">
                              {work.title}
                            </h4>

                            <p className="text-xs text-[#BFC0C0]/55 leading-relaxed">
                              {work.description}
                            </p>
                          </div>

                          <div className="pt-4 mt-6 border-t border-white/[0.03] space-y-3">
                            <div className="flex flex-wrap gap-1.5">
                              {work.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 bg-white/[0.02] border border-white/5 text-[#BFC0C0]/40 rounded-none"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-white/[0.03] bg-white/[0.01] p-6 md:p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-5 space-y-3">
                          <span className="text-[10px] font-mono tracking-[0.25em] text-accent-blue uppercase">
                            No projects uploaded yet
                          </span>
                          <h4 className="text-xl font-display font-bold text-white uppercase tracking-tight">
                            Coming soon
                          </h4>
                          <p className="text-sm text-[#BFC0C0]/55 leading-relaxed font-light">
                            When you add your first {selectedSkill.toLowerCase()} project, this panel will turn into a live proof section instead of showing placeholder work.
                          </p>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {futureProjectGuides[selectedSkill].map((item, index) => (
                            <div
                              key={item}
                              className="min-h-[96px] p-4 border border-white/[0.03] bg-luxury-gray/30 flex flex-col justify-between"
                            >
                              <span className="text-[9px] font-mono tracking-widest text-white/20">
                                SLOT // 0{index + 1}
                              </span>
                              <span className="text-xs font-mono tracking-widest text-[#BFC0C0]/55 uppercase">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionReveal>
    </section>
  );
}
