
import { useEffect, useState } from "react";
import MoviesCard from "../components/MoviesCard";
import type { TMDBTrendingTitle } from "../utils/types/tmdb";
import { FaHeart } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import StarBorder from "../components/StarBorder";
import { useNavigate } from "react-router-dom";

export default function Watchlist() {
  const [favorites, setFavorites] = useState<TMDBTrendingTitle[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();


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
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6 w-[1450px]">
            {favorites.map((title) => (
              <MoviesCard key={`${title.media_type}-${title.id}`} title={title} isFavorite={true} onToggleFavorite={handleRemoveFavorite}/>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
