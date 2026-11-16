
import { useNavigate } from "react-router-dom";
import type { TMDBCollection } from "../utils/collections";

interface CollectionCardProps {
  collection: TMDBCollection;
}

export default function CollectionCard({
  collection,
}: CollectionCardProps) {
  const navigate = useNavigate();

  const name = collection.name ?? "Untitled";

  const posterUrl = collection.poster_path
    ? `https://image.tmdb.org/t/p/w500${collection.poster_path}`
    : null;

  const openCollection = () => {
    navigate(`/collections/${collection.id}`);
  };

  return (
    <article
      onClick={openCollection}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCollection();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${name} collection`}
      className="group relative w-full cursor-pointer aspect-[3/4] transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#228EE5] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#030A1B]"
    >
      <div className="absolute inset-0 translate-x-[9px] translate-y-[5px] rounded-xl bg-[#6650A5] shadow-lg" />

      <div className="absolute inset-0 translate-x-[5px] translate-y-[3px] overflow-hidden rounded-xl bg-[#28234D]">
        {posterUrl && (
          <img
            src={posterUrl}
            alt=""
            className="h-full w-full object-cover opacity-70"
          />
        )}
      </div>

      <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-200 shadow-[0_2px_10px_rgba(34,142,229,0.15)] transition-all duration-300 group-hover:shadow-[0_0_22px_rgba(34,142,229,0.4)] dark:bg-[#111D33]">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${name} collection poster`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500 dark:text-white/50">
            No poster available
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20" />

        <div className="absolute inset-0 flex items-center justify-center px-2">
          <h3
            title={name}
            className="space-grotesk-bold text-center text-[20px] leading-tight font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]"
          >
            {name}
          </h3>
        </div>
      </div>
    </article>
  );
}
