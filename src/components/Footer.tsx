import { useNavigate } from "react-router-dom";
import AnimatedContent from "./AnimatedContent";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";
import { FaDiscord, FaGithub, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa6";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[200px] w-full overflow-hidden rounded-xl bg-[#EBFAFF] dark:bg-[#030A1B]">
      <AnimatedContent distance={150} direction="vertical" duration={0.8} ease="power3.out" blur={0} stagger={0.08} threshold={0.1}>
       <div className="mx-auto flex w-full max-w-[600px] flex-wrap justify-center gap-x-10 gap-y-6 text-center">
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/kid_page")}}>Kids Page <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/wheel")}}>Wheel <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/friends")}}>Friends <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/movies")}}>Movies <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/series")}}>Tv Shows <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/ratings")}}>Ratings <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/faq")}}>Faq <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
          <button className="flex flex-row cursor-pointer dark:hover:text-slate-500 hover:text-slate-400 dark:text-[#EBFAFF] text-[#030A1B] inter-regular text-[17px]" onClick={() => {navigate("/about")}}>About us <span><MdKeyboardArrowRight className="mt-1 text-[20px]"/></span></button>
       </div>
      <div className="mt-20 flex items-center justify-center gap-10 text-[33px] text-slate-100 pb-20">
         <a href="https://www.linkedin.com/in/stas-baltag-899ab141a/L" target="_blank" rel="noopener noreferrer" aria-label="Linkedin" className="transition-all hover:text-blue-400 hover:scale-110 ">
            <FaLinkedin />
         </a>
         <a href="https://www.instagram.com/stas_ftbl/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="transition-all hover:text-pink-400 hover:scale-110 ">
            <FaInstagram />
         </a>
         <a href="https://github.com/stas-b10" aria-label="Github" target="_blank" rel="noopener noreferrer" className="transition-all hover:text-blue-400 hover:scale-110 ">
            <FaGithub />
         </a>
     </div>
    </AnimatedContent>
   </section>
  )
}
