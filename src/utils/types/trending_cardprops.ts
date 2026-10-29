import type { TMDBTrendingTitle } from "./tmdb";

export interface TrendingCardProps {
  title: TMDBTrendingTitle;
  rating?: string | number | null;
  isFavorite: boolean;
  onToggleFavorite: (title: TMDBTrendingTitle) => void;
}