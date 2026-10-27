import { useEffect,useState } from "react"
import { FaMoon } from "react-icons/fa6";
import { LuSun } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import light_logo from "../assets/images/light_logo.png"
import dark_logo from "../assets/images/dark_logo.png"
import { IoNotifications, IoPerson } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import Notifications from "./Notifications";
import { supabase } from "../utils/supabase";

export default function Navbar() {
  const [darkMode,setDarkMode] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
  let active = true;
  let channel: ReturnType<typeof supabase.channel> | undefined;

  const loadUnreadCount = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!active || userError || !user) {
      if (active) setUnreadCount(0);
      return;
    }

    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false);

      if (!error && active) {
        setUnreadCount(count ?? 0);
      }
    };
    await fetchCount();
    if (!active) return;
    channel = supabase
      .channel(`navbar-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          void fetchCount();
        },
      )
      .subscribe();
  };

  void loadUnreadCount();

  return () => {
    active = false;
    if (channel) void supabase.removeChannel(channel);
  };
}, []);

    
  return (
    <>
   <header className="absolute top-5 left-1/2 z-50 w-[95%] max-w-[1500px] -translate-x-1/2 rounded-[23px] p-[5px] backdrop-blur-xs bg-transparent gradient-border">
      <nav className="mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/home" className="absolute left-[25px] top-1/2 -translate-y-1/2"><img src={darkMode ? light_logo : dark_logo} alt="icon" className="h-20 w-20"/></Link>
      <div className="flex items-center gap-12 ml-[280px]">
        <Link to="/home" onClick={(e) => { if (isHome) { e.preventDefault(); }}} className={`relative text-[20px] space-grotesk-bold text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:rounded-full after:bg-[#228EE5] after:transition-transform after:duration-300 ${location.pathname === "/home" ? "after:scale-x-100" : "after:scale-x-0"}`}>Home</Link>
        <Link to="wheel" className={`relative text-[20px] space-grotesk-bold text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:rounded-full after:bg-[#228EE5] after:transition-transform after:duration-300 ${location.pathname === "/wheel" ? "after:scale-x-100" : "after:scale-x-0"}`}>Wheel</Link>
        <Link to="friends" className={`relative text-[20px] space-grotesk-bold text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:rounded-full after:bg-[#228EE5] after:transition-transform after:duration-300 ${location.pathname === "/friends" ? "after:scale-x-100" : "after:scale-x-0"}`}>Friends</Link>
        <Link to="movies" className={`relative text-[20px] space-grotesk-bold text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:rounded-full after:bg-[#228EE5] after:transition-transform after:duration-300 ${location.pathname === "/movies" ? "after:scale-x-100" : "after:scale-x-0"}`}>Movies</Link>
        <Link to="series" className={`relative text-[20px] space-grotesk-bold text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:rounded-full after:bg-[#228EE5] after:transition-transform after:duration-300 ${location.pathname === "/series" ? "after:scale-x-100" : "after:scale-x-0"}`}>Series</Link>
        <Link to="collections" className={`relative text-[20px] space-grotesk-bold text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:rounded-full after:bg-[#228EE5] after:transition-transform after:duration-300 ${location.pathname === "/collections" ? "after:scale-x-100" : "after:scale-x-0"}`}>Collections</Link>
        <Link to="faq" className={`relative text-[20px] space-grotesk-bold text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:rounded-full after:bg-[#228EE5] after:transition-transform after:duration-300 ${location.pathname === "/faq" ? "after:scale-x-100" : "after:scale-x-0"}`}>FAQ</Link>
  
      </div>
      <div className="flex flex-row gap-4">
      <button  className="relative flex h-8 w-8 items-center justify-center text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer">
        <MdOutlineSearch className="absolute text-[24px]"/>
      </button>
      <button onClick={() => setNotificationOpen((prev) => !prev)} className="relative flex h-8 w-8 items-center justify-center text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer">
        <IoNotifications className="absolute text-[24px]"/>
        {unreadCount > 0 && (
          <span className="absolute right-1 bottom-1 h-2.5 w-2.5 rounded-full border-2 border-[#030A1B] bg-red-500" />
        )}
      </button>
      <button onClick={() => navigate("/profile")} className="relative flex h-8 w-8 items-center justify-center text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer">
        <IoPerson className="absolute text-[24px]" />
      </button>
      <button onClick={() => setDarkMode((prev) => !prev)} className="relative flex h-8 w-8 items-center justify-center text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer">
        {darkMode ? (<LuSun className="absolute text-[24px] -rotate-20" />  ) : ( <FaMoon className="absolute text-[24px] -rotate-20" /> )}
      </button>
      </div>
      </nav>
      <Notifications  isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} onUnreadCountChange={setUnreadCount}/>
    </header>
    </>
  )
}
