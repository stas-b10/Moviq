import { supabase } from "../supabase";

export type TMDBMediaType = "movie" | "tv";

export interface TMDBTitle {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: TMDBMediaType;
  genre_ids?: number[];
}

export interface TMDBTrendingTitle extends TMDBTitle {
  media_type: TMDBMediaType;
  imdbRating?: number;
  imdbVotes?: string | null;
}

export interface StreamingProvider {
  id: number;
  name: string;
  logoPath: string | null;
  logoUrl: string | null;
  categories?: string[];
}

export interface TMDBEnrichment {
  id: number;
  type: TMDBMediaType;
  region: string;
  imdbId: string | null;
  imdbRating: string | null;
  imdbVotes: string | null;
  providers: StreamingProvider[];
  providerLink: string | null;
  providerAttribution: string | null;
}

interface TMDBListResponse {
  results: TMDBTitle[];
}

interface TMDBTrendingResponse {
  results: (TMDBTitle & {
    media_type: TMDBMediaType | "person";
  })[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

const POPULAR_MOVIES_CACHE_KEY = "moviq:movies:v1";
const POPULAR_MOVIES_CACHE_TTL = 6 * 60 * 60 * 1000;

let popularMoviesRequest: Promise<TMDBTrendingTitle[]> | null = null;


async function invokeTMDB<T>(
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(
    "tmdb-proxy",
    { body }
  );

  if (error) {
    throw new Error(error.message || "TMDB request failed.");
  }

  if (!data) {
    throw new Error("The TMDB proxy returned no data.");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as T;
}

export async function getTrendingTitles(): Promise<TMDBTrendingTitle[]> {
  const data = await invokeTMDB<TMDBTrendingResponse>({
    type: "all",
    action: "trending",
    page: 1,
  });

  return data.results
    .filter(
      (title): title is TMDBTitle & {
        media_type: TMDBMediaType;
      } =>
        title.media_type === "movie" ||
        title.media_type === "tv"
    );
}

export async function getPopularTitles(
  type: TMDBMediaType,
  page = 1
): Promise<TMDBTrendingTitle[]> {
  const data = await invokeTMDB<TMDBListResponse>({
    type,
    action: "popular",
    page,
  });

  return (data.results ?? []).map((title) => ({
    ...title,
    media_type: type,
  }));
}

export async function getTitleEnrichment(
  type: TMDBMediaType,
  id: number,
  region = "MD"
): Promise<TMDBEnrichment> {
  return invokeTMDB<TMDBEnrichment>({
    type,
    action: "enrich",
    id,
    region,
  });
}

const ENRICHMENT_CACHE_PREFIX = "moviq:enrichment:";
const ENRICHMENT_CACHE_TTL = 24 * 60 * 60 * 1000;

export async function getCachedTitleEnrichment(
  type: TMDBMediaType,
  id: number,
  region = "MD"
): Promise<TMDBEnrichment> {
  const key = `${ENRICHMENT_CACHE_PREFIX}${region}:${type}:${id}`;

  try {
    const cached = localStorage.getItem(key);

    if (cached) {
      const entry = JSON.parse(cached) as {
        timestamp: number;
        data: TMDBEnrichment;
      };

      if (
        Date.now() - entry.timestamp < ENRICHMENT_CACHE_TTL &&
        entry.data &&
        Array.isArray(entry.data.providers)
      ) {
        return entry.data;
      }
    }
  } catch {
    //
  }

  const data = await getTitleEnrichment(type, id, region);

  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // 
  }

  return data;
}



export async function getPopularMovies(
  onUpdate?: (movies: TMDBTrendingTitle[]) => void
): Promise<TMDBTrendingTitle[]> {
  try {
    const cached = localStorage.getItem(POPULAR_MOVIES_CACHE_KEY);

    if (cached) {
      const entry = JSON.parse(cached) as {
        timestamp: number;
        movies: TMDBTrendingTitle[];
      };

      if (
        Date.now() - entry.timestamp < POPULAR_MOVIES_CACHE_TTL &&
        Array.isArray(entry.movies)
      ) {
        onUpdate?.(entry.movies);
        return entry.movies;
      }
    }
  } catch {
    // Ignore invalid or unavailable cache.
  }

  if (popularMoviesRequest) {
    const movies = await popularMoviesRequest;
    onUpdate?.(movies);
    return movies;
  }

  popularMoviesRequest = (async () => {
    const MAX_MOVIES = 50;
    const MAX_PAGES_PER_SOURCE = 2;

    const sources = [
      "popular",
      "top_rated",
      "now_playing",
      "upcoming",
    ] as const;

    const uniqueMovies = new Map<number, TMDBTrendingTitle>();

    for (
      let page = 1;
      page <= MAX_PAGES_PER_SOURCE;
      page++
    ) {
      for (const action of sources) {
        if (uniqueMovies.size >= MAX_MOVIES) break;

        try {
          const data = await invokeTMDB<TMDBListResponse>({
            type: "movie",
            action,
            page,
          });

          for (const movie of data.results ?? []) {
            if (!uniqueMovies.has(movie.id)) {
              uniqueMovies.set(movie.id, {
                ...movie,
                media_type: "movie",
              });
            }
          }

          onUpdate?.(
            Array.from(uniqueMovies.values()).slice(0, MAX_MOVIES)
          );
        } catch (error) {
          console.error(
            `Failed to load ${action}, page ${page}:`,
            error
          );
        }
      }

      if (uniqueMovies.size >= MAX_MOVIES) break;
    }

    const movies = Array.from(uniqueMovies.values()).slice(
      0,
      MAX_MOVIES
    );

    try {
      localStorage.setItem(
        POPULAR_MOVIES_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          movies,
        })
      );
    } catch {
      // 
    }

    return movies;
  })();

  try {
    return await popularMoviesRequest;
  } finally {
    popularMoviesRequest = null;
  }
}

export async function getMovieGenres(): Promise<TMDBGenre[]> {
  const data = await invokeTMDB<TMDBGenresResponse>({
    type: "movie",
    action: "movie_genres",
  });

  return data.genres ?? [];
}

export async function discoverMoviesByGenres(
  genreIds: number[],
  page = 1
): Promise<TMDBTrendingTitle[]> {
  const data = await invokeTMDB<TMDBListResponse>({
    type: "movie",
    action: "discover",
    page,
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
  });

  return (data.results ?? []).map((movie) => ({
    ...movie,
    media_type: "movie" as const,
  }));
}