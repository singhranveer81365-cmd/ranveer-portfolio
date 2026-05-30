import React from "react";
import { motion } from "motion/react";
import { Landmark, Terminal, Radio } from "lucide-react";
import { experienceList } from "../data/portfolioData";
import SectionReveal from "../components/SectionReveal";

export default function Experience() {
  const getIcon = (org: string) => {
    switch (org) {
      case "IEEE":
        return <Radio className="w-3.5 h-3.5 text-accent-blue" />;
      case "AWS Cloud Club":
        return <Terminal className="w-3.5 h-3.5 text-accent-blue" />;
      default:
        return <Landmark className="w-3.5 h-3.5 text-accent-blue" />;
    }
  };

  return (
    <section
      id="experience"
      className="relative py-28 px-6 lg:px-12 glass-panel border-y border-white/[0.02] flex items-center justify-center select-none overflow-hidden"
    >
      <div className="absolute bottom-[20%] left-[20%] w-[250px] h-[250px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <SectionReveal className="w-full max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-accent-blue tracking-widest font-semibold">02 // ENGAGEMENTS</span>
              <div className="h-[1px] w-12 bg-accent-blue/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#F5F5F5] uppercase">
              PROFESSIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#BFC0C0]">MEMBERSHIPS</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-white/30 tracking-wider">
            VOLUNTEERING AND SKILL SYNTHESIS
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {experienceList.map((exp, index) => (
            <motion.div
              key={exp.organization}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              className="relative group h-full"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-accent-blue/15 to-transparent rounded-none blur-md opacity-20 group-hover:opacity-75 transition-opacity duration-500" />

              <div className="relative h-full bg-luxury-gray/90 border border-white/[0.03] group-hover:border-accent-blue/35 p-8 rounded-none transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-accent-blue/40" />
                <div className="absolute top-0 left-0 w-[1px] h-8 bg-accent-blue/40" />

                <div className="absolute top-4 right-4 text-[9px] font-mono tracking-widest text-white/20 select-none">
                  SOU // EXP.0{index + 1}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 bg-white/[0.01] border border-white/[0.04] group-hover:border-accent-blue/10 transition-all duration-300">
                      {getIcon(exp.organization)}
                    </div>
                    <span className="text-xs font-mono tracking-wider text-accent-blue font-semibold">
                      {exp.period}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-white tracking-tight">
                      {exp.organization}
                    </h3>
                    <p className="text-xs font-mono tracking-widest text-[#BFC0C0] uppercase">
                      ROLE: {exp.role}
                    </p>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed font-light font-sans group-hover:text-white/70 transition-colors duration-300">
                    "{exp.description}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
