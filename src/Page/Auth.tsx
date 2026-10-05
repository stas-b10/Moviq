import { useState } from "react";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import authImage from "../assets/images/auth_img.jpg";
import { motion } from "framer-motion";
import violet from "../assets/images/violet.jpg";

export default function Auth() {
  const [mode, setMode] = useState<"Login" | "Register">("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
      <div className="flex min-h-screen">
       <motion.div className="flex w-[32%] flex-col" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
        <motion.h1 className="pl-[190px] pt-[100px] text-[80px] font-bold text-white" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          Welcome
        </motion.h1>

        <motion.div className="mt-6 ml-[210px] flex gap-46" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          <button
            onClick={() => setMode("Login")}
            className={`border-b-2 pb-2 text-[20px] font-normal text-white cursor-pointer ${
              mode === "Login"
                ? "border-[#9747FF]"
                : "border-transparent"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("Register")}
            className={`border-b-2 pb-2 text-[20px] font-normal text-white cursor-pointer ${
              mode === "Register"
                ? "border-[#9747FF]"
                : "border-transparent"
            }`}
          >
            Register
          </button>
        </motion.div>

        <motion.div className="mt-10 ml-[200px] w-[330px]">
          {mode === "Login" ? (
            <motion.div key="login" className="flex flex-col gap-5 space-y-4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type="text"
                placeholder="Username"
                className="w-full rounded-lg border border-white/20 pr-12 px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
              </motion.div>

              <motion.div className="relative" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg border border-white/20 px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
              </motion.div>

              <motion.button className="mt-2 font-semibold text-gray-400 cursor-pointer" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                forgot password?
              </motion.button>

              <motion.button className="mt-2 rounded-lg bg-[#228EE5] py-4 font-semibold text-white cursor-pointer" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                Login
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="register" className="flex flex-col gap-5 space-y-4">
              <motion.input
                type="text"
                placeholder="Full name"
                className="rounded-lg border border-white/20  px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
              />

              <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type="text"
                placeholder="Username"
                className="w-full rounded-lg border border-white/20 pr-12 px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
              </motion.div>

              <motion.input
                type="email"
                placeholder="Email"
                className="rounded-lg border border-white/20  px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
              />

              <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg border border-white/20 px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
              </motion.div>

              <motion.div className="relative" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat password"
                className="w-full rounded-lg border border-white/20 px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <button type="button" onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                {showRepeatPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
              </motion.div>

              <motion.button className="mt-2 rounded-lg bg-[#228EE5] py-4 font-semibold text-white cursor-pointer" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                Register
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
        {mode === "Login" && (
          <motion.div className="flex w-[68%] items-start justify-start pt-[140px]" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            <img src={authImage} alt="Authentication" className="h-[720px] w-[1250px] rounded-3xl"/>
          </motion.div>
        )}
        {mode === "Register" && (
      <motion.div className="flex w-[68%] items-start justify-start pt-[140px]" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
        <img src={violet} alt="Authentication" className="h-[720px] w-[1250px] rounded-3xl"/>
      </motion.div>
        )}
      </div>
    </div>
  );
}