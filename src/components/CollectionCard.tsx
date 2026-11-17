
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMovieCollection,
  type TMDBCollection,
  type TMDBCollectionMovie,
} from "../utils/types/collection";

interface CollectionCardProps {
  collection: TMDBCollection;
}

export default function CollectionCard({
  collection,
}: CollectionCardProps) {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<TMDBCollectionMovie[]>([]);

  const name = collection.name ?? "Untitled";

  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      try {
        const data = await getMovieCollection(collection.id);

        if (!active) return;

        const posters = (data.parts ?? [])
          .filter((movie) => movie.poster_path)
          .slice(0, 3);

        setMovies(posters);
      } catch (error) {
        console.error("Failed to load collection movies:", error);
      }
    };

    loadMovies();

    return () => {
      active = false;
    };
  }, [collection.id]);

  const fallbackPoster = collection.poster_path
    ? `https://image.tmdb.org/t/p/w500${collection.poster_path}`
    : null;

  const posterImages = [
    movies[0]?.poster_path,
    movies[1]?.poster_path,
    movies[2]?.poster_path,
  ];

  const openCollection = () => {
    navigate(`/collections/${collection.id}`);
  };

  const getPosterUrl = (index: number) => {
    const path = posterImages[index] || collection.poster_path;

    return path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : null;
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
      className="group relative aspect-[3/4] w-full cursor-pointer transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#228EE5]"
    >
      <div className="absolute inset-0 translate-x-[14px] translate-y-[9px] overflow-hidden rounded-xl bg-[#6650A5] shadow-lg">
        {getPosterUrl(2) && (
          <img
            src={getPosterUrl(2)!}
            alt=""
            className="h-full w-full object-cover opacity-80"
          />
        )}
      </div>

      <div className="absolute inset-0 translate-x-[7px] translate-y-[5px] overflow-hidden rounded-xl bg-[#28234D] shadow-lg">
        {getPosterUrl(1) && (
          <img
            src={getPosterUrl(1)!}
            alt=""
            className="h-full w-full object-cover opacity-90"
          />
        )}
      </div>

      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#111D33] shadow-[0_2px_10px_rgba(34,142,229,0.15)] transition-all duration-300 group-hover:shadow-[0_0_22px_rgba(34,142,229,0.4)]">
        {getPosterUrl(0) || fallbackPoster ? (
          <img
            src={getPosterUrl(0) || fallbackPoster!}
            alt={`${name} collection`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/50">
            No poster available
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/20" />

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
