
import { supabase } from "../supabase";

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for?: Array<{
    id: number;
    title?: string;
    name?: string;
    media_type?: "movie" | "tv";
    poster_path: string | null;
  }>;
}

interface TMDBPeopleResponse {
  results: TMDBPerson[];
  page: number;
  total_pages: number;
  total_results: number;
}

async function getPopularPeople(
  department: "Acting" | "Directing"
): Promise<TMDBPerson[]> {
  const { data, error } = await supabase.functions.invoke(
    "tmdb-proxy",
    {
      body: {
        action: "popular_people",
        department,
      },
    }
  );

  if (error) throw error;

  if (data?.error) {
    throw new Error(data.error);
  }

  return (data as TMDBPeopleResponse).results ?? [];
}

export function getPopularActors(): Promise<TMDBPerson[]> {
  return getPopularPeople("Acting");
}

export function getPopularDirectors(): Promise<TMDBPerson[]> {
  return getPopularPeople("Directing");
}
