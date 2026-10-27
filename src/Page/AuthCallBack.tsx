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

      if (isHandled) return;

      if (error) {
        console.error("Authentication error:", error);
        return;
      }

      if (!session?.user) {
        return;
      }

      isHandled = true;

      const user = session.user;

      const googleAction = sessionStorage.getItem("google_auth_action");
      sessionStorage.removeItem("google_auth_action");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile lookup error:", profileError);
        return;
      }

      if (!profile) {
        navigate("/profile_set", { replace: true });
        return;
      }

      if (googleAction === "login") {
        const { error: notificationError } = await supabase.rpc(
          "notify_user_signin",
        );

        if (notificationError) {
          console.error(
            "Could not create Google sign-in notification:",
            notificationError.message,
          );
        }
      }

      navigate("/succesful_logged", { replace: true });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void handleSession();
    });

    void handleSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030A1B]">
      <p className="text-lg text-white">Signing you in...</p>
    </div>
  );
}
