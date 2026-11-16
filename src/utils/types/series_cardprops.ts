import type { TMDBTrendingTitle } from "./tmdb";

export interface SeriesCardProps {
  title: TMDBTrendingTitle;
  rating?: string | number | null;
  isFavorite: boolean;
  onToggleFavorite: (title: TMDBTrendingTitle) => void;
}