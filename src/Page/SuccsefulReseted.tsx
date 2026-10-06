import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../utils/supabase";
import leo from "../assets/images/Leonardo_2012.webp"
import rapha from "../assets/images/raphael.png"
import donnie from "../assets/images/donatello.png"
import mickey from "../assets/images/Michelangelo_TMNT_2012.webp"


export default function SuccesfulReseted() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);


  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setAvatarUrl(data.avatar_url);
      setUsername(data.username);
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsExiting(true);
    }, 9000);

    return () => clearTimeout(fadeOutTimer);
  }, []);


  useEffect(() => {
    if (!isExiting) return;

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 1300);
    return () => clearTimeout(redirectTimer);
  }, [isExiting, navigate]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: isExiting ? 0 : 2 }} transition={{ duration: 1.5, ease: "easeInOut",}} className="min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
      <div className="flex min-h-screen flex-col items-center pt-20">
        <motion.div className="flex h-[250px] w-[250px] items-center justify-center overflow-hidden rounded-full" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}> 
          {avatarUrl && (
            <img src={avatarUrl} alt="Selected Avatar" className="h-full w-full object-cover"/>
          )}
        </motion.div>
        {username && (
          <motion.p className="mt-5 text-white text-[32px]" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            {username}
          </motion.p>
        )}
        <motion.h1 className="space-grotesk-medium mt-12 text-center text-white text-[32px]" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          You have successfully reseted your password
        </motion.h1>
        <motion.button onClick={() => navigate("/")} type="button" className="mt-8 h-[50px] min-w-[180px] cursor-pointer rounded-[10px] bg-gradient-to-tr from-[#9747FF] from-0% via-[#010101] via-0% to-[#115994] to-70% px-8 text-white transition-transform duration-500 ease-out hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            Ok
        </motion.button>
      </div>
       <motion.img src={leo} alt="" className="absolute bottom-4 left-4 w-[180px] md:w-[300px]" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }} />
       <motion.img src={rapha} alt="" className="absolute bottom-4 right-0 w-[120px] md:w-[230px]" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}/>
       <motion.img src={donnie} alt="" className="absolute top-4 left-4 w-[180px] md:w-[260px]" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}/>
       <motion.img src={mickey} alt="" className="absolute top-4 right-0 w-[120px] md:w-[200px]" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}/>

       
    </motion.div>
  )
}
