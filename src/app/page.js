import {
  BsPeople,
  BsBook,
  BsGlobe,
  BsStar,
  BsArrowRight,
  BsCheckCircle,
  BsCalendar,
  BsPersonCheck,
} from "react-icons/bs";
import Link from "next/link";
import TutorCard from "@/components/TutorCard";
import BannerCarousel from "@/components/BannerCarousel";

async function getTutors() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tutors`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const tutors = await getTutors();

  return (
    <div className="space-y-20">
      <BannerCarousel />

      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: <BsPeople size={24} />,
              value: "500+",
              label: "Expert Tutors",
            },
            { icon: <BsBook size={24} />, value: "100+", label: "Subjects" },
            { icon: <BsGlobe size={24} />, value: "20+", label: "Languages" },
            { icon: <BsStar size={24} />, value: "4.8", label: "Avg Rating" },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-center"
            >
              <div className="text-sky-600 dark:text-sky-400 mb-3">{icon}</div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Meet Our Tutors
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Browse our hand-picked tutors across a wide range of subjects and
            languages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.slice(0, 6).map((tutor) => (
            <TutorCard key={tutor._id} tutor={tutor} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow transition"
          >
            View All Tutors <BsArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-sky-50 dark:bg-gray-900/50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Start learning in just 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <BsPersonCheck size={28} />,
                title: "Create Account",
                desc: "Sign up for free and complete your profile in minutes.",
              },
              {
                step: "02",
                icon: <BsPeople size={28} />,
                title: "Find a Tutor",
                desc: "Browse tutors by subject, language, or session availability.",
              },
              {
                step: "03",
                icon: <BsCalendar size={28} />,
                title: "Book a Session",
                desc: "Pick a slot that fits your schedule and start learning right away.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div
                key={step}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <span className="absolute -top-4 left-6 text-5xl font-black text-sky-100 dark:text-sky-900/50 select-none">
                  {step}
                </span>
                <div className="w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 z-10">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="relative rounded-3xl bg-sky-600 dark:bg-sky-700 p-10 text-center overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <BsCheckCircle size={40} className="text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Ready to Start Learning?
            </h2>
            <p className="text-sky-100 mb-8 max-w-lg mx-auto">
              Join thousands of students already booking sessions with expert
              tutors on MediQueue.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition shadow-lg"
            >
              Join for Free <BsArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
