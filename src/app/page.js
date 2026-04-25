import Scene from "@/components/canvas/Scene";
import IntroUI from "@/components/ui/IntroUI";

export default function Page() {
  return (

    <main style={{ 
      width: "100vw", 
      height: "100vh", 
      backgroundColor: "#1C1C1C",
      overflow: "hidden" 
    }}>
      <Scene />
      <IntroUI />
    </main>
  );
}