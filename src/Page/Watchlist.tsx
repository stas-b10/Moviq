
import { useEffect, useState } from "react";
import MoviesCard from "../components/MoviesCard";
import type { TMDBTrendingTitle } from "../utils/types/tmdb";
import { FaHeart } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import StarBorder from "../components/StarBorder";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";

const TITLES_PER_PAGE = 40;

export default function Watchlist() {
  const [favorites, setFavorites] = useState<TMDBTrendingTitle[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const totalPages = Math.ceil(favorites.length / TITLES_PER_PAGE);
  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (safePage - 1) * TITLES_PER_PAGE;
  const currentTitles = favorites.slice( startIndex, startIndex + TITLES_PER_PAGE);


  const handleRemoveFavorite = (selectedTitle: TMDBTrendingTitle) => {
    setFavorites((current) =>
      current.filter(
        (item) =>
          !(
            item.id === selectedTitle.id &&
            item.media_type === selectedTitle.media_type
          )
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <main className="min-h-screen bg-[#EBFAFF] px-6 py-12 text-slate-950 dark:bg-[#030A1B] dark:text-white sm:px-10">
      <div className="mx-auto max-w-[1600px] pt-20 pl-20">
        {favorites.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#228EE5]/10">
              <FaHeart className="text-4xl text-[#228EE5]/50" />
            </div>
            <h2 className="space-grotesk-bold text-2xl">
              No favorites yet
            </h2>
            <p className="inter-regular mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-white/50">
              You haven't added any movies or TV shows to your favorites yet.
              Explore and save the titles you love!
            </p>
            <StarBorder onClick={() => {navigate("/")}} className="text-[15px] mt-4">
              <span className="inline-flex items-center gap-1">
                Explore titles
          <IoIosArrowForward className="ml-1 mt-1"/>
          </span>
        </StarBorder>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6 w-[1450px]">
            {currentTitles.map((title) => (
              <MoviesCard key={`${title.media_type}-${title.id}`} title={title} isFavorite={true} onToggleFavorite={handleRemoveFavorite}/>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button onClick={() => setCurrentPage(safePage - 1)} disabled={safePage === 1} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 transition hover:bg-[#228EE5] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10">
                <MdKeyboardArrowLeft className="text-2xl" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition ${safePage === page ? "bg-[#228EE5] text-white" : "border border-slate-300 hover:bg-[#228EE5]/10 dark:border-white/10" }`}>
                  {page}
                </button>
                
            </div>
          )}
          </>
        )}

      </div>
    </main>
  );
}
