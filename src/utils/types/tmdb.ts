
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

interface TMDBResponse {
  page: number;
  results: TMDBTitle[];
  total_pages: number;
  total_results: number;
}

export async function getPopularTitles(
  type: TMDBMediaType,
): Promise<TMDBTitle[]> {
  const { data, error } = await supabase.functions.invoke<TMDBResponse>(
    "tmdb-proxy",
    {
      body: {
        type,
        action: "popular",
        page: 1,
      },
    },
  );

  if (error) {
    throw new Error(`Unable to load titles: ${error.message}`);
  }

  if (!data || !Array.isArray(data.results)) {
    throw new Error("TMDB returned an invalid response.");
  }

  return data.results;
}

export async function searchTitles(
  type: TMDBMediaType,
  query: string,
): Promise<TMDBTitle[]> {
  const { data, error } = await supabase.functions.invoke<TMDBResponse>(
    "tmdb-proxy",
    {
      body: {
        type,
        action: "search",
        query,
        page: 1,
      },
    },
  );

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  if (!data || !Array.isArray(data.results)) {
    throw new Error("TMDB returned an invalid response.");
  }

  return data.results;
}
