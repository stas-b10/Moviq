import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function Profile() {
const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    navigate("/", { replace: true });
  };
  return (
    <div className="relative h-screen overflow-hidden bg-[#EBFAFF] dark:bg-[#030A1B]">
     <section className="">
      <p className="mt-30 text-center text-3xl font-bold">
        Welcome to the Profile Page
      </p>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={handleLogout} className="cursor-pointer rounded-lg bg-[#228EE5] px-8 py-3 font-semibold text-white transition-transform duration-300 hover:scale-[1.02]">
          Log out
        </button>
      </div>
    </section>
    </div>
  )
}
