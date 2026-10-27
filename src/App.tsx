import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './utils/supabase'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Page/Home'
import Auth from "./Page/Auth";
import Avatars from './Page/Avatars';
import SuccesfulRegistry from "./Page/SuccesfulRegistry"
import SuccesfulLogged from './Page/SuccesfulLogged';
import AuthCallback from './Page/AuthCallBack';
import ProfileSet from "./Page/ProfileSet";
import ForgotPassword from "./Page/ForgotPassword";
import ResetPassword from "./Page/ResetPassword";
import SuccesfulReseted from './Page/SuccsefulReseted';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideLayout = ["/","/succesfully_registration","/succesful_logged","/succesful_reseted","/auth/callback","/profile_set","/avatars","/auth/callback","/forgot_password","/reset_password"].includes(location.pathname);

  useEffect(() => {
  const checkSession = async () => {
    if (location.pathname !== "/") {
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      navigate("/home", { replace: true });
    }
  };

  checkSession();
}, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#121212] dark:text-white transition-colors duration-300 flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-1">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Auth />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path='/succesfully_registration' element={<SuccesfulRegistry />} />
            <Route path='/succesful_logged' element={<SuccesfulLogged />} />
            <Route path='/succesful_reseted' element={<SuccesfulReseted />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile_set" element={<ProfileSet />} />
            <Route path="/forgot_password" element={<ForgotPassword />} />
            <Route path="/reset_password" element={<ResetPassword />} />
            <Route path="/home" element={<Home />} />
         </Routes>
      </main>
      {hideLayout && <Footer />}
    </div>
  );
}

export default App;