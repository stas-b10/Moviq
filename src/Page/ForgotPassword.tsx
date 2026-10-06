import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import ResetAlert from "../components/ResetAlert";
import spider_man from "../assets/images/spider_man.webp"

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showResetAlert, setShowResetAlert] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Please enter your username.");
      return;
    }

    setLoading(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (profileError) {
        console.error("Profile lookup error:", profileError);
        setError("Unable to find your account.");
        return;
      }

      if (!profile?.email) {
        setError("Username not found.");
        return;
      }

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(profile.email, {
          redirectTo: `${window.location.origin}/reset_password`,
        });

      if (resetError) {
        console.error("Password reset error:", resetError);
        setError("Unable to send password reset email.");
        return;
      }

      setShowResetAlert(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          className="flex w-[400px] flex-col"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <motion.h1
            className="space-grotesk-medium text-center text-[60px] font-bold text-white"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            Forgot Password
          </motion.h1>

          <p className="mt-4 text-center text-white/60">
            Enter your username and we'll send you a password reset link on your gmail.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-transparent px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />

              <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-white" />
            </div>

            {error && (
              <p className="text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {message && (
              <p className="text-center text-sm text-green-400">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="rounded-lg bg-[#228EE5] py-4 font-semibold text-white transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="cursor-pointer text-center font-semibold text-gray-400 transition-colors hover:text-white"
            >
              Back to login
            </button>
          </div>
        </motion.div>
      </div>
      {showResetAlert && (
        <ResetAlert onClose={() => setShowResetAlert(false)} />
      )}
    </div>
    
  );
}