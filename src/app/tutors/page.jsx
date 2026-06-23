import TutorCard from "@/components/TutorCard";
import TutorSearchFilter from "@/components/TutorSearchFilter";

export const metadata = {
  title: "All Tutors | MediQueue",
  description: "Browse all available tutors on MediQueue",
};

async function getTutors(searchParams = {}) {
  let url;

  if (searchParams.search || searchParams.startDate || searchParams.endDate) {
    const params = new URLSearchParams();
    if (searchParams.search) params.append("search", searchParams.search);
    if (searchParams.startDate)
      params.append("startDate", searchParams.startDate);
    if (searchParams.endDate) params.append("endDate", searchParams.endDate);

    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/tutors/search?${params.toString()}`;
  } else {
  
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/tutors`;
  }

  console.log("Fetching tutors from:", url);

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    console.log("Tutors fetched:", data.length);
    return data;
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return [];
  }
}

export default async function TutorsPage({ searchParams }) {
  const params = await searchParams;

  console.log("Received searchParams:", params);

  const tutors = await getTutors(params);

  return (
    <div className="relative min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3.5 py-1.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            50+ Verified Tutors Online
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Find Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-indigo-600">
              Tutor
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Browse, compare, and book personalized learning sessions with expert
            educators worldwide.
          </p>
        </div>

        <TutorSearchFilter
          defaultSearch={params?.search || ""}
          defaultStartDate={params?.startDate || ""}
          defaultEndDate={params?.endDate || ""}
        />

        {tutors.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Found {tutors.length} tutor{tutors.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              No tutors found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {params?.search || params?.startDate || params?.endDate
                ? "Try adjusting your search criteria"
                : "Check back soon for new tutors"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
