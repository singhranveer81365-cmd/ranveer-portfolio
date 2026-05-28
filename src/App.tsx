import React, { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { motion, AnimatePresence } from "motion/react";
import BackgroundEffect from "./components/BackgroundEffect";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import ResumeModal from "./components/ResumeModal";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Track scroll positioning for top progress indicator
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percent = (window.scrollY / scrollHeight) * 100;
        setScrollProgress(percent);
      }
    };

    window.addEventListener("scroll", handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  // Lock scroll in smooth scroll context when Resume drawer is visible
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isResumeOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isResumeOpen]);

  // Smooth scroll trigger to coordinates ID
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative font-sans text-[#BFC0C0] min-h-screen bg-luxury-black overflow-x-hidden selection:bg-accent-blue/20 selection:text-white">
      {/* Dynamic Background visualizer canvas and custom cursor */}
      <BackgroundEffect />
      <CustomCursor />

      {/* Cinematic intro Preloader */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader key="preloader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Container contents */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-screen flex flex-col justify-between"
        >
          {/* Scroll progress loading bar pinned to viewport top */}
          <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-white/[0.03] z-[9999] pointer-events-none">
            <div 
              style={{ width: `${scrollProgress}%` }}
              className="h-full bg-accent-blue shadow-[0_0_8px_#4DA8FF] transition-all duration-100 ease-out"
            />
          </div>

          {/* Core content panels */}
          <main className="w-full relative flex-grow">
            <Hero 
              onContactClick={() => scrollToSection("contact")} 
              onResumeClick={() => setIsResumeOpen(true)}
            />
            
            <About />
            
            <Experience />
            
            <Skills />
            
            <Contact />
          </main>

          {/* Minimal cinematic sign-off footer */}
          <Footer />

          {/* Lightbox structured interactive Resume tracker sheet */}
          <ResumeModal 
            isOpen={isResumeOpen} 
            onClose={() => setIsResumeOpen(false)} 
          />
        </motion.div>
      )}
    </div>
  );
}
