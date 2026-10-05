import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Page/Home'
import Auth from "./Page/Auth";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Home />} />
         </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;