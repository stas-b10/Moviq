export interface MovieFilterValues {
  minRating: number;
  maxRating: number;
  genres: number[];
  country: string;
  minVotes: number;
  startYear: number;
  endYear: number;
  sortBy: "popular" | "rating" | "votes" | "newest" | "oldest";
}

export interface MovieFiltersProps {
  filters: MovieFilterValues;
  onChange: (filters: MovieFilterValues) => void;
  genres: { id: number; name: string }[];
  countries: { iso_3166_1: string; english_name: string }[];
}

const currentYear = new Date().getFullYear();

export const defaultFilters: MovieFilterValues = {
  minRating: 6.7,
  maxRating: 10,
  genres: [],
  country: "",
  minVotes: 100_000,
  startYear: 1900,
  endYear: currentYear,
  sortBy: "popular",
};

export const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#228EE5] dark:border-white/10 dark:bg-[#111D33] dark:text-white";