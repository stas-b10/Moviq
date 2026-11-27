
import { useState } from "react";
import MoviesCard from "../components/MoviesCard";
import { FaHeart } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import StarBorder from "../components/StarBorder";
import { useNavigate } from "react-router-dom";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { useWatchlist } from "../hooks/UseWatchlist";
import { ImSpinner2 } from "react-icons/im";

const TITLES_PER_PAGE = 30;

export default function Watchlist() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    watchlist,
    isLoading,
    error,
    removeFromWatchlist,
  } = useWatchlist();

  const totalPages = Math.ceil(watchlist.length / TITLES_PER_PAGE);
  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (safePage - 1) * TITLES_PER_PAGE;

  const currentTitles = watchlist.slice(
    startIndex,
    startIndex + TITLES_PER_PAGE
  );

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safePage <= 2) {
      return [1, 2, 3, "...", totalPages];
    }

    if (safePage >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      safePage - 1,
      safePage,
      safePage + 1,
      "...",
      totalPages,
    ];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleRemoveFavorite = async (
    title: (typeof watchlist)[number]
  ) => {
    await removeFromWatchlist(title);
  };

  if (isLoading) {
  return (
    <main className="min-h-screen bg-[#EBFAFF] px-6 py-12 dark:bg-[#030A1B]">
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
        <ImSpinner2 className="animate-spin text-4xl text-[#228EE5]" />

        <p className="inter-regular text-sm text-slate-500 dark:text-white/50">
          Loading your watchlist...
        </p>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#EBFAFF] px-6 py-12 text-slate-950 dark:bg-[#030A1B] dark:text-white sm:px-10">
      <div className="mx-auto max-w-[1600px] pt-20 pl-20">
        {error && (
          <p className="mb-6 text-center text-sm text-red-500">
            {error}
          </p>
        )}
        {watchlist.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#228EE5]/10">
              <FaHeart className="text-4xl text-[#228EE5]/50" />
            </div>
            <h2 className="space-grotesk-bold text-2xl">
              No favorites yet
            </h2>
            <p className="inter-regular mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-white/50">
              You haven't added any movies or TV shows to your watchlist yet.
              Explore and save the titles you love!
            </p>
            <StarBorder onClick={() => navigate("/")} className="mt-4 text-[15px]">
              <span className="inline-flex items-center gap-1">
                Explore titles
                <IoIosArrowForward className="ml-1 mt-1" />
              </span>
            </StarBorder>
          </div>
        ) : (
          <>
            <div className="grid w-[1450px] grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
              {currentTitles.map((title) => (
                <MoviesCard key={`${title.media_type}-${title.id}`} title={title} isFavorite={true} onToggleFavorite={() => { void handleRemoveFavorite(title);}}/>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <button onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 transition hover:bg-[#228EE5] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10">
                  <MdKeyboardArrowLeft className="text-2xl" />
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`dots-${index}`} className="px-2 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button key={page} onClick={() => handlePageChange(Number(page))} className={`h-10 min-w-10 cursor-pointer rounded-lg px-3 text-sm font-medium transition ${ safePage === page ? "bg-[#228EE5] text-white" : "border border-slate-300 hover:bg-[#228EE5]/10 dark:border-white/10"}`}>
                      {page}
                    </button>
                  )
                )}

                <button onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 transition hover:bg-[#228EE5] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10">
                  <MdKeyboardArrowRight className="text-2xl" />
                </button>
              </div>
            )}

            <p className="ml-4 mt-5 text-center text-sm text-slate-500 dark:text-white/40">
              Showing {startIndex + 1}–
              {Math.min(startIndex + TITLES_PER_PAGE, watchlist.length)} of{" "}
              {watchlist.length} titles
            </p>
          </>
        )}
      </div>
    </main>
  );
}
