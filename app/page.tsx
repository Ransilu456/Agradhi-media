"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';
import { ArrowUpRight, MoveRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Constants ---
const HLS_SOURCE = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
const APP_NAME = "Agradhi Media Unit";
const COLLEGE_NAME = "Saranath College";

// --- Sub-Component: Loading Screen ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const words = ["Design", "Create", "Inspire", "Forge"];

  useEffect(() => {
    const duration = 2700;
    const start = Date.now();
    
    const updateCounter = () => {
      const delta = Date.now() - start;
      const progress = Math.min(delta / duration, 1);
      setCount(Math.floor(progress * 100));
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(onComplete, 400);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-8 md:p-12"
    >
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xs text-muted uppercase tracking-[0.3em]"
        >
          {APP_NAME} Reveal
        </motion.div>
        <div className="text-xs text-muted/50 font-mono">EST. 2026</div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative h-20 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={Math.floor(count / 25)}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
            >
              {words[Math.min(Math.floor(count / 25), words.length - 1)]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="w-full md:w-1/2">
          <div className="h-[3px] bg-stroke/50 relative overflow-hidden mb-4">
            <motion.div
              className="absolute inset-0 accent-gradient shadow-[0_0_8px_rgba(249,212,35,0.35)]"
              style={{ scaleX: count / 100, originX: 0 }}
            />
          </div>
          <div className="text-[10px] text-muted uppercase tracking-widest">System Initialization</div>
        </div>
        <div className="text-6xl md:text-8xl font-display text-text-primary tabular-nums leading-none">
          {String(count).padStart(3, "0")}
        </div>
      </div>
    </motion.div>
  );
};

// --- Sub-Component: Background Video ---
const BackgroundVideo = ({ flipped = false, opacity = 0.2 }: { flipped?: boolean, opacity?: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(HLS_SOURCE);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = HLS_SOURCE;
      }
    }
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${flipped ? 'scale-y-[-1]' : ''}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        style={{ opacity }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg" />
    </div>
  );
};

// --- Sub-Component: Navbar ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <div className={`
        inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-2 py-2 transition-all duration-500
        ${scrolled ? 'shadow-2xl shadow-black/50 scale-95' : ''}
      `}>
        <div className="group relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
          <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700" />
          <div className="absolute inset-[2px] bg-bg rounded-full flex items-center justify-center">
            <span className="font-display italic text-[13px] text-gold">AM</span>
          </div>
        </div>
        
        <div className="hidden md:block w-px h-5 bg-stroke mx-2" />
        
        <div className="flex gap-1 px-2">
          {["Home", "Works", "Journal"].map((item) => (
            <button key={item} className="text-xs transition-all rounded-full px-4 py-2 text-muted hover:text-text-primary hover:bg-stroke/50">
              {item}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-stroke mx-1" />

        <button className="relative group overflow-hidden rounded-full ml-1">
          <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-2 bg-surface text-text-primary text-xs px-4 py-2 rounded-full m-[1px] backdrop-blur-sm">
            Reach out <ArrowUpRight size={14} className="text-gold" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const explorationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      // Hero Entrance GSAP
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.from(".name-reveal", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 0.1
      })
      .from(".hero-blur-item", {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        duration: 1,
        stagger: 0.1,
      }, "-=0.8");

      // Parallax Setup
      ScrollTrigger.create({
        trigger: explorationRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
      });

      gsap.to(".parallax-col-1", {
        yPercent: -20,
        scrollTrigger: {
          trigger: explorationRef.current,
          start: "top bottom",
          scrub: true
        }
      });

      gsap.to(".parallax-col-2", {
        yPercent: 20,
        scrollTrigger: {
          trigger: explorationRef.current,
          start: "top bottom",
          scrub: true
        }
      });

      // Footer Marquee
      gsap.to(".marquee-inner", {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoading]);

  return (
    <main 
      ref={containerRef} 
      className="relative bg-bg min-h-screen w-full overflow-x-hidden selection:bg-gold selection:text-black"
    >
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <BackgroundVideo opacity={0.3} />
        
        <div className="relative z-10 text-center max-w-5xl">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mb-12 flex justify-center"
          >
            {/* The Badge Placeholder */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-[3px] border-gold bg-surface/40 flex items-center justify-center backdrop-blur-sm shadow-[0_0_50px_rgba(249,212,35,0.2)]">
              <div className="absolute inset-2 border border-gold/20 rounded-full border-dashed animate-[spin_30s_linear_infinite]" />
              <div className="text-center">
                <h2 className="text-gold font-display italic text-5xl md:text-7xl drop-shadow-[0_0_15px_rgba(249,212,35,0.5)]">MU</h2>
                <p className="text-[8px] tracking-[0.4em] uppercase text-gold/60 mt-[-5px]">Media Unit</p>
              </div>
              
              {/* Emission Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -60], 
                    x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60],
                    opacity: [0, 1, 0], 
                    scale: [1, 0.2] 
                  }}
                  transition={{ 
                    duration: 1.5 + Math.random(), 
                    repeat: Infinity, 
                    delay: Math.random() * 2 
                  }}
                  className="absolute bottom-4 left-1/2 w-1 h-1 bg-fire rounded-full blur-[1px]"
                />
              ))}
            </div>
          </motion.div>

          <motion.span className="hero-blur-item block text-[10px] text-muted uppercase tracking-[0.4em] mb-4">
            COLLECTION '26 • {COLLEGE_NAME}
          </motion.span>
          
          <h1 className="name-reveal text-5xl md:text-7xl lg:text-8xl font-display italic leading-[0.85] tracking-tight text-text-primary mb-8 select-none">
            {APP_NAME.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'fire-text' : ''}>{word} </span>
            ))}
          </h1>

          <div className="hero-blur-item mb-12">
            <RoleCycler />
          </div>

          <p className="hero-blur-item text-sm md:text-base text-muted max-w-lg mx-auto mb-12 leading-relaxed">
            Forging cinematic experiences through visual storytelling. We are the architects of motion and light at Saranath College.
          </p>

          <div className="hero-blur-item flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-text-primary text-bg text-sm font-medium transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
              <span className="relative z-10">See Reveal</span>
              <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-stroke bg-bg text-text-primary text-sm font-medium transition-all hover:border-gold/50 hover:scale-105 active:scale-95">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] text-muted tracking-[0.3em] font-medium">SCROLL</span>
          <div className="w-px h-12 bg-stroke relative overflow-hidden">
            <div className="absolute inset-0 accent-gradient animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* Selected Works (Bento Grid) */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 md:mb-24">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-gold" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display leading-tight italic">
                Cinematic <span className="text-gold">Masterpieces</span>
              </h2>
            </div>
            <button className="hidden md:flex items-center gap-3 text-sm text-muted hover:text-text-primary transition-colors group">
              View all productions <MoveRight className="group-hover:translate-x-2 transition-transform color-gold" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8">
            <BentoCard span={7} title="Forge Ceremony" subtitle="Motion Graphics" delay={0.1} />
            <BentoCard span={5} title="Urban Pulse" subtitle="Cinematography" delay={0.2} />
            <BentoCard span={5} title="The Archive" subtitle="Documentary" delay={0.3} />
            <BentoCard span={7} title="Neon Nights" subtitle="VFX" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="py-24 bg-surface/20 border-y border-stroke overflow-hidden">
        <div className="px-8 md:px-24 mb-16">
          <h2 className="text-4xl md:text-6xl font-display italic mb-4">Recent <span className="fire-text">Notes</span></h2>
          <p className="text-muted max-w-md">Chronicles of our creative journey and technical findings.</p>
        </div>
        
        <div className="flex flex-col gap-6 px-4 md:px-12 max-w-[1400px] mx-auto">
          {["The Art of Lighting", "Obsidian Workflows", "Cinematic Soundscapes", "Color Theory in Motion"].map((entry, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 20 }}
              className="group flex items-center gap-6 p-6 md:p-8 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] md:rounded-full cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-bg border border-stroke flex items-center justify-center font-display italic text-lg text-gold group-hover:scale-110 transition-transform">
                0{i + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-medium group-hover:text-gold transition-colors">{entry}</h3>
                <div className="flex gap-4 text-xs text-muted mt-1 uppercase tracking-widest">
                  <span>April 2026</span>
                  <span>•</span>
                  <span>5 Min read</span>
                </div>
              </div>
              <ArrowUpRight className="text-muted group-hover:text-gold transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Explorations (Parallax) */}
      <section ref={explorationRef} className="relative h-[150vh] bg-bg overflow-hidden flex items-center py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,212,35,0.05)_0%,transparent_70%)]" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-40 px-12 md:px-24 w-full max-w-[1600px] mx-auto relative z-10 items-center">
          <div className="max-w-md">
            <span className="text-xs text-gold uppercase tracking-[0.3em] mb-4 block">Explorations</span>
            <h2 className="text-5xl md:text-7xl font-display italic leading-none mb-8">Visual <span className="fire-text">Playground</span></h2>
            <p className="text-muted mb-8 leading-relaxed">Diving deep into experimental renders, unique textures, and lighting studies that push the boundaries of the Media Unit's visual language.</p>
            <button className="flex items-center gap-4 text-sm font-medium hover:text-gold transition-colors group">
              <span className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center group-hover:border-gold transition-colors">
                <MoveRight size={18} />
              </span>
              View Dribbble
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="parallax-col-1 flex flex-col gap-4 md:gap-8 translate-y-20">
              <ParallaxCard color="gold" index={1} />
              <ParallaxCard color="fire" index={2} />
              <ParallaxCard color="gold" index={3} />
            </div>
            <div className="parallax-col-2 flex flex-col gap-4 md:gap-8 -translate-y-20">
              <ParallaxCard color="fire" index={4} />
              <ParallaxCard color="gold" index={5} />
              <ParallaxCard color="fire" index={6} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 md:py-48 px-12 border-t border-stroke bg-surface/10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 text-center">
          <div>
            <div className="text-5xl md:text-7xl font-display text-gold mb-4 italic">5+</div>
            <div className="text-xs text-muted uppercase tracking-[0.3em]">Years Excellence</div>
          </div>
          <div>
            <div className="text-5xl md:text-7xl font-display text-fire mb-4 italic">50+</div>
            <div className="text-xs text-muted uppercase tracking-[0.3em]">Major Projects</div>
          </div>
          <div>
            <div className="text-5xl md:text-7xl font-display text-text-primary mb-4 italic">100%</div>
            <div className="text-xs text-muted uppercase tracking-[0.3em]">Passion Driven</div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="relative pt-32 pb-12 overflow-hidden bg-black">
        <BackgroundVideo flipped opacity={0.4} />
        
        <div className="relative z-10 flex flex-col items-center justify-center px-12">
          <div className="w-full mb-32 border-y border-white/5 py-8 overflow-hidden">
            <div className="marquee-inner flex whitespace-nowrap gap-12 text-6xl md:text-[10rem] font-display italic text-white/5 uppercase select-none">
              {[...Array(10)].map((_, i) => (
                <span key={i}>Building the Future • </span>
              ))}
            </div>
          </div>

          <div className="text-center max-w-2xl mb-24">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display italic mb-12">Ready to <span className="fire-text">reveal?</span></h2>
            <button className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full text-lg font-medium hover:scale-110 active:scale-95 transition-all group">
              Contact Saranath <ArrowUpRight />
            </button>
          </div>

          <div className="w-full max-w-[1400px] flex flex-col md:flex-row justify-between items-center gap-12 pt-12 border-t border-stroke/50">
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted uppercase tracking-widest">Available for Collaborations</span>
            </div>

            <div className="text-[10px] text-muted/50 uppercase tracking-[0.3em] font-mono">
              © 2026 {APP_NAME} • Saranath College
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- Helper Components ---

function RoleCycler() {
  const roles = ["Cinematographers", "Designers", "Visionaries", "Creators"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm md:text-base text-muted">
      We are <span key={index} className="inline-block font-display italic text-text-primary animate-role-fade-in mx-1">{roles[index]}</span> representing Saranath.
    </div>
  );
}

function BentoCard({ span, title, subtitle, delay }: { span: number, title: string, subtitle: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      style={{ gridColumn: `span ${span} / span ${span}` } as any}
      className={`group relative aspect-[4/3] md:aspect-auto md:h-[420px] bg-surface rounded-3xl overflow-hidden border border-stroke cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute inset-0 bg-gold/10 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
      
      <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
        <div className="bg-bg/80 backdrop-blur-md rounded-full px-8 py-3 border border-white/10 scale-90 group-hover:scale-100 transition-transform duration-500 flex items-center gap-3">
          <span className="text-sm font-medium">View — <span className="font-display italic text-gold">{title}</span></span>
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="absolute bottom-10 left-10 z-10">
        <p className="text-[10px] text-gold uppercase tracking-[0.4em] mb-2">{subtitle}</p>
        <h3 className="text-3xl font-display text-text-primary italic">{title}</h3>
      </div>
    </motion.div>
  );
}

function ParallaxCard({ color, index }: { color: 'gold' | 'fire', index: number }) {
  return (
    <div className={`
      relative aspect-square w-full rounded-2xl border border-stroke overflow-hidden group cursor-pointer
      ${color === 'gold' ? 'bg-gold/5' : 'bg-fire/5'}
    `}>
      <div className="absolute inset-0 halftone-overlay opacity-10" />
      <div className={`absolute inset-4 rounded-xl border border-dashed opacity-20 ${color === 'gold' ? 'border-gold' : 'border-fire'} animate-[spin_30s_linear_infinite]`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-6xl font-display italic transition-all group-hover:scale-125 group-hover:rotate-6 ${color === 'gold' ? 'text-gold/40' : 'text-fire/40'}`}>
          {index}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

function InstagramIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}