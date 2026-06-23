"use client";
import { useState, useEffect } from "react"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGlobals } from "@/providers/AppProvider";
import { useSession } from "@/lib/utils/auth-client";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";
import {
  BsStar,
  BsGlobe,
  BsBook,
  BsCalendar,
  BsClock,
  BsCurrencyDollar,
  BsX,
  BsPerson,
  BsTelephone,
  BsGeoAlt,
  BsBriefcase,
  BsLaptop,
  BsInfoCircle,
  BsCalendarWeek,
  BsClockHistory,
  BsBuilding,
  BsArrowLeft,
} from "react-icons/bs";
import { authFetch } from "@/lib/utils/jwt";

export default function TutorDetails({ tutor }) {
  const { isDark } = useGlobals();
  const { data: session } = useSession();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myBookedSessionsList, setMyBookedSessionsList] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(true);


  useEffect(() => {

    const fetchMyBookings = async () => {
      if (!session?.user?.email) {
        setFetchingBookings(false);
        return;
      }

      try {

        const response = await authFetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings?studentEmail=${session.user.email}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setMyBookedSessionsList(data);
      }  finally {
        setFetchingBookings(false);
      }
    };

    fetchMyBookings();
  }, [session?.user?.email]);

  const today = new Date();
  const sessionStart = new Date(tutor.sessionStartDate);
  const sessionEnd = new Date(tutor.sessionEndDate);

  const isNoSlot = tutor.totalSlot === 0;
  const isTooEarly = today < sessionStart;
  const isExpired = today > sessionEnd;

  const hasAlreadyBookedThis = myBookedSessionsList.some(
    (b) => b.tutorId === tutor._id && b.status !== "cancelled",
  );

  const isBlocked = isNoSlot || isTooEarly || isExpired || hasAlreadyBookedThis;

  const getBlockMessage = () => {
    if (hasAlreadyBookedThis) return "You have already joined this session.";
    if (isNoSlot)
      return "This session is fully booked. You can't join at the moment.";
    if (isTooEarly)
      return `Booking is not available yet. Opens on ${sessionStart.toDateString()}.`;
    if (isExpired) return "This session has already ended.";
    return null;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const bookingData = {
      tutorId: tutor._id,
      tutorName: tutor.name,
      studentName: formData.get("studentName"),
      studentPhone: formData.get("phone"),
      studentEmail: session?.user?.email,
      status: "pending",
    };

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      toast.success("Session booked successfully!");
      setModalOpen(false);

      const refreshResponse = await authFetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings?studentEmail=${session.user.email}`,
        {
          credentials: "include",
        },
      );
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setMyBookedSessionsList(refreshedData);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 py-12`}>
      <button
        onClick={() => router.back()}
        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        <BsArrowLeft
          size={18}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        <span className="text-sm font-medium">Back to Tutors</span>
      </button>

      {fetchingBookings ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div
          className={`rounded-3xl border shadow-lg overflow-hidden transition-all duration-300 ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div
            className={`relative px-8 pt-8 pb-6 ${
              isDark
                ? "bg-linear-to-br from-gray-800 to-gray-900"
                : "bg-linear-to-br from-sky-50 to-white"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-sky-400 to-blue-500 opacity-75 blur-md -z-10"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={tutor.image}
                    alt={tutor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tutor.name}
                </h1>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {tutor.email}
                </p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
                      isDark
                        ? "bg-sky-900/40 text-sky-300"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    <BsBook size={12} /> {tutor.subject}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
                      isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <BsGlobe size={12} /> {tutor.language}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
                      isDark
                        ? "bg-amber-900/40 text-amber-300"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    <BsStar size={12} /> {tutor.review}
                  </span>
                </div>
              </div>

              <div
                className={`flex flex-col items-center justify-center px-6 py-3 rounded-2xl ${
                  isDark ? "bg-gray-800/80" : "bg-white shadow-sm"
                }`}
              >
                <span
                  className={`text-4xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  ${tutor.hourlyRate}
                </span>
                <span
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}
                >
                  per hour
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
            {[
              {
                icon: <BsCalendarWeek size={18} />,
                label: "Session Start",
                value: new Date(tutor.sessionStartDate).toDateString(),
                color: "text-emerald-500",
              },
              {
                icon: <BsCalendarWeek size={18} />,
                label: "Session End",
                value: new Date(tutor.sessionEndDate).toDateString(),
                color: "text-rose-500",
              },
              {
                icon: <BsClockHistory size={18} />,
                label: "Available Days & Time",
                value: tutor.availableDaysTime || "Sun - Thu 5:00 PM - 8:00 PM",
                color: "text-sky-500",
              },
              {
                icon: <BsClock size={18} />,
                label: "Total Slots Left",
                value: `${tutor.totalSlot} slots remaining`,
                color: "text-amber-500",
              },
              {
                icon: <BsBriefcase size={18} />,
                label: "Experience",
                value: tutor.experience || "2+ years",
                color: "text-indigo-500",
              },
              {
                icon: <BsGeoAlt size={18} />,
                label: "Location",
                value: tutor.location || "Dhaka, Bangladesh",
                color: "text-teal-500",
              },
              {
                icon: <BsLaptop size={18} />,
                label: "Teaching Mode",
                value: tutor.teachingMode || "Online",
                color: "text-purple-500",
              },
              {
                icon: <BsBuilding size={18} />,
                label: "Institution",
                value: tutor.institution || "Independent University",
                color: "text-orange-500",
              },
            ].map(({ icon, label, value, color }) => (
              <div
                key={label}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                  isDark
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className={`${color} ${isDark ? "opacity-80" : ""}`}>
                  {icon}
                </div>
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-wide mb-0.5 ${
                      isDark ? "text-gray-400" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={`px-8 pb-6`}>
            <div className="flex items-center gap-2 mb-3">
              <BsInfoCircle
                className={`${isDark ? "text-sky-400" : "text-sky-600"}`}
              />
              <h2
                className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                About {tutor.name}
              </h2>
            </div>
            <div
              className={`p-5 rounded-2xl ${
                isDark ? "bg-gray-800/30" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {tutor.description ||
                  "Experienced tutor dedicated to helping students achieve their academic goals. Passionate about teaching and committed to providing quality education."}
              </p>
            </div>
          </div>

          <div className="px-8 pb-8 pt-2">
            {isBlocked ? (
              <div
                className={`w-full px-4 py-4 rounded-xl text-sm font-medium text-center backdrop-blur-sm ${
                  isDark
                    ? "bg-red-900/20 text-red-300 border border-red-800"
                    : "bg-red-50 text-red-500 border border-red-200"
                }`}
              >
                {getBlockMessage()}
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-4 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Book a Session Now
              </button>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div
              className={`relative px-6 py-4 ${
                isDark
                  ? "bg-gray-800"
                  : "bg-linear-to-r from-sky-500 to-blue-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Confirm Your Booking
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition text-white"
                >
                  <BsX size={22} />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">
                Complete the form to secure your spot
              </p>
            </div>

            <form onSubmit={handleBook} className="p-6 space-y-5">
              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Full Name
                </label>
                <div className="relative group">
                  <BsPerson
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    } group-focus-within:text-sky-500`}
                    size={16}
                  />
                  <input
                    type="text"
                    name="studentName"
                    required
                    defaultValue={session?.user?.name || ""}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-sky-500/20
                      ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500"
                      }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Phone Number
                </label>
                <div className="relative group">
                  <BsTelephone
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    } group-focus-within:text-sky-500`}
                    size={16}
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Your contact number"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-sky-500/20
                      ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500"
                      }`}
                  />
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  isDark ? "bg-gray-800/50" : "bg-sky-50"
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-sky-600 mb-2">
                  Booking Summary
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    >
                      Tutor:
                    </span>
                    <span
                      className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
                    >
                      {tutor.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    >
                      Subject:
                    </span>
                    <span
                      className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
                    >
                      {tutor.subject}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    >
                      Rate:
                    </span>
                    <span
                      className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
                    >
                      ${tutor.hourlyRate}/hour
                    </span>
                  </div>
                </div>
              </div>

              <input type="hidden" name="tutorId" value={tutor._id} />
              <input
                type="hidden"
                name="studentEmail"
                value={session?.user?.email || ""}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-60 text-white font-semibold transition-all duration-200 mt-2 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
