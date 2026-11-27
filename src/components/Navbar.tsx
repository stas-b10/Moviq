import { useEffect, useRef, useState } from "react";
import { FaMoon, FaStar } from "react-icons/fa6";
import { LuSun } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import light_logo from "../assets/images/light_logo.png"
import dark_logo from "../assets/images/dark_logo.png"
import { IoNotifications, IoPerson } from "react-icons/io5";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import {MdOutlineSearch,MdClose } from "react-icons/md";
import Notifications from "./Notifications";
import { supabase } from "../utils/supabase";
import {searchTitles,type TMDBTrendingTitle,} from "../utils/types/tmdb";

export default function Navbar() {
  const [darkMode,setDarkMode] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBTrendingTitle[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchWrapperRef = useRef<HTMLDivElement>(null);

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

const closeSearch = () => {
  setSearchOpen(false);
  setSearchQuery("");
  setSearchResults([]);
  setSearchLoading(false);
  setSearchError("");
};

useEffect(() => {
  const query = searchQuery.trim();

  if (!searchOpen || query.length < 2) {
    return;
  }

  let active = true;

  const timeout = window.setTimeout(async () => {
    setSearchLoading(true);
    setSearchError("");

    try {
      const results = await searchTitles(query);

      if (active) {
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);

      if (active) {
        setSearchResults([]);
        setSearchError("Something went wrong. Please try again.");
      }
    } finally {
      if (active) {
        setSearchLoading(false);
      }
    }
  }, 350);

  return () => {
    active = false;
    window.clearTimeout(timeout);
  };
}, [searchQuery, searchOpen]);

useEffect(() => {
  if (!searchOpen) return;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchWrapperRef.current &&
      !searchWrapperRef.current.contains(event.target as Node)
    ) {
      closeSearch();
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeSearch();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscape);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
  };
}, [searchOpen]);

const getTitleName = (title: TMDBTrendingTitle) => {
  return title.title ?? title.name ?? "Untitled";
};

const getReleaseYear = (title: TMDBTrendingTitle) => {
  const date = title.release_date ?? title.first_air_date;
  return date ? date.slice(0, 4) : "Year unknown";
};

const handleResultClick = (title: TMDBTrendingTitle) => {
  navigate(`/details/${title.media_type}/${title.id}`);
  closeSearch();
};

    
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
      <div ref={searchWrapperRef} className="relative flex items-center transition-colors duration-300">
        <button onClick={() => { if (searchOpen) { closeSearch();} else { setSearchOpen(true); setNotificationOpen(false);}}} aria-label="Search" className="relative flex h-8 w-8 cursor-pointer items-center justify-center text-[#091E51] transition-colors duration-300 dark:text-white dark:hover:text-gray-200">
          {searchOpen ? ( <MdClose className="text-[25px]" /> ) : ( <MdOutlineSearch className="text-[25px]" />)}
        </button>
         {searchOpen && (
          <div className="absolute right-[-225px] top-full z-[100] mt-6 w-[480px] max-w-[85vw] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#071329]">
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-white/10">
            <button type="button" onClick={() => { if (searchQuery.trim()) { navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`); closeSearch();} else { navigate("/"); closeSearch();}}}
                    className="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-[#091E51] dark:hover:text-white" aria-label="Search">
              <MdOutlineSearch className="text-2xl" />
            </button>
            <input autoFocus type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchResults([]); setSearchError("");}} placeholder="Search movies and TV shows..." className="w-full bg-transparent text-base text-[#091E51] outline-none placeholder:text-gray-400 dark:text-white"/>
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchResults([]); setSearchError("");}} className="cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-white" aria-label="Clear search">
                <MdClose className="text-xl" />
              </button>
            )}
            </div>
            <div className="max-h-[520px] min-h-[80px] overflow-y-auto">
              {searchQuery.trim().length < 2 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">
                  Type at least 2 characters to search.
                </p>
                ) : searchLoading ? (
                  <div className="flex items-center justify-center gap-3 px-5 py-10 text-sm text-gray-400">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#228EE5]" />
                    Searching...   
                  </div>
                ) : searchError ? (
                  <p className="px-5 py-8 text-center text-sm text-red-500">
                    {searchError}
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-gray-400">
                    No Movies or Tv Shows found.
                  </p>
                ) : (
                  <div className="space-y-1 p-2">
                    {searchResults.map((title) => (
                      <button key={`${title.media_type}-${title.id}`} onClick={() => handleResultClick(title)} className="flex w-full cursor-pointer items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
                        <div className="h-[85px] w-[58px] shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-[#14213a]">
                          {title.poster_path ? (
                            <img src={`https://image.tmdb.org/t/p/w92${title.poster_path}`} alt={getTitleName(title)} loading="lazy" className="h-full w-full object-cover"/>
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-semibold text-[#091E51] dark:text-white">
                            {getTitleName(title)}
                          </p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{getReleaseYear(title)}</span>
                          <span>-</span>
                          <span>
                            {title.media_type === "movie" ? "Movie" : "TV Show"}
                          </span>
                        </div>
                       </div>
                       {title.vote_average > 0 && (
                        <span className="shrink-0 text-sm font-semibold text-[#228EE5] inline-flex">
                          <FaStar className="mt-0.5 mr-1 text-yellow-500"/> {title.vote_average.toFixed(1)}
                        </span>
                       )}
                     </button>
                    ))}
                  </div>
                )}
            </div>
            {searchQuery.trim().length >= 2 && (
              <button type="button" onClick={() => { navigate( `/search?query=${encodeURIComponent(searchQuery.trim())}`); closeSearch();}}  className="flex w-full items-center justify-center gap-2 border-t border-gray-200 px-5 py-4 text-sm font-semibold text-[#091E51] transition-colors hover:bg-gray-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5 cursor-pointer">
                See all results for "{searchQuery.trim()}"
                <MdOutlineSearch className="text-lg text-[#228EE5]" />
              </button>
            )}
          </div>
         )}
      </div>
      <button onClick={() => setNotificationOpen((prev) => !prev)} className="relative flex h-8 w-8 items-center justify-center text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer">
        <IoNotifications className="absolute text-[24px]"/>
        {unreadCount > 0 && (
          <span className="absolute right-1 bottom-1 h-2.5 w-2.5 rounded-full border-2 border-[#030A1B] bg-red-500" />
        )}
      </button>
      <button onClick={() => navigate("/profile")} className="relative flex h-8 w-8 items-center justify-center text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer">
        <IoPerson className="absolute text-[24px]" />
      </button>
      <button onClick={() => navigate("/watchlist")} className="relative flex h-8 w-8 items-center justify-center text-[#091E51] dark:text-white dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer">
        <BsFillBookmarkStarFill className="absolute text-[21px]" />
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
