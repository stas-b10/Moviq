import { useEffect, useRef } from "react";
import { IoMailOutline } from "react-icons/io5";

interface VerificationProps {
  email: string;
  code: string;
  error: string;
  loading: boolean;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  onClose: () => void;
}

export default function Verification({email,code,error,loading,onCodeChange,onVerify,onClose,}: VerificationProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSubmittedCode = useRef("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
  if (code.length < 6) {
    lastSubmittedCode.current = "";
    return;
  }

  if (
    code.length === 6 &&
    !loading &&
    code !== lastSubmittedCode.current
  ) {
    lastSubmittedCode.current = code;
    onVerify();
  }
}, [code, loading, onVerify]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#030A1B]/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[500px] rounded-2xl border border-white/10 bg-[#0A1225] p-8 shadow-2xl">
        <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#9747FF]/15">
          <IoMailOutline className="mt-1 flex-shrink-0 text-[32px] text-[#7A9A6A]" />
        </div>
          <div className="flex-1">
            <h3 className="space-grotesk-medium text-[26px] font-semibold text-white">
              Verify your email
            </h3>

            <p className="mt-2 text-[15px] leading-relaxed text-white/60"> We sent a 6-digit verification code to{" "} <span className="text-white/90">{email}</span>.</p>

            <div
              className="relative mt-6 flex cursor-text justify-between"
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  onCodeChange(value);
                }}
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
              />

              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex h-14 w-12 items-center justify-center rounded-lg border text-xl text-white transition-colors ${
                    code[index]
                      ? "border-[#9747FF] bg-[#9747FF]/10"
                      : "border-white/15 bg-white/[0.03]"
                  }`}
                  style={{ fontFamily: "noah-bold, sans-serif" }}
                >
                  {code[index] || ""}
                </div>
              ))}
            </div>

            {error && (
              <p
                className="mt-3 text-sm text-red-500"
                style={{ fontFamily: "noah-regular, sans-serif" }}
              >
                The verification code is incorrect. Please try again.
              </p>
            )}

            <div className="mt-7 flex justify-start">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-[42px] rounded-lg border border-white/15 px-6 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={{ fontFamily: "noah-bold, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

