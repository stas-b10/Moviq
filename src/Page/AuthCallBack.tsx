import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let isHandled = false;

    const handleSession = async () => {
      if (isHandled) return;

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Authentication error:", error);
        return;
      }

      if (!session?.user) {
        console.log("No session yet, waiting...");
        return;
      }

      isHandled = true;

      const user = session.user;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile lookup error:", profileError);
        return;
      }

      console.log("Google user:", user);
      console.log("Profile:", profile);

      if (!profile) {
        sessionStorage.removeItem("google_auth_action");
        navigate("/profile-set", { replace: true });
        return;
      }

      sessionStorage.removeItem("google_auth_action");
      navigate("/succesful_logged", { replace: true });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);

      if (session?.user) {
        handleSession();
      }
    });
    handleSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030A1B]">
      <p className="text-lg text-white">
        Signing you in...
      </p>
    </div>
  );
}