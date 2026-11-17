import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTrendingTitles,
  getPopularTitles,
  getPopularMovies,
  getCachedTitleEnrichment,
  getMovieGenres,
  discoverMoviesByGenres,
  type TMDBTrendingTitle,
  type TMDBEnrichment,
  type TMDBGenre,
  getTvGenres,
  discoverSeriesByGenres,
} from "../utils/types/tmdb";
import {FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import TrendingCard from "../components/TrendingCard";
import MoviesCard from "../components/MoviesCard";
import SeriesCard from "../components/SeriesCard";
import CollectionCard from "../components/CollectionCard";
import { getPopularCollections,type TMDBCollection,} from "../utils/types/collection";

export default function Home() {
  const navigate = useNavigate();

  const [trending, setTrending] = useState<TMDBTrendingTitle[]>([]);
  const [enrichments, setEnrichments] = useState< Record<string, TMDBEnrichment>>({});
  const [filteredMovies, setFilteredMovies] = useState<TMDBTrendingTitle[]>([]);
  const [movieGenres, setMovieGenres] = useState<TMDBGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [mostPopularMovie, setMostPopularMovie] = useState<TMDBTrendingTitle | null>(null);
  const [popularMovieEnrichment, setPopularMovieEnrichment] = useState<TMDBEnrichment | null>(null);
  const [seriesGenres, setSeriesGenres] = useState<TMDBGenre[]>([]);
  const [selectedSeriesGenres, setSelectedSeriesGenres] = useState<number[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<TMDBTrendingTitle[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [collections, setCollections] = useState<TMDBCollection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [mostPopularSeries, setMostPopularSeries] = useState<TMDBTrendingTitle | null>(null);
  const [popularSeriesEnrichment, setPopularSeriesEnrichment] = useState<TMDBEnrichment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const trendsSwiperRef = useRef<SwiperType | null>(null);
  const moviesSwiperRef = useRef<SwiperType | null>(null);
  const genreSwiperRef = useRef<SwiperType | null>(null);
  const seriesSwiperRef = useRef<SwiperType | null>(null);
  const collectionsSwiperRef = useRef<SwiperType | null>(null);
  const seriesGenreSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
  let active = true;

  const loadCollections = async () => {
    try {
      const data = await getPopularCollections();

      if (active) {
        setCollections(data);
      }
    } catch (error) {
      console.error("Failed to load popular collections:", error);
    } finally {
      if (active) {
        setCollectionsLoading(false);
      }
    }
  };

  void loadCollections();

  return () => {
    active = false;
  };
}, []);

  useEffect(() => {
    let active = true;
  
    const loadMostPopularMovie = async () => {
      try {
        const movies = await getPopularMovies();

        if (!active || movies.length === 0) return;

        const movie = movies[0];

        setMostPopularMovie(movie);

        const enrichment = await getCachedTitleEnrichment(
          "movie",
          movie.id,
          "MD"
        );
        if (active) {
          setPopularMovieEnrichment(enrichment);
        }
      } catch (error) {
        console.error("Failed to load most popular movie:", error);
      }
    };

    void loadMostPopularMovie();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
  
    const loadMostPopularSeries = async () => {
      try {
        const series = await getPopularTitles("tv", 1);

        if (!active || series.length === 0) return;

        const popularSeries = series[0];

        setMostPopularSeries(popularSeries);

        const enrichment = await getCachedTitleEnrichment(
          "tv",
          popularSeries.id,
          "MD"
        );
        if (active) {
          setPopularSeriesEnrichment(enrichment);
        }
      } catch (error) {
        console.error("Failed to load most popular series:", error);
      }
    };

    void loadMostPopularSeries();

    return () => {
      active = false;
    };
  }, []);
  

  useEffect(() => {
    let active = true;

    const loadGenres = async () => {
      try {
       const genres = await getMovieGenres();

        if (active) {
          setMovieGenres(genres);
        }
      } catch (error) {
        console.error("Failed to load movie genres:", error);
      }
    };

    void loadGenres();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadSeriesGenres = async () => {
      try {
       const genres = await getTvGenres();

        if (active) {
          setSeriesGenres(genres);
        }
      } catch (error) {
        console.error("Failed to load series genres:", error);
      }
    };

    void loadSeriesGenres();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

  async function fetchHomeTitles() {
  setLoading(true);
  setError(null);
  setTrending([]);
  setEnrichments({});

  try {
    const TARGET_COUNT = 50;
    const MAX_PAGES_PER_TYPE = 5;
    const BATCH_SIZE = 10;

    const [trendingTitles, firstMoviePage, firstTvPage] =
      await Promise.all([
        getTrendingTitles(),
        getPopularTitles("movie", 1),
        getPopularTitles("tv", 1),
      ]);

    if (!active) return;

    const candidates = new Map<string, TMDBTrendingTitle>();

    const addCandidates = (titles: TMDBTrendingTitle[]) => {
      for (const title of titles) {
        if (!title.poster_path || !title.backdrop_path) continue;

        const key = `${title.media_type}-${title.id}`;

        if (!candidates.has(key)) {
          candidates.set(key, title);
        }
      }
    };

    addCandidates(trendingTitles);
    addCandidates(firstMoviePage);
    addCandidates(firstTvPage);

    let moviePage = 1;
    let tvPage = 1;

    const eligibleTitles: TMDBTrendingTitle[] = [];
    const enrichmentMap: Record<string, TMDBEnrichment> = {};
    const processedIds = new Set<string>();

    while (
      active &&
      eligibleTitles.length < TARGET_COUNT &&
      (moviePage < MAX_PAGES_PER_TYPE ||
        tvPage < MAX_PAGES_PER_TYPE)
    ) {
      const remainingCandidates = [...candidates.values()].filter(
        (title) =>
          !processedIds.has(`${title.media_type}-${title.id}`)
      );

      if (remainingCandidates.length < BATCH_SIZE) {
        const nextPages: Promise<TMDBTrendingTitle[]>[] = [];

        if (moviePage < MAX_PAGES_PER_TYPE) {
          moviePage++;
          nextPages.push(getPopularTitles("movie", moviePage));
        }

        if (tvPage < MAX_PAGES_PER_TYPE) {
          tvPage++;
          nextPages.push(getPopularTitles("tv", tvPage));
        }

        const fetchedPages = await Promise.all(nextPages);

        if (!active) return;

        for (const page of fetchedPages) {
          addCandidates(page);
        }
      }

      const batch = [...candidates.values()]
        .filter(
          (title) =>
            !processedIds.has(`${title.media_type}-${title.id}`)
        )
        .slice(0, BATCH_SIZE);

      if (batch.length === 0) break;

      const results = await Promise.all(
        batch.map(async (title) => {
          const id = `${title.media_type}-${title.id}`;

          processedIds.add(id);

          try {
            const details = await getCachedTitleEnrichment(
              title.media_type,
              title.id,
              "MD"
            );

            const rating =
              details.imdbRating === null
                ? NaN
                : Number(details.imdbRating);

            if (
              !Number.isFinite(rating) ||
              rating <= 6.7 ||
              rating > 10
            ) {
              return null;
            }

            return { title, details };
          } catch (err) {
            console.warn(
              `Could not enrich ${title.title ?? title.name ?? title.id}`,
              err
            );

            return null;
          }
        })
      );

      if (!active) return;

      for (const result of results) {
        if (!result) continue;

        const id = `${result.title.media_type}-${result.title.id}`;

        if (eligibleTitles.some(
          (title) => `${title.media_type}-${title.id}` === id
        )) {
          continue;
        }

        eligibleTitles.push(result.title);
        enrichmentMap[id] = result.details;

        if (eligibleTitles.length >= TARGET_COUNT) break;
      }

      setTrending([...eligibleTitles]);
      setEnrichments({ ...enrichmentMap });

      if (eligibleTitles.length > 0) {
        setLoading(false);
      }
    }

    if (!active) return;

    if (eligibleTitles.length === 0) {
      setError(
        "No popular titles with available IMDb ratings were found."
      );
    }

    setTrending(eligibleTitles.slice(0, TARGET_COUNT));
    setEnrichments(enrichmentMap);
    setFeaturedIndex(0);
  } catch (err) {
    if (!active) return;

    setError(
      err instanceof Error ? err.message : "Failed to load popular titles."
    );
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchHomeTitles();

    return () => {
      active = false;
    };
  }, []);



useEffect(() => {
  let active = true;

  const loadMovies = async () => {
    setMoviesLoading(true);

    try {
      if (selectedGenres.length === 0) {
        const movies = await getPopularMovies();

        if (active) {
          setFilteredMovies(movies.slice(0, 50));
        }

        return;
      }

      const pages = await Promise.all([
        discoverMoviesByGenres(selectedGenres, 1),
        discoverMoviesByGenres(selectedGenres, 2),
        discoverMoviesByGenres(selectedGenres, 3),
      ]);

      if (!active) return;

      const uniqueMovies = new Map<number, TMDBTrendingTitle>();

      for (const page of pages) {
        for (const movie of page) {
          if (!uniqueMovies.has(movie.id)) {
            uniqueMovies.set(movie.id, movie);
          }

          if (uniqueMovies.size >= 50) break;
        }

        if (uniqueMovies.size >= 50) break;
      }

      if (active) {
        setFilteredMovies(
          Array.from(uniqueMovies.values()).slice(0, 50)
        );
      }
    } catch (error) {
      console.error("Failed to load movies:", error);

      if (active) {
        setFilteredMovies([]);
      }
    } finally {
      if (active) {
        setMoviesLoading(false);
      }
    }
  };

  void loadMovies();

  return () => {
    active = false;
  };
}, [selectedGenres]);


useEffect(() => {
  let active = true;

  const loadSeries = async () => {
    setSeriesLoading(true);

    try {
      let pages: TMDBTrendingTitle[][];

      if (selectedSeriesGenres.length === 0) {
        pages = await Promise.all([
          getPopularTitles("tv", 1),
          getPopularTitles("tv", 2),
          getPopularTitles("tv", 3),
        ]);
      } else {
        pages = await Promise.all([
          discoverSeriesByGenres(selectedSeriesGenres, 1),
          discoverSeriesByGenres(selectedSeriesGenres, 2),
          discoverSeriesByGenres(selectedSeriesGenres, 3),
        ]);
      }

      if (!active) return;

      const uniqueSeries = new Map<number, TMDBTrendingTitle>();

      for (const page of pages) {
        for (const show of page) {
          if (!uniqueSeries.has(show.id)) {
            uniqueSeries.set(show.id, show);
          }

          if (uniqueSeries.size >= 50) break;
        }

        if (uniqueSeries.size >= 50) break;
      }

      setFilteredSeries(
        Array.from(uniqueSeries.values()).slice(0, 50)
      );
    } catch (error) {
      console.error("Failed to load TV shows:", error);

      if (active) {
        setFilteredSeries([]);
      }
    } finally {
      if (active) {
        setSeriesLoading(false);
      }
    }
  };

  void loadSeries();

  return () => {
    active = false;
  };
}, [selectedSeriesGenres]);


useEffect(() => {
  if (trending.length < 2) return;

  const timeoutId = window.setTimeout(() => {
    setFeaturedIndex((current) => (current + 1) % trending.length);
  }, 7000);

  return () => window.clearTimeout(timeoutId);
}, [featuredIndex, trending.length]);



  const titlesWithProviders = trending.filter((title) => {
  const key = `${title.media_type}-${title.id}`;
  const providers = enrichments[key]?.providers;

  return Array.isArray(providers) && providers.length > 0;
});


const featured =
  titlesWithProviders.length > 0
    ? titlesWithProviders[featuredIndex % titlesWithProviders.length]
    : null;

  const key = featured
    ? `${featured.media_type}-${featured.id}`
    : "";

  const enrichment = key ? enrichments[key] : null;

  const backdropUrl = featured?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
    : null;

  const getTitle = (title: TMDBTrendingTitle) =>
    title.title ?? title.name ?? "Untitled";

  const getYear = (title: TMDBTrendingTitle) =>
    (title.release_date ?? title.first_air_date ?? "").slice(0, 4);


  const visibleTitles =
  titlesWithProviders.length > 0
    ? Array.from(
        { length: Math.min(4, titlesWithProviders.length) },
        (_, index) => {
          const titleIndex =
            (featuredIndex - 1 + index + titlesWithProviders.length) %
            titlesWithProviders.length;

          return {
            title: titlesWithProviders[titleIndex],
            index: titleIndex,
          };
        }
      )
    : [];

    const toggleGenre = (genreId: number) => { setSelectedGenres((current) => current.includes(genreId) ? current.filter((id) => id !== genreId) : [...current, genreId]);};
    const toggleSeriesGenre = (genreId: number) => { setSelectedSeriesGenres((current) => current.includes(genreId) ? current.filter((id) => id !== genreId) : [...current, genreId]);};

  return (
    <main className="min-h-screen overflow-hidden bg-[#EBFAFF] text-slate-950 dark:bg-[#030A1B] dark:text-white">
      <section className="relative min-h-[620px] overflow-hidden bg-[#EBFAFF] transition-colors duration-500 dark:bg-[#030A1B] lg:min-h-[680px]">
        {backdropUrl && (
          <div className="absolute inset-0">
            <div key={backdropUrl} className="absolute inset-0 animate-[backdropFade_1.2s_ease-in-out]" style={{ backgroundImage: `url("${backdropUrl}")`, backgroundSize: "cover", backgroundPosition: "",}}/>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EBFAFF]/95 via-[#EBFAFF]/30 to-[#EBFAFF]/0 dark:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EBFAFF] via-transparent to-transparent dark:hidden" />

        <div className="absolute inset-0 hidden bg-[#030A1B]/15 dark:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#030A1B] via-[#030A1B]/0 to-[#030A1B]/0 dark:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-[#030A1B] via-transparent to-[#030A1B]/20 dark:block" />

        <div className="relative z-10 mx-auto grid min-h-[620px] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-28 sm:px-10 lg:min-h-[680px] lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-10 lg:pb-8 lg:pt-64">
          <div className="max-w-2xl">
            {loading && !featured ? (
              <div className="space-y-5">
                <div className="h-4 w-36 animate-pulse rounded bg-slate-900/10 dark:bg-white/10" />
                <div className="h-16 w-3/4 animate-pulse rounded-xl bg-slate-900/10 dark:bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-900/10 dark:bg-white/10" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-900/10 dark:bg-white/10" />
                <p className="text-sm text-slate-500 dark:text-white/50">
                  Finding popular titles with IMDb ratings...
                </p>
              </div>
            ) : error && !featured ? (
              <>
                <h1 className="text-4xl font-black sm:text-6xl">
                  Unable to load titles
                </h1>

                <p className="mt-5 text-slate-600 dark:text-white/70">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 cursor-pointer"
                >
                  Try again
                </button>
              </>
            ) : featured ? (
              <div key={`${featured.media_type}-${featured.id}`}>
                <span className="text-xs inter-bold uppercase tracking-[0.25em] text-slate-600 dark:text-white/60">
                  {featured.media_type === "tv"
                    ? "Popular TV Show"
                    : "Popular Movie"}
                </span>

                <h1 className="space-grotesk-bold mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-4xl xl:text-5xl">
                  {getTitle(featured)}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-white/75">
                  {enrichment?.imdbRating && (
                    <span className="flex items-center gap-2">
                      <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-xs font-black text-black">
                        IMDb
                      </span>

                      <span className="inter-regular font-bold text-slate-950 dark:text-white">
                        {enrichment.imdbRating}
                      </span>

                      <span className="inter-regular text-slate-400 dark:text-white/40">
                        / 10
                      </span>
                    </span>
                  )}

                  {getYear(featured) && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-white/40" />
                      <span className="inter-regular">{getYear(featured)}</span>
                    </>
                  )}

                  <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-white/40" />

                  <span className="inter-regular">
                    {featured.media_type === "tv" ? "TV Series" : "Movie"}
                  </span>
                </div>
                {enrichment?.providers &&
                  enrichment.providers.length > 0 && (
                    <div className="mt-5">
                      <p className="inter-bold mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/55">
                        Available on
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {enrichment.providers.map((provider) => (
                          <div key={provider.id} title={`${provider.name}${ provider.categories?.length ? ` — ${provider.categories.join(", ")}` : ""}`}
                            className="flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white/75 px-3 py-2 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          >
                            {provider.logoUrl ? (
                              <img src={provider.logoUrl} alt="" loading="lazy" className="h-8 w-8 rounded-lg object-contain"/>
                            ) : (
                              <span className="text-xs inter-bold">
                                {provider.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}

                            <span className="text-xs inter-bold text-slate-700 dark:text-white/80">
                              {provider.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {enrichment.providerAttribution && (
                        <p className="mt-2 text-[10px] text-slate-500 dark:text-white/40">
                          {enrichment.providerAttribution}
                        </p>
                      )}
                    </div>
                  )}

                <p className="inter-regular mt-5 max-w-xl text-sm leading-7 text-slate-700 dark:text-white/70 sm:text-base">
                  {featured.overview ||
                    "Discover more about this movie or TV series."}
                </p>

                <button type="button" onClick={() => navigate(`/details/${featured.media_type}/${featured.id}`)}
                  className="inter-bold mt-7 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-black dark:text-white transition hover:shadow-[0_0_22px_rgba(34,142,229,0.25)] group-hover:translate-x-1.5 hover:border-[#228EE5] hover:-translate-y-0.5 border border-[#228EE5]/70 cursor-pointer"
                >
                  More Info
                  <span aria-hidden="true" className="text-lg">
                    <FaArrowRight />
                  </span>
                </button>

                

                {loading && (
                  <p className="inter-bold mt-4 text-xs text-slate-500 dark:text-white/45">
                    Finding more popular titles...
                  </p>
                )}
              </div>
            ) : (
              <h1 className="inter-bold text-4xl">
                No rated titles available
              </h1>
            )}
          </div>
          <div className="relative left-8 top-16 flex h-[240px] w-full items-center overflow-hidden rounded-3xl lg:translate-x-10 xl:translate-x-16">
            {loading && trending.length === 0 ? (
              <div className="flex shrink-0 items-center gap-0">
                {Array.from({ length: 4 }).map((_, position) => (
              <div key={position} className={`relative shrink-0 overflow-hidden rounded-2xl border animate-pulse ${ position === 1 ? "h-[220px] w-[220px] border-[#228EE5] opacity-100" : "h-[170px] w-[170px] border-[#228EE5]/40 opacity-55"}`}>
                <div className="absolute inset-0 bg-slate-300/70 dark:bg-white/10" />
              </div>
            ))}
          </div>
            ) : (
             visibleTitles.map(({ title }, position) => (
              <div key={`${title.media_type}-${title.id}`} 
                className={`group relative shrink-0 overflow-hidden rounded-2xl border transition-all duration-700 ease-in-out ${ position === 1 ? "h-[220px] w-[220px] border-[#228EE5] opacity-100" : "h-[170px] w-[170px] border-[#228EE5]/70 opacity-55"}`}
              >
                <img src={ title.poster_path ? `https://image.tmdb.org/t/p/w500${title.poster_path}` : ""} alt={title.title ?? title.name ?? "Movie or TV show"} className="h-full w-full object-cover"/>
                  {position === 1 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  )}
              </div>
            )))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[520px] overflow-hidden bg-[#EBFAFF] dark:bg-[#030A1B] lg:min-h-[580px]">
        <div className="relative z-10 mx-auto grid min-h-[220px] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-28 sm:px-10 lg:min-h-[280px]  lg:gap-2 lg:px-10 lg:pb-4 lg:pt-4">
            <div className="flex w-full items-center justify-between gap-6">
            <h2 className="space-grotesk-bold text-[34px] ">
              Trends
            </h2>

            <button type="button" onClick={() => navigate("/all_trendings")} className="inter-bold flex mt-4 shrink-0 items-center gap-2 text-[15px] cursor-pointer text-slate-800 transition-colors duration-200 hover:text-[#228EE5] dark:text-white dark:hover:text-[#228EE5]">
              See More
              <FaArrowRight />
            </button>
            </div>
             <div className="relative">
              <button
              type="button"
              onClick={() => {
                const swiper = trendsSwiperRef.current;
                if (!swiper) return;

                swiper.slideTo(Math.max(swiper.activeIndex - 5, 0));
              }}
              aria-label="Previous titles"
              className="absolute -left-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
            >
              <FaArrowLeft />
            </button>

            <button
              type="button"
              onClick={() => {
                const swiper = trendsSwiperRef.current;
                if (!swiper) return;

                swiper.slideTo(
                  Math.min(swiper.activeIndex + 5, swiper.slides.length - 1)
                );
              }}
              aria-label="Next titles"
              className="absolute -right-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
            >
              <FaArrowRight />
            </button>
             <Swiper
              onSwiper={(swiper) => {
                trendsSwiperRef.current = swiper;
              }}
              slidesPerView={2}
              slidesPerGroup={5}
              spaceBetween={16}
              speed={400}
              watchOverflow
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 16,
                },
              }}
            >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {trending.slice(0, 50).map((title) => (
                <SwiperSlide key={`${title.media_type}-${title.id}`} className="!h-auto !overflow-visible py-4 px-2">
                  <TrendingCard title={title} rating={ enrichments[`${title.media_type}-${title.id}`]?.imdbRating } isFavorite={false} onToggleFavorite={(selectedTitle) => { console.log("Toggle favorite:", selectedTitle.id); }}/>
                </SwiperSlide>
              ))}
            </div>
            </Swiper>
          </div>
        </div>
      </section>

      <section className="relative min-h-[620px] overflow-hidden bg-[#EBFAFF] dark:bg-[#030A1B] lg:min-h-[680px]">
        <div className="relative z-10 mx-auto grid min-h-[220px] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-28 sm:px-10 lg:min-h-[280px] lg:gap-2 lg:px-10 lg:pb-4 lg:pt-4">
            <div className="flex w-full items-center justify-between gap-6">
            <h2 className="space-grotesk-bold text-[34px] ">
              Movies
            </h2>
            <button type="button" onClick={() => navigate("/all_movies")} className="inter-bold flex mt-4 shrink-0 items-center gap-2 text-[15px] cursor-pointer text-slate-800 transition-colors duration-200 hover:text-[#228EE5] dark:text-white dark:hover:text-[#228EE5]">
              See More
              <FaArrowRight />
            </button>
            </div>

            <div className="relative mx-auto mt-8 mb-8 w-full max-w-[1460px]">
               <button type="button" onClick={() => genreSwiperRef.current?.slidePrev()} aria-label="Previous movie genres" className="absolute -left-8 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-900 transition hover:text-[#228EE5] dark:text-white cursor-pointer">
                 <FaChevronLeft className="text-[17px]" />
                </button>
                <button type="button" onClick={() => genreSwiperRef.current?.slideNext()} aria-label="Next movie genres" className="absolute -right-10 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-900 transition hover:text-[#228EE5] dark:text-white cursor-pointer">
                 <FaChevronRight className="text-[17px]" />
                </button>
                <Swiper key="movie-genre-swiper" onSwiper={(swiper) => { genreSwiperRef.current = swiper; }}
                  slidesPerView={9.5}
                  slidesPerGroup={3}
                  spaceBetween={0}
                  speed={350}
                  watchOverflow
                  breakpoints={{ 480: { slidesPerView: 5.5, spaceBetween: 6,}, 640: { slidesPerView: 7.5, spaceBetween: 6, }, 1024: { slidesPerView: 9.5, spaceBetween: 8,},}} className="!w-full !px-1"
                >
                  <SwiperSlide>
                     <button type="button" onClick={() => setSelectedGenres([])} aria-pressed={selectedGenres.length === 0} className={`w-[80%] inter-regular truncate rounded-full border px-2 py-2.5 text-[13px] leading-tight transition duration-200 cursor-pointer ${ selectedGenres.length === 0 ? "border-[#EC4899] bg-[#EC4899] text-white" : "border-[#EC4899]/40 text-slate-700 hover:border-[#EC4899] dark:text-white"}`}>
                        All
                      </button>
                  </SwiperSlide>
                  {movieGenres.map((genre) => {
                     const isSelected = selectedGenres.includes(genre.id);
                     return (
                       <SwiperSlide key={genre.id}>
                         <button type="button" onClick={() => toggleGenre(genre.id)} aria-pressed={isSelected} title={genre.name} className={`w-[80%] inter-regular truncate rounded-full border px-2 py-2.5 text-[13px] leading-tight transition duration-200 cursor-pointer ${ isSelected ? "border-[#EC4899] bg-[#EC4899] text-white" : "border-[#EC4899]/40 text-slate-700 hover:border-[#EC4899] hover:bg-[#EC4899]/10 dark:text-white"}`}>
                           {genre.name}
                          </button>
                        </SwiperSlide>
                      )
                    })}
                </Swiper>
            </div>
            
             <div className="relative">
              <button
              type="button"
              onClick={() => {
                const swiper = moviesSwiperRef.current;
                if (!swiper) return;

                swiper.slideTo(Math.max(swiper.activeIndex - 5, 0));
              }}
              aria-label="Previous titles"
              className="absolute -left-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
            >
              <FaArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => {
                const swiper = moviesSwiperRef.current;
                if (!swiper) return;

                swiper.slideTo(
                  Math.min(swiper.activeIndex + 5, swiper.slides.length - 1)
                );
              }}
              aria-label="Next titles"
              className="absolute -right-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
            >
              <FaArrowRight />
            </button>
             <Swiper
              onSwiper={(swiper) => {
                moviesSwiperRef.current = swiper;
              }}
              slidesPerView={2}
              slidesPerGroup={5}
              spaceBetween={16}
              speed={400}
              watchOverflow
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 16,
                },
              }}
            >
              {filteredMovies.map((title) => (
                <SwiperSlide key={`${title.media_type}-${title.id}`} className="!h-auto !overflow-visible py-4 px-2">
                  <MoviesCard title={title} isFavorite={false} onToggleFavorite={(selectedTitle) => { console.log("Toggle favorite:", selectedTitle.id); }}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

        <div className="mx-auto max-w-[1600px] py-6 pb-12">
          <h2 className="space-grotesk-bold mx-auto mt-12 max-w-[1600px] px-6 text-[34px] sm:px-10 lg:px-10">
            Most Popular Movie
          </h2>
        </div>

      <section className="relative min-h-[520px] overflow-hidden bg-[#EBFAFF] dark:bg-[#030A1B] lg:min-h-[780px]">
        {mostPopularMovie && (
          <div className="relative mx-auto min-h-[520px] w-[80%] overflow-hidden rounded-xl shadow-lg lg:min-h-[780px]">
            {mostPopularMovie.backdrop_path && (
              <img src={`https://image.tmdb.org/t/p/original${mostPopularMovie.backdrop_path}`} alt={mostPopularMovie.title ?? mostPopularMovie.name ?? "Most Popular Movie"} className="absolute inset-0 h-full w-full object-cover"/>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="relative z-10 flex min-h-[420px] flex-col justify-center px-8 py-12 sm:px-12 lg:min-h-[480px] lg:px-16">
              <span className="space-grotesk-bold text-[20px] font-bold text-[#E5E5E5]">
                #1 Most Popular Movie right now
              </span>
              <h2 className="bebas-neue-regular mt-3 text-[60px] font-bold leading-none text-[#E7BC0F] sm:text-[75px] lg:text-[90px]">
                {mostPopularMovie.title ?? mostPopularMovie.name ?? "Most Popular Movie"}
              </h2>
              {popularMovieEnrichment?.imdbRating && (
                <div className="mt-6 flex items-center gap-2 text-white">
                  <span className="rounded bg-yellow-400 px-2 py-1 text-xs font-black text-black">
                    IMDb
                  </span>
                  <span className="font-bold">
                    {popularMovieEnrichment.imdbRating}/10
                  </span>
                </div>
              )}
              <p className="inter-regular mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                {mostPopularMovie.overview || "Discover more about this popular movie."}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="relative min-h-[320px] overflow-hidden bg-[#EBFAFF] dark:bg-[#030A1B] lg:min-h-[580px]">
        <div className="relative z-10 mx-auto grid min-h-[220px] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-28 sm:px-10 lg:min-h-[280px] lg:gap-2 lg:px-10 lg:pb-4 lg:pt-40">
            <div className="flex w-full items-center justify-between gap-6">
            <h2 className="space-grotesk-bold text-[34px] ">
              Tv Shows
            </h2>
            <button type="button" onClick={() => navigate("/all_series")} className="inter-bold flex mt-4 shrink-0 items-center gap-2 text-[15px] cursor-pointer text-slate-800 transition-colors duration-200 hover:text-[#228EE5] dark:text-white dark:hover:text-[#228EE5]">
              See More
              <FaArrowRight />
            </button>
            </div>

            <div className="relative mx-auto mt-8 mb-8 w-full max-w-[1460px]">
               <button type="button" onClick={() => seriesGenreSwiperRef.current?.slidePrev()} aria-label="Previous series genres" className="absolute -left-8 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-900 transition hover:text-[#228EE5] dark:text-white cursor-pointer">
                 <FaChevronLeft className="text-[17px]" />
                </button>
                <button type="button" onClick={() => seriesGenreSwiperRef.current?.slideNext()} aria-label="Next series genres" className="absolute -right-10 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-900 transition hover:text-[#228EE5] dark:text-white cursor-pointer">
                 <FaChevronRight className="text-[17px]" />
                </button>
                <Swiper key="series-genre-swiper" onSwiper={(swiper) => { seriesGenreSwiperRef.current = swiper; }}
                  slidesPerView={9.5}
                  slidesPerGroup={3}
                  spaceBetween={0}
                  speed={350}
                  watchOverflow
                  breakpoints={{ 480: { slidesPerView: 5.5, spaceBetween: 6,}, 640: { slidesPerView: 7.5, spaceBetween: 6, }, 1024: { slidesPerView: 9.5, spaceBetween: 8,},}} className="!w-full !px-1"
                >
                  <SwiperSlide>
                     <button type="button" onClick={() => setSelectedSeriesGenres([])} aria-pressed={selectedSeriesGenres.length === 0} className={`w-[80%] inter-regular truncate rounded-full border px-2 py-2.5 text-[13px] leading-tight transition duration-200 cursor-pointer ${ selectedSeriesGenres.length === 0 ? "border-[#EC4899] bg-[#EC4899] text-white" : "border-[#EC4899]/40 text-slate-700 hover:border-[#EC4899] dark:text-white"}`}>
                        All
                      </button>
                  </SwiperSlide>
                  {seriesGenres.map((genre) => {
                     const isSelected = selectedSeriesGenres.includes(genre.id);
                     return (
                       <SwiperSlide key={genre.id}>
                         <button type="button" onClick={() => toggleSeriesGenre(genre.id)} aria-pressed={isSelected} title={genre.name} className={`w-[80%] inter-regular truncate rounded-full border px-2 py-2.5 text-[13px] leading-tight transition duration-200 cursor-pointer ${ isSelected ? "border-[#EC4899] bg-[#EC4899] text-white" : "border-[#EC4899]/40 text-slate-700 hover:border-[#EC4899] hover:bg-[#EC4899]/10 dark:text-white"}`}>
                           {genre.name}
                          </button>
                        </SwiperSlide>
                      )
                    })}
                </Swiper>
            </div>
            
             <div className="relative">
            <button type="button" onClick={() => { const swiper = seriesSwiperRef.current; if (!swiper) return; swiper.slideTo(Math.max(swiper.activeIndex - 5, 0));}} aria-label="Previous titles"
                    className="absolute -left-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
            >
              <FaArrowLeft />
            </button>
            <button type="button" onClick={() => { const swiper = seriesSwiperRef.current; if (!swiper) return; swiper.slideTo( Math.min(swiper.activeIndex + 5, swiper.slides.length - 1));}} aria-label="Next titles"
                    className="absolute -right-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
            >
              <FaArrowRight />
            </button>
             <Swiper onSwiper={(swiper) => { seriesSwiperRef.current = swiper;}} slidesPerView={2} slidesPerGroup={5} spaceBetween={16} speed={400} watchOverflow
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 16,
                },
              }}
            >
              {filteredSeries.map((title) => (
                <SwiperSlide key={`${title.media_type}-${title.id}`} className="!h-auto !overflow-visible py-4 px-2">
                  <SeriesCard title={title} isFavorite={false} onToggleFavorite={(selectedTitle) => { console.log("Toggle favorite:", selectedTitle.id); }}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] py-6 pb-12">
          <h2 className="space-grotesk-bold mx-auto mt-12 max-w-[1600px] px-6 text-[34px] sm:px-10 lg:px-10">
            Most Popular Tv Show
          </h2>
        </div>

      <section className="relative min-h-[520px] overflow-hidden bg-[#EBFAFF] dark:bg-[#030A1B] lg:min-h-[780px]">
        {mostPopularSeries && (
          <div className="relative mx-auto min-h-[520px] w-[80%] overflow-hidden rounded-xl shadow-lg lg:min-h-[780px]">
            {mostPopularSeries.backdrop_path && (
              <img src={`https://image.tmdb.org/t/p/original${mostPopularSeries.backdrop_path}`} alt={mostPopularSeries.title ?? mostPopularSeries.name ?? "Most Popular Series"} className="absolute inset-0 h-full w-full object-cover"/>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-end px-6 pb-12 pt-[400px] text-center sm:px-12 sm:pb-16 lg:min-h-[480px] lg:px-16 lg:pb-20">
              <div className="flex flex-row items-center justify-between gap-[450px]">
              <span className="space-grotesk-bold text-[20px] font-bold text-[#E5E5E5]">
                #1 Most Popular Series right now
              </span>
              {popularSeriesEnrichment?.imdbRating && (
                <div className="ml-4 flex items-center gap-2 text-white">
                  <span className="rounded bg-yellow-400 px-2 py-1 text-xs font-black text-black">
                    IMDb
                  </span>
                  <span className="font-bold">
                    {popularSeriesEnrichment.imdbRating}/10
                  </span>
                </div>
              )}
              </div>
              <h2 className="bebas-neue-regular mt-3 text-[60px] font-bold leading-none text-[#E7BC0F] sm:text-[75px] lg:text-[90px]">
                {mostPopularSeries.title ?? mostPopularSeries.name ?? "Most Popular Series"}
              </h2>

              <p className="inter-regular mt-3 max-w-[900px] text-sm leading-7 text-white/80 sm:text-base">
                {mostPopularSeries.overview || "Discover more about this popular series."}
              </p>

            </div>
          </div>
        )}
      </section>

      

<section className="relative overflow-hidden bg-[#EBFAFF] py-16 dark:bg-[#030A1B]">
  <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-10">

    <div className="mb-8 flex items-center justify-between">
      <h2 className="space-grotesk-bold text-[34px]">
        Popular Collections
      </h2>
      <button type="button" onClick={() => navigate("/all_collections")} className="inter-bold flex mt-4 shrink-0 items-center gap-2 text-[15px] cursor-pointer text-slate-800 transition-colors duration-200 hover:text-[#228EE5] dark:text-white dark:hover:text-[#228EE5]">
        See More
       <FaArrowRight />
      </button>
    </div>
    

    <div className="relative">
      <button type="button" onClick={() => { const swiper = collectionsSwiperRef.current; if (!swiper) return; swiper.slideTo(Math.max(swiper.activeIndex - 5, 0));}} aria-label="Previous titles"
              className="absolute -left-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
      >
       <FaArrowLeft />
      </button>
      <button type="button" onClick={() => { const swiper = collectionsSwiperRef.current; if (!swiper) return; swiper.slideTo( Math.min(swiper.activeIndex + 5, swiper.slides.length - 1));}} aria-label="Next titles"
              className="absolute -right-14 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
      >
        <FaArrowRight />
      </button>
        <Swiper onSwiper={(swiper) => { collectionsSwiperRef.current = swiper;}} slidesPerView={2} slidesPerGroup={5} spaceBetween={16} speed={400} watchOverflow
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 16,
                },
              }}
            >
    {collectionsLoading ? (
     Array.from({ length: 5 }).map((_, index) => (
      <SwiperSlide key={index} className="!h-auto py-2">
        <div className="aspect-[3/4] animate-pulse rounded-xl bg-slate-300 dark:bg-white/10" />
      </SwiperSlide>
    ))
    ) : collections.length > 0 ? (
      collections.map((collection) => (
        <SwiperSlide key={collection.id} className="!h-auto py-2">
          <CollectionCard collection={collection} />
        </SwiperSlide>
      ))
    ) : (
      <p className="py-12 text-center text-slate-500 dark:text-white/50">
        No collections available.
      </p>
    )}
      </Swiper>
    </div>
  </div>
</section>

<section className="relative overflow-hidden bg-[#EBFAFF] py-16 dark:bg-[#030A1B]">
  <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-10">
    <div className="mb-8 flex items-center justify-between">
      <h2 className="space-grotesk-bold text-[34px]">
        Popular Actors
      </h2>
      <button type="button" onClick={() => navigate("/all_actors")} className="inter-bold flex mt-4 shrink-0 items-center gap-2 text-[15px] cursor-pointer text-slate-800 transition-colors duration-200 hover:text-[#228EE5] dark:text-white dark:hover:text-[#228EE5]">
        See More
       <FaArrowRight />
      </button>
    </div>

    

    </div>
  </section>

    </main>
  );
}