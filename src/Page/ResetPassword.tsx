import { useState } from "react";
import { motion } from "framer-motion";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 7) {
      setError("Password must be at least 7 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        setError("Unable to reset your password. Please try again.");
        return;
      }

      navigate("/succesful_reseted");
    } catch (error) {
      console.error("Reset password error:", error);
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
            Reset Password
          </motion.h1>

          <p className="mt-4 text-center text-white/60">
            Enter your new password below.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-transparent px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white"
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-transparent px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white"
              >
                {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>

            {error && (
              <p className="text-center text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="cursor-pointer rounded-lg bg-[#228EE5] py-4 font-semibold text-white transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}