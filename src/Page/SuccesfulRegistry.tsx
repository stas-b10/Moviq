import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../utils/supabase";
import patrick from "../assets/images/Patrick_Star_character.png";
import spongebob from "../assets/images/spongebob.png";


export default function SuccesfulRegistry() {
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
    }, 3000);

    return () => clearTimeout(fadeOutTimer);
  }, []);

  useEffect(() => {
    if (!isExiting) return;

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 700);
    return () => clearTimeout(redirectTimer);
  }, [isExiting, navigate]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: isExiting ? 0 : 2 }} transition={{ duration: 1.8, ease: "easeInOut",}} className="min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
      <div className="flex min-h-screen flex-col items-center pt-20">
        <div className="flex h-[250px] w-[250px] items-center justify-center overflow-hidden rounded-full">
          {avatarUrl && (
            <img src={avatarUrl} alt="Selected Avatar" className="h-full w-full object-cover"/>
          )}
        </div>
        {username && (
          <p className="mt-5 text-white text-[32px]">
            {username}
          </p>
        )}
        <motion.h1 className="space-grotesk-medium mt-12 text-center text-white text-[32px]" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          Your account has been successfully created
        </motion.h1>
      </div>
       <img src={patrick} alt="" className="absolute bottom-10 left-10 w-[180px] md:w-[260px]"/>
       <img src={spongebob} alt="" className="absolute bottom-0 right-0 w-[220px] md:w-[330px]"/>
    </motion.div>
  )
}
