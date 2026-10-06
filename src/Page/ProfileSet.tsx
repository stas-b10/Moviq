import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import set from "../assets/images/set.png";
import { supabase } from "../utils/supabase";

export default function ProfileSet() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/auth");
        return;
      }

      setEmail(user.email ?? "");

      setFullName(
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        ""
      );

      setPageLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleProfileSetup = async () => {
    setError("");

    if (!fullName.trim() || !username.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const cleanUsername = username.trim();

    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      const { data: existingUsername, error: usernameError } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("username", cleanUsername)
          .maybeSingle();

      if (usernameError) {
        console.error("Username lookup error:", usernameError);
        setError("Unable to check username.");
        return;
      }

      if (existingUsername) {
        setError("This username is already taken.");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: fullName.trim(),
          username: cleanUsername,
          email: user.email?.trim().toLowerCase(),
          role: "user",
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);

        if (profileError.code === "23505") {
          setError("This username is already taken.");
        } else {
          setError("Unable to create your profile.");
        }

        return;
      }

      navigate("/avatars");
    } catch (error) {
      console.error("Profile setup error:", error);
      setError("An error occurred while creating your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
        <p className="text-lg text-white">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
      <div className="flex min-h-screen">
        <motion.div className="flex w-[32%] flex-col" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          <motion.h1 className="space-grotesk-medium pl-[190px] pt-[100px] text-[80px] font-bold text-white" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            Welcome
          </motion.h1>

          <motion.div className="bebas-neue-regular mt-6 ml-[200px] w-[330px] text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            <span className="border-b-2 border-[#9747FF] pb-2 text-[24px] font-normal text-white">
              Register
            </span>
          </motion.div>

          <motion.div className="mt-10 ml-[200px] w-[330px]" initial={{ opacity: 0, x: 40 }}  animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
            <div className="flex flex-col gap-5 space-y-4 pb-20">
              <motion.input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                            className="rounded-lg border border-white/20 px-5 py-4 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
                            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
              />

              <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                       className="w-full rounded-lg border border-white/20 px-5 py-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-[#0F3187] focus:ring-1 focus:ring-[#0F3187]"
                />
                <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 transform text-white" />
              </motion.div>

              <motion.input type="email" placeholder="Email" value={email} disabled 
                            className="cursor-not-allowed rounded-lg border border-white/20 px-5 py-4 text-white/50 outline-none placeholder:text-white/50"
                            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
              />

              {error && (
                <p className="text-center text-sm text-red-500">
                  {error}
                </p>
              )}

              <motion.button type="button" onClick={handleProfileSetup} disabled={loading}
                             className="mt-2 cursor-pointer rounded-lg bg-[#228EE5] py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-transform duration-300 hover:scale-[1.02]"
                             initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                {loading ? "Creating account..." : "Register"}
              </motion.button>

            </div>
          </motion.div>
        </motion.div>

        <motion.div className="fixed right-0 top-[140px] flex w-[68%] items-start justify-start" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
          <img src={set} alt="Authentication" className="h-[720px] w-[1250px] rounded-3xl"
          />
        </motion.div>

      </div>
    </div>
  );
}