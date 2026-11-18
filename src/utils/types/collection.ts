import { supabase } from "../supabase";

export interface TMDBCollection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  average_rating?: number;
  total_vote_count?: number;
  popularity_score?: number;
}

export interface TMDBCollectionMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TMDBCollectionDetails extends TMDBCollection {
  parts: TMDBCollectionMovie[];
}

interface TMDBCollectionsResponse {
  page: number;
  results: TMDBCollection[];
  total_pages: number;
  total_results: number;
}

async function invokeCollections<T>(
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(
    "tmdb-proxy",
    { body }
  );

  if (error) {
    console.error("Supabase function error:", error);
    throw new Error(error.message || "Collection request failed.");
  }

  if (!data) {
    throw new Error("TMDB returned no collection data.");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as T;
}


export async function searchMovieCollections(
  query: string,
  page = 1
): Promise<TMDBCollection[]> {
  if (!query.trim()) return [];

  const data = await invokeCollections<TMDBCollectionsResponse>({
    action: "search_collections",
    query: query.trim(),
    page,
  });

  return data.results ?? [];
}


export async function getMovieCollection(collectionId: number) {
  return invokeCollections({
    action: "collection_details",
    collectionId,
  });
}

export async function getPopularCollections(): Promise<TMDBCollection[]> {
  const data = await invokeCollections<TMDBCollectionsResponse>({
    action: "discover_collections",
  });

  return data.results ?? [];
}