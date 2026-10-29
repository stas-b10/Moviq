import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "./utils/supabase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Page/Home";
import Auth from "./Page/Auth";
import Avatars from "./Page/Avatars";
import SuccesfulRegistry from "./Page/SuccesfulRegistry";
import SuccesfulLogged from "./Page/SuccesfulLogged";
import AuthCallback from "./Page/AuthCallBack";
import ProfileSet from "./Page/ProfileSet";
import ForgotPassword from "./Page/ForgotPassword";
import ResetPassword from "./Page/ResetPassword";
import SuccesfulReseted from "./Page/SuccsefulReseted";
import Profile from "./Page/Profile";
import About from "./Page/About";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideLayout = [
    "/",
    "/succesfully_registration",
    "/succesful_logged",
    "/succesful_reseted",
    "/auth/callback",
    "/profile_set",
    "/avatars",
    "/forgot_password",
    "/reset_password",
  ].includes(location.pathname);

  useEffect(() => {
    const checkSession = async () => {
      if (location.pathname !== "/") return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/home", { replace: true });
      }
    };

    void checkSession();
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-black transition-colors duration-300 dark:bg-[#121212] dark:text-white">
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: "easeInOut", }} className="min-h-full">
            <Routes location={location}>
              <Route path="/" element={<Auth />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/succesfully_registration" element={<SuccesfulRegistry />}/>
              <Route path="/succesful_logged" element={<SuccesfulLogged />}/>
              <Route path="/succesful_reseted" element={<SuccesfulReseted />}/>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/profile_set" element={<ProfileSet />} />
              <Route path="/forgot_password" element={<ForgotPassword />} />
              <Route path="/reset_password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {hideLayout && <Footer />}
    </div>
  );
}