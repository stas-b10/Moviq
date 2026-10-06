import { useState } from "react";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import authImage from "../assets/images/auth_img.jpg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { FcGoogle } from "react-icons/fc";

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!loginUsername || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 7) {
      setError("Password must be at least 7 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", loginUsername.trim())
        .maybeSingle();
        
      if (profileError || !profile) { setError("Invalid username or password."); return; }

      const {error: loginError} = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password,
      });

      if (loginError) {
        setError("Invalid username or password.");
        return;
      }

      navigate("/succesful_logged");
    } catch {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleGoogleLogin = async (action: "login" | "register") => {
  setError("");
  setLoading(true);

  sessionStorage.setItem("google_auth_action", action);

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      sessionStorage.removeItem("google_auth_action");
      setError("Unable to sign in with Google.");
      setLoading(false);
    }
  } catch (error) {
    console.error("Google login error:", error);
    sessionStorage.removeItem("google_auth_action");
    setError("An error occurred while signing in with Google.");
    setLoading(false);
  }
};
      
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40% ">
      <div className="flex min-h-screen">
       <motion.div className="flex w-[32%] flex-col" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
        <motion.h1 className="space-grotesk-medium pl-[190px] pt-[100px] text-[80px] font-bold text-white" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          Welcome
        </motion.h1>

        <motion.div className="bebas-neue-regular mt-6 ml-[200px] w-[330px] text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            <span className="border-b-2 border-[#9747FF] pb-2 text-[24px] font-normal text-white">
              Login
            </span>
          </motion.div>

        <motion.div className="mt-10 ml-[200px] w-[330px]">
            <motion.div key="login" className="flex flex-col gap-5 space-y-4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full rounded-lg border border-white/20 pr-12 px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
              </motion.div>

              <motion.div className="relative" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/20 px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
              </motion.div>

              {error && (
                <p className="text-center text-sm text-red-500">
                  {error}
                </p>
              )}

              <motion.button className="font-semibold text-gray-400 cursor-pointer" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                forgot password?
              </motion.button>

              <motion.button type="button" onClick={handleLogin} disabled={loading} className="mt-2 rounded-lg bg-[#228EE5] py-4 font-semibold text-white cursor-pointer transition-transform duration-300 hover:scale-[1.02]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                Login
              </motion.button>
              <div className="py-2 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/20" />
                <span className="whitespace-nowrap text-sm text-white/50">
                or sign in with
                </span>
                <div className="h-px flex-1 bg-white/20" />
              </div>
              <motion.button type="button" onClick={() => handleGoogleLogin("login")} disabled={loading} 
                             className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-white py-4 font-semibold text-black transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                <FcGoogle size={22} />
                {loading ? "Signing in..." : "Sign in with Google"}
              </motion.button>
            </motion.div>
        </motion.div>
      </motion.div>
          <motion.div className="flex w-[68%] items-start justify-start pt-[140px]" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            <img src={authImage} alt="Authentication" className="h-[720px] w-[1250px] rounded-3xl"/>
          </motion.div>

      </div>
    </div>
  );
}