import { Route, Routes, useLocation } from 'react-router-dom'
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
      <Footer />
    </div>
  );
}

export default App;