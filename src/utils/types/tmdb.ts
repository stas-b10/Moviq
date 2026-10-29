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
  const data = await invokeTMDB<TMDBListResponse>({
    type: "all",
    action: "trending",
    page: 1,
  });

  return (data.results ?? [])
    .filter(
      (title) =>
        title.media_type === "movie" || title.media_type === "tv"
    )
    .map((title) => ({
      ...title,
      media_type: (title as TMDBTrendingTitle).media_type,
    })) as TMDBTrendingTitle[];
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


export async function getPopularMovies(): Promise<TMDBTrendingTitle[]> {
  const MAX_PAGES = 20;

  const sources = [
    "popular",
    "top_rated",
    "now_playing",
    "upcoming",
  ] as const;

  const results = await Promise.all(
    sources.map(async (action) => {
      const pages = await Promise.all(
        Array.from({ length: MAX_PAGES }, (_, index) =>
          invokeTMDB<TMDBListResponse>({
            type: "movie",
            action,
            page: index + 1,
          })
        )
      );

      return pages.flatMap((page) => page.results ?? []);
    })
  );

  const uniqueMovies = new Map<number, TMDBTrendingTitle>();

  for (const movies of results) {
    for (const movie of movies) {
      if (!uniqueMovies.has(movie.id)) {
        uniqueMovies.set(movie.id, {
          ...movie,
          media_type: "movie",
        });
      }
    }
  }

  return Array.from(uniqueMovies.values()).slice(0, 50);
}
