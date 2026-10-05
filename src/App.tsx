import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Page/Home'
import Auth from "./Page/Auth";
import Avatars from './Page/Avatars';
import SuccesfulRegistry from "./Page/SuccesfulRegistry"
import SuccesfulLogged from './Page/SuccesfulLogged';

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
            <Route path='succesful_logged' element={<SuccesfulLogged />} />
            <Route path="/home" element={<Home />} />
         </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;