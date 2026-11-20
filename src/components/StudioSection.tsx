import AnimatedContent from "./AnimatedContent";
import type { Studio } from "../utils/types/studio";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import FlipCard from "./FlipCard";

export default function StudioSection() {
   const navigate = useNavigate();
   const [studios,setStudios] = useState<Studio[]>([]);

   useEffect(() => {
    const fetchStudios = async () => {
         const { data,error } = await supabase.from("studios").select("id, name, slug, logo_url, display_order").eq("is_active",true).order("display_order",{ascending:true});
         if (error) {
            console.error("Error fetching studios:",error)
            return;
         }
      setStudios(data ?? []);
    }
    fetchStudios();
   },[])

  return (
    <section className="relative min-h-[900px] w-full overflow-hidden rounded-xl bg-[#EBFAFF] dark:bg-[#030A1B]">
      <AnimatedContent distance={150} direction="vertical" duration={0.8} ease="power3.out" blur={0} stagger={0.08} threshold={0.1}>
        <div className="mx-auto flex w-full flex-col items-center text-center max-w-[800px]">
        <h2 className="text-3xl space-grotesk-bold text-slate-900 dark:text-white">
          Studios
        </h2>
      </div>
      <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-10 px-5 pt-10 sm:grid-cols-3 lg:grid-cols-5">
       {studios.map((studio) => (
        <FlipCard key={studio.id} width={190} height={160} radius={30} axis="y" flipOnClick draggable tilt glare hoverScale={1.04} background="var(--fc-bg)" color="#0f172a" className="w-full dark:[--flip-card-bg:#EBFAFF] [--flip-card-bg:#228EE6]"
          front={
           <div className="flex h-full w-full items-center justify-center p-7">
            <img src={studio.logo_url} alt={studio.name} loading="lazy" className="h-full w-full object-contain" />
           </div>
          }
        back={
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-5 text-center">
         <h3 className="space-grotesk-bold text-xl">
          {studio.name}
         </h3>
         <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/studio/${studio.slug}`);}} className="rounded-full dark:bg-[#228EE5] bg-slate-700 px-3.5 py-3 border-slate-400 text-sm font-semibold text-white transition-colors cursor-pointer ">
          Explore Studio
         </button>
        </div>
        }
     />
    ))}  
     </div>
    </AnimatedContent>
   </section>
  )
}
