import { useEffect, useState } from "react";
import { getTrendingTitles, type TMDBTrendingTitle,} from "../utils/types/tmdb";

export default function Home() {
  

  return (
    <div className="relative h-screen overflow-hidden bg-[#EBFAFF] dark:bg-[#030A1B]">
    <section className="mt-30">
      
      <p className="text-center text-3xl font-bold">
        Welcome to the Home Page
      </p>
      <div className="pt-[220px] flex pl-[150px]">
        <p>s</p>
      </div>
    </section>


    {/* last section */}
    {/* <section className="mt-16 text-center">
    <Link
      to="/about"
      className="text-xl font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      About
    </Link>
  </section> */}
    </div>
  );
}