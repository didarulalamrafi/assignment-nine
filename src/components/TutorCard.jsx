import Link from "next/link";
import Image from "next/image";
import {
  BsStarFill,
  BsGlobe,
  BsBook,
  BsArrowRight,
  BsClock,
  BsCalendar,
  BsGeoAlt,
} from "react-icons/bs";

export default function TutorCard({ tutor }) {
  return (
    <div className="group relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="absolute inset-0 bg-linear-to-br from-sky-500/0 via-transparent to-sky-500/0 group-hover:from-sky-500/5 group-hover:to-sky-500/5 transition-all duration-500 pointer-events-none z-0" />

      <div className="relative h-52 w-full overflow-hidden bg-linear-to-br from-sky-100 to-blue-100 dark:from-gray-800 dark:to-gray-800 shrink-0">
        <Image
          src={tutor.image}
          alt={`${tutor.name} profile`}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        {/* {tutor.totalSlot > 0 ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-lg z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Available
          </div>
        ) : (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-rose-500/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-lg z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            Booked
          </div>
        )} */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-lg z-10">
          <BsStarFill size={11} className="text-white" />{" "}
          {tutor.review || "5.0"}
        </div>
      </div>

      <div className="p-5 flex flex-col grow relative z-10">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
              {tutor.name}
            </h3>
          </div>

          {tutor.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <BsGeoAlt size={10} />
              <span className="line-clamp-1">{tutor.location}</span>
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {tutor.description ||
              "Experienced tutor dedicated to helping students achieve their academic goals."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-900/40 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800/50">
            <BsBook size={12} /> {tutor.subject}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
            <BsGlobe size={12} /> {tutor.language || "English"}
          </span>
          {tutor.teachingMode && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
              <BsGlobe size={12} /> {tutor.teachingMode}
            </span>
          )}
        </div>

        {(tutor.availableDays || tutor.timeSlot) && (
          <div className="grid grid-cols-2 gap-2 text-xs mt-3">
            {tutor.availableDays && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <BsCalendar size={11} />
                <span className="line-clamp-1">{tutor.availableDays}</span>
              </div>
            )}
            {tutor.timeSlot && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <BsClock size={11} />
                <span className="line-clamp-1">{tutor.timeSlot}</span>
              </div>
            )}
          </div>
        )}

        <div className="grow" />

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
              Starting at
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${tutor.hourlyRate}
              </span>
              <span className="text-sm font-normal text-gray-400">/hour</span>
            </div>
            {tutor.totalSlot && (
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {tutor.totalSlot} slots left
              </span>
            )}
          </div>

          <Link
            href={`/tutors/${tutor._id}`}
            className="group/btn relative inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden shrink-0"
          >
            <span className="relative z-10">Book Session Now</span>
            <BsArrowRight
              size={14}
              className="relative z-10 transition-transform duration-200 group-hover/btn:translate-x-1"
            />
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-20 h-20 bg-linear-to-tl from-sky-500/10 to-transparent rounded-tl-3xl pointer-events-none" />
    </div>
  );
}
