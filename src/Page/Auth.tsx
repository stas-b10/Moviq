import { useRef, useState } from "react";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import authImage from "../assets/images/auth_img.jpg";
import { motion } from "framer-motion";
import violet from "../assets/images/violet.jpg";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import Verification from "../components/Verification";

export default function Auth() {
  const [mode, setMode] = useState<"Login" | "Register">("Login");
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const verificationInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
  setError("");

  if (!fullName || !username || !email || !password || !repeatPassword) {
    setError("Please fill in all fields.");
    return;
  }

  if (password !== repeatPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (password.length < 7) {
    setError("Password must be at least 7 characters long.");
    return;
  }

  setLoading(true);

  try {
    const { data, error: functionError } =
      await supabase.functions.invoke("send-verification-code", {
        body: {
          action: "send",
          fullName,
          username,
          email,
        },
      });

    if (functionError) {
      console.error("Verification function error:", functionError);
      setError("Unable to send verification code.");
      return;
    }

    if (data?.error) {
      setError(data.error);
      return;
    }

    setShowVerification(true);
    setVerificationCode("");
  } catch (error) {
    console.error("Registration error:", error);
    setError("An error occurred during registration. Please try again.");
  } finally {
    setLoading(false);
  }
};

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

      navigate("/avatars");
    } catch {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
  setError("");

  if (verificationCode.length !== 6) {
    setError("Please enter the 6-digit verification code.");
    return;
  }

  setLoading(true);

  try {
    const { data, error: functionError } =
      await supabase.functions.invoke("send-verification-code", {
        body: {
          action: "verify",
          email,
          password,
          code: verificationCode,
        },
      });

    if (functionError) {
      console.error("Verification function error:", functionError);
      setError(functionError.message || "Verification failed.");
      return;
    }

    if (data?.error) {
      setError(data.error);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (loginError) {
      setError("Account created, but we could not sign you in.");
      return;
    }

    setShowVerification(false);
    setVerificationCode("");

    navigate("/avatars");

  } catch (error) {
    console.error("Verification error:", error);
    setError("An error occurred during verification. Please try again.");
  } finally {
    setLoading(false);
  }
};
      
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
      <div className="flex min-h-screen">
       <motion.div className="flex w-[32%] flex-col" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
        <motion.h1 className="space-grotesk-medium pl-[190px] pt-[100px] text-[80px] font-bold text-white" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          Welcome
        </motion.h1>

        <motion.div className="bebas-neue-regular mt-6 ml-[210px] flex gap-46" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          <button
            onClick={() => setMode("Login")}
            className={`border-b-2 pb-2 text-[24px] font-normal text-white cursor-pointer ${
              mode === "Login"
                ? "border-[#9747FF]"
                : "border-transparent"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("Register")}
            className={`border-b-2 pb-2 text-[24px] font-normal text-white cursor-pointer ${
              mode === "Register"
                ? "border-[#9747FF]"
                : "border-transparent"
            }`}
          >
            Register
          </button>
        </motion.div>

        <motion.div className="mt-10 ml-[200px] w-[330px]">
          {showVerification ? (
            <Verification
              email={email}
              code={verificationCode}
              error={error}
              loading={loading}
              onCodeChange={setVerificationCode}
              onVerify={handleVerification}
              onClose={() => { setShowVerification(false); setVerificationCode(""); setError("");}}
            />
          ) : null}
          {mode === "Login" ? (
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

              <motion.button className="mt-2 font-semibold text-gray-400 cursor-pointer" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                forgot password?
              </motion.button>

              <motion.button type="button" onClick={handleLogin} disabled={loading} className="mt-2 rounded-lg bg-[#228EE5] py-4 font-semibold text-white cursor-pointer" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                Login
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="register" className="flex flex-col gap-5 space-y-4">
              <motion.input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg border border-white/20  px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
              />

              <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-white/20 pr-12 px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
              </motion.div>

              <motion.input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/20  px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
              />

              <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
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

              <motion.div className="relative" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full rounded-lg border border-white/20 px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />
              <button type="button" onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                {showRepeatPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
              </motion.div>

              <motion.button type="button" onClick={handleRegister} disabled={loading} className="mt-2 rounded-lg bg-[#228EE5] py-4 font-semibold text-white cursor-pointer" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
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