import { useState } from "react";
import {
  FaFilter,
  FaChevronDown,
  FaRotateLeft,
  FaXmark,
} from "react-icons/fa6";
import {defaultFilters,fieldClass} from "../utils/types/movie_filters"
import type {MovieFilterValues, MovieFiltersProps} from "../utils/types/movie_filters"

const currentYear = new Date().getFullYear();

export default function MovieFilters({
  filters,
  onChange,
  genres,
  countries,
}: MovieFiltersProps) {
  const [open, setOpen] = useState(false);

  const update = (values: Partial<MovieFilterValues>) => {
    onChange({ ...filters, ...values });
  };

  const reset = () => {
    onChange({ ...defaultFilters });
  };

  const toggleGenre = (id: number) => {
    const selected = filters.genres.includes(id)
      ? filters.genres.filter((genreId) => genreId !== id)
      : [...filters.genres, id];

    update({ genres: selected });
  };

  const activeCount = [ filters.minRating !== defaultFilters.minRating || filters.maxRating !== defaultFilters.maxRating,filters.genres.length > 0, filters.country !== "", filters.minVotes !== defaultFilters.minVotes, filters.startYear !== defaultFilters.startYear || filters.endYear !== defaultFilters.endYear, filters.sortBy !== defaultFilters.sortBy,].filter(Boolean).length;

  return (
    <div className="mt-6 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[#228EE5] dark:border-white/10 dark:bg-[#111D33] dark:text-white"
        >
          <FaFilter className="text-[#228EE5]" />
          Filters

          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#228EE5] px-1.5 text-xs text-white">
              {activeCount}
            </span>
          )}

          <FaChevronDown
            className={`text-xs transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#228EE5] dark:text-white/60"
          >
            <FaRotateLeft />
            Reset filters
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#081326] sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Filter movies
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
                Customize your movie discovery.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/10"
            >
              <FaXmark />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* IMDb rating */}
            <section>
              <label className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white">
                IMDb rating
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs text-slate-500 dark:text-white/50">
                    Minimum
                  </label>

                  <input
                    type="number"
                    min="0.1"
                    max={filters.maxRating}
                    step="0.1"
                    value={filters.minRating}
                    onChange={(event) => {
                      const value = Math.min(
                        10,
                        Math.max(
                          0.1,
                          Number(event.target.value) || 0.1
                        )
                      );

                      update({
                        minRating: Math.min(value, filters.maxRating),
                      });
                    }}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-slate-500 dark:text-white/50">
                    Maximum
                  </label>

                  <input
                    type="number"
                    min={filters.minRating}
                    max="10"
                    step="0.1"
                    value={filters.maxRating}
                    onChange={(event) => {
                      const value = Math.min(
                        10,
                        Math.max(
                          0.1,
                          Number(event.target.value) || 10
                        )
                      );

                      update({
                        maxRating: Math.max(value, filters.minRating),
                      });
                    }}
                    className={fieldClass}
                  />
                </div>
              </div>
            </section>

            {/* Country */}
            <section>
              <label
                htmlFor="movie-country"
                className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white"
              >
                Country
              </label>

              <select
                id="movie-country"
                value={filters.country}
                onChange={(event) => update({ country: event.target.value })}
                className={fieldClass}
              >
                <option value="">All countries</option>

                {countries.map((country) => (
                  <option
                    key={country.iso_3166_1}
                    value={country.iso_3166_1}
                  >
                    {country.english_name}
                  </option>
                ))}
              </select>
            </section>

            {/* Minimum votes */}
            <section>
              <label
                htmlFor="movie-votes"
                className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white"
              >
                Minimum IMDb votes
              </label>

              <select
                id="movie-votes"
                value={filters.minVotes}
                onChange={(event) =>
                  update({ minVotes: Number(event.target.value) })
                }
                className={fieldClass}
              >
                <option value={0}>Any number of votes</option>
                <option value={1000}>1,000+</option>
                <option value={10000}>10,000+</option>
                <option value={50000}>50,000+</option>
                <option value={100000}>100,000+</option>
                <option value={250000}>250,000+</option>
                <option value={500000}>500,000+</option>
                <option value={1000000}>1,000,000+</option>
              </select>
            </section>

            {/* Genres */}
            <section className="sm:col-span-2 lg:col-span-3">
              <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Genres
              </h4>

              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => {
                  const selected = filters.genres.includes(genre.id);

                  return (
                    <button
                      type="button"
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3.5 py-2 text-sm transition ${
                        selected
                          ? "border-[#228EE5] bg-[#228EE5] text-white"
                          : "border-slate-200 text-slate-600 hover:border-[#228EE5] dark:border-white/10 dark:text-white/70"
                      }`}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Release year */}
            <section>
              <label className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white">
                Release year
              </label>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  aria-label="Earliest release year"
                  min="1900"
                  max={filters.endYear}
                  value={filters.startYear}
                  onChange={(event) => {
                    const value = Math.min(
                      filters.endYear,
                      Math.max(1900, Number(event.target.value) || 1900)
                    );

                    update({ startYear: value });
                  }}
                  className={fieldClass}
                />

                <input
                  type="number"
                  aria-label="Latest release year"
                  min={filters.startYear}
                  max={currentYear}
                  value={filters.endYear}
                  onChange={(event) => {
                    const value = Math.min(
                      currentYear,
                      Math.max(
                        filters.startYear,
                        Number(event.target.value) || currentYear
                      )
                    );

                    update({ endYear: value });
                  }}
                  className={fieldClass}
                />
              </div>
            </section>

            {/* Sorting */}
            <section>
              <label
                htmlFor="movie-sort"
                className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white"
              >
                Sort by
              </label>

              <select
                id="movie-sort"
                value={filters.sortBy}
                onChange={(event) =>
                  update({
                    sortBy: event.target.value as MovieFilterValues["sortBy"],
                  })
                }
                className={fieldClass}
              >
                <option value="popular">Most popular</option>
                <option value="rating">Highest IMDb rating</option>
                <option value="votes">Most IMDb votes</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </section>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-200 pt-5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-[#228EE5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1677c5]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}