"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useIntroStore } from "@/store/introStore";
import { ArrowLeft } from "lucide-react";

export default function Desc() {
  const phase = useIntroStore((s) => s.phase);
  const setPhase = useIntroStore((s) => s.setPhase);
  const divisiIndex = useIntroStore((s) => s.divisiIndex);

  if (phase !== "desc") return null;

  const interTight = "'Inter Tight', sans-serif";
  const interTightBold = "'Inter Tight Bold', sans-serif";

const DIVISI_DATA = [
  { 
    tugas: "Bertanggung jawab atas koordinasi, perencanaan, dan pengawasan seluruh kegiatan ISCAR agar berjalan dengan baik dan terarah.",
    members: [
      { role: "Mentor", name: "Ust. Faiz Fathurrahman N." },
      { role: "Ketua", name: "P. M. Wildanumukhaladun" },
      { role: "Wakil Ketua", name: "Rafi’uddin Hannan" },
      { role: "Sekretaris", name: "Imam Sandy Bachtiar" },
      { role: "Bendahara", name: "Rafif Ardinata" }
    ]
  },
  { 
    tugas: "Menjaga kesehatan santri dan kebersihan lingkungan pesantren serta menangani pertolongan pertama pada gangguan kesehatan.",
    members: [
      { role: "Mentor", name: "Ust. Azzam Haqqi" },
      { role: "Ketua", name: "Abyan Eshan" },
      { role: "Anggota", name: "Avrijal" },
      { role: "Anggota", name: "Raffa Hitipeuw" },
      { role: "Anggota", name: "Nayaka Danendra Althafah" },
    ]
  },
  { 
    tugas: "Mengelola kegiatan fisik dan olahraga santri untuk menjaga kebugaran jasmani dan sportivitas.",
    members: [
      { role: "Mentor", name: "Ust. Farhan Abdillah" },
      { role: "Ketua", name: "Fadgham Khairul Hafizh" },
      { role: "Anggota", name: "Izzamnuddin Al-Qassam" },
      { role: "Anggota", name: "Fawwaz Romzi Nagib" },
      { role: "Anggota", name: "Fauzan Amali" },
      { role: "Anggota", name: "Kahfi Achyarudin" },
      { role: "Anggota", name: "Faiz Ghazali Wisnumurti" },
      { role: "Anggota", name: "Abdillah Arrafif" },
    ]
  },
  { 
    tugas: "Mengembangkan kemampuan berbahasa Arab siswa melalui kegiatan edukatif, pembiasaan, dan program pendukung",
    members: [
      { role: "Mentor", name: "Ust. M. Hafizh at-Thohir" },
      { role: "Ketua", name: "Albar Abdul Malik" },
      { role: "Anggota", name: "Muhammad Akram Almair" },
      { role: "Anggota", name: "Abdullah Azzam" },
      { role: "Anggota", name: "Baraka Ramadhan" },
      { role: "Anggota", name: "Ibrahim" },
      { role: "Anggota", name: "Hammam bin Dirmanto" }
    ]
  },
  { 
    tugas: "Mengembangkan minat dan bakat siswa di bidang olahraga serta menanamkan nilai sportivitas dan kerja sama.",
    members: [
      { role: "Mentor", name: "Ust. Farhan Abdillah" },
      { role: "Ketua", name: "Jusuf Fathan Nuradly" },
      { role: "Anggota", name: "Galang Ramadan" },
      { role: "Anggota", name: "Barra Adivian" },
      { role: "Anggota", name: "Luthfi Novriansyah" },
    ]
  },
  { 
    tugas: "Berfokus pada edukasi dan kepedulian terhadap kesehatan siswa serta mendukung terciptanya gaya hidup sehat di lingkungan sekolah.",
    members: [
      { role: "Mentor", name: "Ust. Alif Septiandi David" },
      { role: "Ketua", name: "Yazid Habibie Tambunan" },
      { role: "Anggota", name: "Hektor Alfatih" },
      { role: "Anggota", name: "Rayyan Ghibran Ananta" },
      { role: "Anggota", name: "Zhafran Atha Razin Hadiny" },
    ]
  },
  { 
    tugas: "Mendorong terciptanya lingkungan sekolah yang bersih, nyaman, dan sehat melalui program kebersihan rutin.",
    members: [
      { role: "Mentor", name: "Ust. Sutio Syahrulleanggi" },
      { role: "Ketua", name: "Turky Husein Hatim" },
      { role: "Anggota", name: "Luthfi Anhar" },
      { role: "Anggota", name: "Abdurrahman Hatim" },
      { role: "Anggota", name: "Muhammad Hafizh Aditya Zaini" },
    ]
  },
];
  const currentData = DIVISI_DATA[divisiIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-40 pointer-events-none"
      >
        <div className={`absolute ${currentData.bottomPos || "bottom-[20vh]"} right-[5vw] w-[35vw] flex flex-col gap-6 pointer-events-auto transition-all duration-500`}>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white px-10"
          >
            <h2
              style={{ fontFamily: interTightBold }}
              className="text-2xl font-semibold mb-3"
            >
              Tugas Kami
            </h2>

            <p
              style={{ fontFamily: interTight }}
              className="text-white text-base leading-relaxed"
            >
              {currentData.tugas}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white px-10"
            style={{ fontFamily: interTightBold }}
          >
            <div className={`space-y-4 ${currentData.maxHeight || "max-h-[40vh]"} overflow-y-auto pr-2 custom-scrollbar`}>

              {currentData.members.map((item, index, arr) => (
                <div key={index}>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-white text-sm">
                      {item.role}
                    </span>
                    <span className="text-2xl font-bold text-right leading-tight">
                      {item.name}
                    </span>
                  </div>

                  {index !== arr.length - 1 && (
                    <div className="h-px bg-white/20 mt-3" />
                  )}
                </div>
              ))}

            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={() => setPhase("descBack")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-10 left-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center shadow-xl pointer-events-auto"
        >
          <ArrowLeft size={18} />
        </motion.button>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
          }
        `}</style>

      </motion.div>
    </AnimatePresence>
  );
}