import { useEffect, useState } from "react"
import { IoIosArrowDown } from "react-icons/io";
import type { Faqs } from "../utils/types/faqs";
import { supabase } from "../utils/supabase";
import AnimatedContent from "./AnimatedContent";

export default function Faq() {
   const [faqs,setFaqs] = useState<Faqs[]>([]);
   const [openFaq, setOpenFaq] = useState<number | null>(null);

   useEffect (() => {
    const fetchFaqs = async () => {
      const {data,error} = await supabase.from("faqs").select("*").eq("is_active",true).order("position",{ascending: true})

      if (error) {
        console.error("Error fetching faqs:",error)
        return;
      }
      setFaqs(data ?? []);
    }
    fetchFaqs();
   },[])
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#EBFAFF] dark:bg-[#030A1B]">
        <AnimatedContent distance={150} direction="vertical" duration={0.8} ease="power3.out" blur={0} stagger={0.08} threshold={0.1}>
      <div className="mx-auto flex w-full flex-col items-center  text-center max-w-[800px]">
        <h2 className="text-3xl space-grotesk-bold text-slate-900 dark:text-white">
          The moviq questions Everyone's asking
        </h2>
      </div>
      <div className="mx-auto max-w-[900px] pt-10">
        {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
                <div key={faq.id} className="mb-4 overflow-hidden rounded-2xl border border-slate-400 dark:border-slate-700"> 
                    <button type="button" onClick={() => setOpenFaq(isOpen ? null : faq.id)} className="flex w-full items-center justify-between py-5 px-5 text-left text-slate-900 dark:text-white cursor-pointer">
                        <span className="text-[16px] inter-bold"> {faq.question} </span>
                         <IoIosArrowDown className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}/>
                    </button>
                    <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0" }`}> 
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-slate-600 dark:text-gray-400">
                            {faq.answer}
                        </p>
                      </div>
                    </div>
                </div>
            )
        })}
      </div>
      </AnimatedContent>
    </section>
  )
}
