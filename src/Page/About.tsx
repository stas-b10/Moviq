import { FaArrowRightLong } from "react-icons/fa6";
import tmdbLogo from "../assets/tmdb_logo.svg";

export default function About() {
  return (
    <main className="min-h-screen bg-[#EBFAFF] px-5 py-26 text-[#030A1B] dark:bg-[#030A1B] dark:text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="mb-12 text-center">

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About Us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            A place to discover movies and TV shows, share your opinions,
            rate your favorites, and explore what other people are watching.
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5 sm:p-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Our Purpose
          </h2>

          <p className="leading-7 text-slate-600 dark:text-slate-300">
            This website is a community project created for movie and TV
            enthusiasts. Users can discover titles, rate what they watch,
            write reviews, and share their interests with other users.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="mb-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <img
              src={tmdbLogo}
              alt="The Movie Database (TMDB) logo"
              className="h-auto w-44 max-w-full object-contain"
            />

            <div>
              <h2 className="text-2xl font-semibold">
                Movie &amp; TV Data
              </h2>

              <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                Movie and television information and images are provided
                by The Movie Database (TMDB).
              </p>
            </div>
          </div>

          <p className="rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/10 dark:text-slate-200">
            This product uses the TMDB API but is not endorsed or certified
            by TMDB.
          </p>

          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Visit TMDB
            <FaArrowRightLong />
          </a>
        </section>

        <p className="mt-8 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
          This website is an independent project and is not affiliated with
          or sponsored by The Movie Database.
        </p>
      </div>
    </main>
  );
}