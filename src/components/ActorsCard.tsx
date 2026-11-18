import { useEffect, useRef, useState } from "react";
import {
  getPopularActors,
  getPopularDirectors,
  type TMDBPerson,
} from "../utils/types/actors";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function ActorsCard() {

const [peopleType, setPeopleType] = useState<"actors" | "directors">("actors");
const [people, setPeople] = useState<TMDBPerson[]>([]);
const [peopleLoading, setPeopleLoading] = useState(true);
const popularPeopleSwiperRef = useRef<SwiperType | null>(null);
const navigate = useNavigate();

useEffect(() => {
  let active = true;

  const loadPeople = async () => {
    setPeopleLoading(true);
    setPeople([]);

    try {
      const results =
        peopleType === "actors"
          ? await getPopularActors()
          : await getPopularDirectors();

      if (active) {
        setPeople(results);
      }
    } catch (error) {
      console.error("Failed to load popular people:", error);
    } finally {
      if (active) {
        setPeopleLoading(false);
      }
    }
  };

  void loadPeople();

  return () => {
    active = false;
  };
}, [peopleType]);


return (
<section className="relative bg-[#EBFAFF] py-4 dark:bg-[#030A1B]">
  <div className="mx-auto max-w-[1800px] ">
    <div className="mb-7 flex items-center justify-between gap-4">
      <div className="flex items-center rounded-full border border-[#228EE5]/50 p-[2px]">
        <button
          type="button"
          onClick={() => setPeopleType("directors")}
          className={`rounded-full px-4 py-1.5 text-xs transition-all duration-300 cursor-pointer ${
            peopleType === "directors"
              ? "bg-[#228EE5] text-white"
              : "text-slate-500 dark:text-white/50 hover:text-[#228EE5]"
          }`}
        >
          Directors
        </button>

        <button
          type="button"
          onClick={() => setPeopleType("actors")}
          className={`rounded-full px-4 py-1.5 text-xs transition-all duration-300 cursor-pointer ${
            peopleType === "actors"
              ? "bg-[#228EE5] text-white"
              : "text-slate-500 dark:text-white/50 hover:text-[#228EE5]"
          }`}
        >
          Actors
        </button>

      </div>
       <button type="button" onClick={() => navigate(peopleType === "actors" ? "/all_actors" : "/all_directors")} className="inter-bold flex mt-4 shrink-0 items-center gap-2 text-[15px] cursor-pointer text-slate-800 transition-colors duration-200 hover:text-[#228EE5] dark:text-white dark:hover:text-[#228EE5]">
        See all {peopleType === "actors" ? "Actors" : "Directors"}
       <FaArrowRight />
      </button>
    </div>

   <div className="relative">
    <button type="button" onClick={() => { const swiper = popularPeopleSwiperRef.current; if (!swiper) return; swiper.slideTo(Math.max(swiper.activeIndex - 5, 0));}} aria-label="Previous titles"
                  className="absolute -left-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
    >
        <FaArrowLeft />
    </button>
    <button type="button" onClick={() => { const swiper = popularPeopleSwiperRef.current; if (!swiper) return; swiper.slideTo( Math.min(swiper.activeIndex + 5, swiper.slides.length - 1));}} aria-label="Next titles"
            className="absolute -right-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl text-slate-900 transition hover:text-[#228EE5] dark:text-white border border-gray-600 hover:border-[#228EE5]/70 backdrop-blur-md transition duration-200 cursor-pointer"
    >
    <FaArrowRight />
    </button>

     <Swiper onSwiper={(swiper) => { popularPeopleSwiperRef.current = swiper;}} slidesPerView={2} slidesPerGroup={5} spaceBetween={0} speed={400} watchOverflow
        breakpoints={{ 640: { slidesPerView: 3, spaceBetween: 16,}, 768: { slidesPerView: 4, spaceBetween: 20,}, 1024: { slidesPerView: 9, spaceBetween: 6, },}}
    >
      {peopleLoading ? (
        Array.from({ length: 9 }).map((_, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="h-[90px] w-[90px] animate-pulse rounded-full bg-slate-300 dark:bg-white/10 sm:h-[105px] sm:w-[105px]" />
              <div className="h-3 w-16 animate-pulse rounded bg-slate-300 dark:bg-white/10" />
            </div>
          </SwiperSlide>
        ))
      ) : people.length > 0 ? (
        people.slice(0,30).map((person) => (
          <SwiperSlide key={person.id}>
            <div className="group flex cursor-default flex-col items-center gap-3 py-2">

              <div className="h-[90px] w-[90px] overflow-hidden rounded-full border-2 border-transparent transition-all duration-300 group-hover:scale-105 group-hover:border-[#228EE5] sm:h-[105px] sm:w-[105px]">

                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

              </div>

              <p className="inter-bold w-full truncate text-center text-sm text-slate-800 transition-colors duration-200 group-hover:text-[#228EE5] dark:text-white">
                {person.name}
              </p>

            </div>
          </SwiperSlide>
        ))
      ) : (
    <SwiperSlide>
        <div className="flex min-h-[140px] items-center justify-center text-center text-sm text-slate-500 dark:text-white/50">
            No {peopleType} available.
        </div>
    </SwiperSlide>
      )}
    </Swiper>
    </div>
  </div>
</section>
);
}