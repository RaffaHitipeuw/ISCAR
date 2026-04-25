"use client";

import { useIntroStore } from "@/store/introStore";

export default function Navbar() {
  const cameraKF3Mid = useIntroStore((s) => s.cameraKF3Mid);
  const setPhase = useIntroStore((s) => s.setPhase);
  const setCameraKF3Mid = useIntroStore((s) => s.setCameraKF3Mid);

  const clashDisplay = "'Clash Display', sans-serif";
  const interTight = "'Inter Tight', sans-serif";

  const handleHomeClick = () => {
    if (!cameraKF3Mid) return;

    setCameraKF3Mid(false);
    setPhase("intro");
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
          onClick={handleHomeClick}
          className="text-2xl tracking-wider cursor-pointer"
          style={{ fontFamily: clashDisplay }}
        >
          ISCAR
        </div>

        <div
          className="flex items-center gap-8 text-sm tracking-wide"
          style={{ fontFamily: interTight }}
        >
          <button className="text-white">ABOUT</button>
          <button className="text-white">DIVISIONS</button>
          <button className="text-white" onClick={() => setPhase("galleryMove")}>GALLERY</button>
          <button className="text-white">MAIN EVENT</button>
        </div>
      </div>
    </div>
  );
}
