import kids1 from "../assets/images/kid_one.png";
import kids2 from "../assets/images/kid_two.png";
import kids3 from "../assets/images/kid_three.png";
import {useNavigate} from "react-router-dom";
import { MdCreate } from "react-icons/md";
import StarBorder from "./StarBorder";
import Particles from "./Particles";
import AnimatedContent from "./AnimatedContent";

export default function KidsSection() {
  const navigate = useNavigate();


  return (
    <section className="relative min-h-[900px] w-full overflow-hidden rounded-xl bg-[#228EE6]">
        <AnimatedContent distance={150} direction="vertical" duration={0.8} ease="power3.out" blur={0} stagger={0.08} threshold={0.1}>
       <div className="absolute inset-0 z-0">
        <Particles particleColors={["#ffffff","#ffffff","#ffffff"]} particleCount={200} particleSpread={10} speed={0.1} particleBaseSize={100} glow={0.5}
            twinkle={0.3}
            moveParticlesOnHover = {false}
            hoverEffect="parallax"
            sizeRandomness={1}
            shape="circle"
            depthOfField={0}
            connections={false}
            connectionDistance={110}
            particleHoverFactor={1}
            hoverRadius={140}
            drift="none"
            driftSpeed={1}
            alphaParticles={false}
            disableRotation={false}
            cameraDistance={20}
            variation={0}
            opacity={1}
            clickBurst
            intro
            lightMode={false}
        />
       </div>
       <div className="relative z-0">
      <div className="mx-auto flex w-full flex-col items-center pt-10 text-center max-w-[800px]">
        <h2 className="mt-16 text-3xl space-grotesk-bold text-white">
          Family-friendly <span className="text-[#E7BC0F]">movies/tv-shows</span>
        </h2>
        <p className="mt-8 text-xl inter-bold text-white">
          Create kids profiles and let them enjoy the best family-friendly content available on Moviq.
        </p>
      </div>
      <div className="pl-40 mx-auto mt-12 flex max-w-[1100px] items-end justify-center gap-0">
       <div className="relative shrink-0">
        <img src={kids1} alt="Pig" className="h-[400px] w-auto shrink-0 object-contain hover:scale-105 transition-transform duration-300"/>
        <img src={kids1} aria-hidden="true" className="absolute left-0 top-full h-[400px] w-full scale-y-[-1] object-cover opacity-15"/>
       </div>
       <div className="relative shrink-0">
        <img src={kids2} alt="Panda" className="h-[400px] w-auto shrink-0 object-contain hover:scale-105 transition-transform duration-300"/>
        <img src={kids2} aria-hidden="true" className="absolute left-0 top-full h-[400px] w-full scale-y-[-1] object-cover opacity-15"/>
        <div className="absolute left-1/2 top-[450px] z-20 -translate-x-1/2 pt-10">
        <StarBorder onClick={() => {navigate("/create-kids-profile")}} className="text-[15px]">
          <span className="inline-flex items-center gap-1">
          Create Kids Profile
          <MdCreate  className="ml-1 mt-1"/>
          </span>
        </StarBorder>
        </div>
       </div>
       <div className="relative shrink-0">
        <img src={kids3} alt="Girl" className="h-[400px] w-auto shrink-0 object-contain hover:scale-105 transition-transform duration-300"/>
        <img src={kids3} aria-hidden="true" className="absolute left-0 top-full h-[400px] w-full scale-y-[-1] object-cover opacity-15"/>
       </div>
      </div>
      </div>
    </AnimatedContent>
    </section>
  );
}