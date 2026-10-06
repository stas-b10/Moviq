import { motion } from "framer-motion";
import { IoCheckmarkCircle } from "react-icons/io5";


interface AlertProps {
  onClose: () => void;
}

export default function ResetAlert({ onClose }: AlertProps) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="relative w-full max-w-[460px] overflow-hidden rounded-[16px] border border-white/10 bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40% p-7 shadow-2xl md:p-9">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }} className="mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%" >
            <IoCheckmarkCircle className="text-[46px] text-[#228EE6]" />
          </motion.div>
          <h3 className="text-[26px] text-white" style={{ fontFamily: "noah-bold, sans-serif" }} > Password reset email sent </h3>
            <p className="mt-3 max-w-[360px] text-[16px] leading-relaxed text-gray-400" style={{ fontFamily: "noah-regular, sans-serif" }} > We’ve sent password reset instructions to your email address. Please check your inbox and follow the link to continue. </p>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-12 rounded-lg bg-[#228EE5] py-2.5 font-semibold text-white transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
      </motion.div>
    </div>
  );
}