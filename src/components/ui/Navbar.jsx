"use client";

import { useIntroStore } from "@/store/introStore";

export default function Navbar() {
  const phase = useIntroStore((s) => s.phase);
  const cameraKF3Mid = useIntroStore((s) => s.cameraKF3Mid);
  const setPhase = useIntroStore((s) => s.setPhase);

  const clashDisplay = "'Clash Display', sans-serif";
  const interTight = "'Inter Tight', sans-serif";

  const handleAboutClick = () => {
    if (phase === "kf3") {
      setPhase("aboutMove");      
    } else if (phase === "gallery") {
      setPhase("galleryToAbout"); 
    }
  };

  const handleDivisionsClick = () => {
    if (phase === "gallery") {
      setPhase("galleryBack");      
    } else if (phase === "about") {
      setPhase("aboutBack");  
    }

  };

  const handleGalleryClick = () => {
    if (phase === "kf3") {
      setPhase("galleryMove");      
    } else if (phase === "about") {
      setPhase("aboutToGallery");   
    }
  };

  return (
    <div
      className={`
        fixed top-0 left-0 w-full z-50
        flex justify-center
        transition-all duration-700 ease-out
        ${cameraKF3Mid
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-10 pointer-events-none"}
      `}
    >
      <div
        className="
          w-[90%]
          mt-6
          py-4
          flex items-center justify-between
          text-white
        "
      >
        <div
          className="text-2xl tracking-wider"
          style={{ fontFamily: clashDisplay }}
        >
          ISCAR
        </div>

        <div
          className="flex items-center gap-8 text-sm tracking-wide"
          style={{ fontFamily: interTight }}
        >
          <button
            className={`cursor-pointer transition-opacity duration-300 ${phase === "about" ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"} text-white`}
            onClick={handleAboutClick}
          >
            ABOUT
          </button>
          <button
            className={`cursor-pointer transition-opacity duration-300 ${phase === "kf3" ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"} text-white`}
            onClick={handleDivisionsClick}
          >
            DIVISIONS
          </button>
          <button
            className={`cursor-pointer transition-opacity duration-300 ${phase === "gallery" ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"} text-white`}
            onClick={handleGalleryClick}
          >
            GALLERY
          </button>
          <button className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300">
            MAIN EVENT
          </button>
        </div>
      </div>
    </div>
  );
}
