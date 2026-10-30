import { useNavigate } from "react-router-dom";
import { FaPlus, FaCheck } from "react-icons/fa6";
import type { TrendingCardProps } from "../utils/types/trending_cardprops";

export default function TrendingCard({
  title,
  isFavorite,
  onToggleFavorite,
}: TrendingCardProps) {
  const navigate = useNavigate();

  const name = title.title ?? title.name ?? "Untitled";


  const posterUrl = title.poster_path
    ? `https://image.tmdb.org/t/p/w500${title.poster_path}`
    : null;

  const openDetails = () => {
    navigate(`/details/${title.media_type}/${title.id}`);
  };

  const handleFavoriteClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    onToggleFavorite(title);
  };

  return (
    <article onClick={openDetails} onKeyDown={(event) => { if (event.key === "Enter") { openDetails(); }}} role="link" tabIndex={0} aria-label={`View details for ${name}`}
            className="group relative w-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#228EE5] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#030A1B]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-200 dark:bg-[#111D33]">
        {posterUrl ? (
          <img src={posterUrl} alt={`${name} poster`} loading="lazy" className="h-full w-full object-cover"/>
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500 dark:text-white/50">
            No poster available
          </div>
        )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80" />
        <button type="button" onClick={handleFavoriteClick} aria-label={ isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`} aria-pressed={isFavorite}  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={`absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition duration-200 hover:scale-110 ${ isFavorite ? "border-[#228EE5] bg-[#228EE5] text-white" : "border-white/30 bg-black/40 text-white cursor-pointer" }`}
        >
          {isFavorite ? (
            <FaCheck className="text-sm" />
          ) : (
            <FaPlus className="text-sm" />
          )}
        </button>
        <span className="absolute right-3 top-3 rounded-3xl border border-white/20 bg-black/50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md ">
          {title.media_type === "tv" ? "TV Show" : "Movie"}
        </span>
      </div>
      <div className="px-0.5 pb-1 pt-3 text-center justify-center">
        <h3 title={name} className="space-grotesk-bold text-[14px] leading-5 text-black dark:text-white">
          {name}
        </h3>
      </div>
    </article>
  );
}