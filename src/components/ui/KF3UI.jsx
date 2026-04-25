"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useIntroStore } from "@/store/introStore";

export default function KF3UI() {
  const phase = useIntroStore((s) => s.phase);
  const setPhase = useIntroStore((s) => s.setPhase);

  const divisiIndex = useIntroStore((s) => s.divisiIndex);
  const nextDivisi = useIntroStore((s) => s.nextDivisi);
  const prevDivisi = useIntroStore((s) => s.prevDivisi);
  const setRotateMode = useIntroStore((s) => s.setRotateMode);
  const setExplored = useIntroStore((s) => s.setExplored);

  if (phase !== "kf3") return null;

  const clashDisplay = "'Clash Display', sans-serif";
  const InterSemiBold = "'Inter SemiBold', sans-serif";

  const DIVISI_NAME = [
    "Utama",
    "Keamanan",
    "Ibadah",
    "Bahasa",
    "Olahraga",
    "Kesehatan",
    "Kebersihan",
  ];

  const prevName =
    DIVISI_NAME[(divisiIndex - 1 + DIVISI_NAME.length) % DIVISI_NAME.length];

  const nextName =
    DIVISI_NAME[(divisiIndex + 1) % DIVISI_NAME.length];

  const handleNext = () => {
    setRotateMode("next");
    nextDivisi();
  };

  const handlePrev = () => {
    setRotateMode("prev");
    prevDivisi();
  };

  const handleExplore = () => {
    setPhase("descMove");
    setExplored();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-6xl lg:px-10 lg:text-white lg:pointer-events-auto">
          <div className="lg:relative lg:flex lg:items-center lg:justify-between lg:mb-[85px]">

               <button
            onClick={handlePrev}
            className="lg:flex lg:items-center lg:gap-4 lg:opacity-80 group"
          >
            <div
              className="
                relative
                lg:flex lg:h-15 lg:w-15
                lg:items-center lg:justify-center
                lg:rounded-full
            
                lg:bg-black/40
                lg:backdrop-blur-xl
                lg:border lg:border-white/20
            
                lg:transition-all lg:duration-300
                lg:group-hover:bg-black/50
                lg:group-hover:border-white/40
                lg:group-hover:scale-110
                lg:active:scale-95
              "
            >

              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]" />
            
              <span className="relative text-white/80 text-3xl group-hover:text-white transition-colors">
                ◂
              </span>
            </div>
            <div className="lg:flex lg:flex-col lg:text-left lg:leading-tight">
              <span
                className="lg:text-[20px] tracking-wide"
                style={{ fontFamily: InterSemiBold }}
              >
                Divisi
              </span>
            
              <span
                className="lg:text-[40px] text-white tracking-wide"
                style={{ fontFamily: clashDisplay }}
              >
                {prevName}
              </span>
            </div>
            
          </button>

            <motion.button
              onClick={handleExplore}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:px-[70px] lg:py-[15px] lg:rounded-[26px] lg:bg-white/20 lg:backdrop-blur-md lg:border lg:border-white/30 lg:text-xl lg:font-medium lg:tracking-wide lg:hover:bg-white/30 lg:transition lg:active:scale-95"
              style={{ fontFamily: InterSemiBold }}
            >
              Explore
            </motion.button>

          <button
            onClick={handleNext}
            className="lg:flex lg:items-center lg:gap-4 lg:opacity-80 group"
          >
            <div className="lg:flex lg:flex-col lg:text-right lg:leading-tight">
              <span
                className="lg:text-[20px] tracking-wide"
                style={{ fontFamily: InterSemiBold }}
              >
                Divisi
              </span>
            
              <span
                className="lg:text-[40px] text-white tracking-wide"
                style={{ fontFamily: clashDisplay }}
              >
                {nextName}
              </span>
            </div>
            
            <div
              className="
                relative
                lg:flex lg:h-15 lg:w-15
                lg:items-center lg:justify-center
                lg:rounded-full
            
                lg:bg-black/40
                lg:backdrop-blur-xl
                lg:border lg:border-white/20
            
                lg:transition-all lg:duration-300
                lg:group-hover:bg-black/50
                lg:group-hover:border-white/40
                lg:group-hover:scale-110
                lg:active:scale-95
              "
            >

              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]" />
            
              <span className="relative text-white/80 text-3xl group-hover:text-white transition-colors">
                ▸
              </span>
            </div>
          </button>


          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}