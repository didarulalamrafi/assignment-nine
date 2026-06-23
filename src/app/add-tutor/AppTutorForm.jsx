"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "@/lib/utils/auth-client";
import { useGlobals } from "@/providers/AppProvider";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";
import {
  BsPerson,
  BsImage,
  BsBook,
  BsClock,
  BsCurrencyDollar,
  BsHash,
  BsCalendar,
  BsBuilding,
  BsGeoAlt,
  BsLaptop,
  BsInfoCircle,
  BsGlobe,
} from "react-icons/bs";
import { authFetch, getToken } from "@/lib/utils/jwt";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Bengali",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Accounting",
  "Islamic Studies",
  "Cardiology & Anatomy",
  "Data Science & AI",
  "Early Childhood Development",
  "Physiotherapy & Kinesiology",
  "Organic Chemistry",
  "Leadership & Mindset",
];

const TEACHING_MODES = ["Online", "Offline", "Both"];

const DAYS_OPTIONS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const LANGUAGES = [
  "English",
  "Bengali",
  "Hindi",
  "Urdu",
  "Arabic",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
];

const TIME_SLOT_PRESETS = [
  "9:00 AM - 12:00 PM",
  "10:00 AM - 1:00 PM",
  "11:00 AM - 2:00 PM",
  "12:00 PM - 3:00 PM",
  "1:00 PM - 4:00 PM",
  "2:00 PM - 5:00 PM",
  "3:00 PM - 6:00 PM",
  "4:00 PM - 7:00 PM",
  "5:00 PM - 8:00 PM",
  "6:00 PM - 9:00 PM",
  "7:00 PM - 10:00 PM",
  "8:00 PM - 11:00 PM",
  "Custom Time",
];

export default function AddTutorForm() {
  const { isDark } = useGlobals();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sessionStartDate, setSessionStartDate] = useState(null);
  const [sessionEndDate, setSessionEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlotMode, setTimeSlotMode] = useState("preset");
  const [customTimeSlot, setCustomTimeSlot] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [experienceValue, setExperienceValue] = useState("");

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleExperienceChange = (e) => {
    let value = e.target.value;
    let numericValue = value.replace(/\s*years?/i, "").trim();

    if (numericValue && !isNaN(numericValue)) {
      setExperienceValue(`${numericValue} years`);
    } else {
      setExperienceValue(value);
    }
  };

  // ========== আপডেটেড handleSubmit ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 টোকেন চেক করুন
    const token = getToken();
    console.log("🔑 Token before submit:", token ? "Present ✅" : "Missing ❌");

    if (!token) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    if (isSubmitting) {
      toast.warning("Please wait, submission is already in progress...");
      return;
    }

    if (!sessionStartDate || !sessionEndDate) {
      toast.error("Please select session dates");
      return;
    }
    if (selectedDays.length === 0) {
      toast.error("Please select at least one available day");
      return;
    }

    let finalTimeSlot = "";
    if (timeSlotMode === "preset") {
      if (!selectedPreset || selectedPreset === "Custom Time") {
        toast.error("Please select a valid time slot preset");
        return;
      }
      finalTimeSlot = selectedPreset;
    } else {
      if (!customTimeSlot.trim()) {
        toast.error("Please enter a valid time slot");
        return;
      }
      if (!customTimeSlot.match(/(AM|PM)/i)) {
        toast.warning("Consider adding AM/PM to your time slot for clarity");
      }
      finalTimeSlot = customTimeSlot;
    }

    setIsSubmitting(true);
    setLoading(true);

    const formData = new FormData(e.target);

    const aboutText =
      formData.get("about")?.trim() ||
      "Experienced tutor dedicated to helping students achieve their academic goals. Passionate about teaching and committed to providing quality education.";

    const tutor = {
      name: formData.get("name"),
      image: formData.get("image"),
      subject: formData.get("subject"),
      language: formData.get("language"),
      availableDays: selectedDays.join(", "),
      availableDaysTime: `${selectedDays.join(", ")} ${finalTimeSlot}`,
      timeSlot: finalTimeSlot,
      hourlyRate: Number(formData.get("hourlyRate")),
      totalSlot: Number(formData.get("totalSlot")),
      sessionStartDate: sessionStartDate.toISOString(),
      sessionEndDate: sessionEndDate.toISOString(),
      institution: formData.get("institution"),
      experience: experienceValue || formData.get("experience"),
      location: formData.get("location"),
      teachingMode: formData.get("teachingMode"),
      about: aboutText,
      email: session?.user?.email,
      addedBy: session?.user?.email,
      review: 0,
    };

    console.log("📤 Sending tutor data:", tutor);

    try {
      // 🔴 ম্যানুয়ালি Authorization header যোগ করা হয়েছে
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tutors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tutor),
        credentials: "include",
      });

      console.log("📊 Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.message || "Failed to add tutor");
      }

      const result = await res.json();
      console.log("✅ Tutor added successfully:", result);

      toast.success("Tutor added successfully!");

      // ফর্ম রিসেট করুন
      e.target.reset();
      setSessionStartDate(null);
      setSessionEndDate(null);
      setSelectedDays([]);
      setSelectedPreset("");
      setCustomTimeSlot("");
      setTimeSlotMode("preset");
      setExperienceValue("");

      // My Tutors পেজে রিডাইরেক্ট করুন
      router.push("/my-tutors");
      router.refresh();
    } catch (error) {
      console.error("❌ Submit error:", error);
      toast.error(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm border outline-none transition ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500"
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div
        className={`rounded-2xl border shadow-sm p-8 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
      >
        <div className="mb-8">
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Add a Tutor
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Fill in the details to create a new tutor profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Full Name *</label>
            <div className="relative">
              <BsPerson
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={15}
              />
              <input
                type="text"
                name="name"
                required
                disabled={isSubmitting}
                placeholder="e.g., John Doe"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Profile Photo URL *</label>
            <div className="relative">
              <BsImage
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={15}
              />
              <input
                type="url"
                name="image"
                required
                disabled={isSubmitting}
                placeholder="https://example.com/photo.jpg"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Subject / Category *</label>
            <div className="relative">
              <BsBook
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={15}
              />
              <select
                name="subject"
                required
                disabled={isSubmitting}
                className={`${inputClass} pl-9 cursor-pointer`}
              >
                <option value="">-- Select a subject --</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Teaching Language *</label>
            <div className="relative">
              <BsGlobe
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={15}
              />
              <select
                name="language"
                required
                disabled={isSubmitting}
                className={`${inputClass} pl-9 cursor-pointer`}
              >
                <option value="">-- Select language --</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Available Days *</label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OPTIONS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => !isSubmitting && toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    selectedDays.includes(day)
                      ? "bg-sky-600 text-white border-sky-600"
                      : isDark
                        ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-sky-500"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-sky-400"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p
              className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Select all days the tutor is available
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Time Slot *</label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {timeSlotMode === "preset" ? "Preset" : "Custom"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    !isSubmitting &&
                    setTimeSlotMode(
                      timeSlotMode === "preset" ? "custom" : "preset",
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    timeSlotMode === "preset" ? "bg-sky-600" : "bg-gray-400"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      timeSlotMode === "preset"
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {timeSlotMode === "preset" ? (
              <div className="relative">
                <BsClock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  required={timeSlotMode === "preset"}
                  disabled={isSubmitting}
                  className={`${inputClass} pl-9 cursor-pointer`}
                >
                  <option value="">-- Choose a time slot --</option>
                  {TIME_SLOT_PRESETS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="relative">
                <BsClock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <input
                  type="text"
                  value={customTimeSlot}
                  onChange={(e) => setCustomTimeSlot(e.target.value)}
                  required={timeSlotMode === "custom"}
                  disabled={isSubmitting}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  className={`${inputClass} pl-9`}
                />
              </div>
            )}
            <p
              className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {timeSlotMode === "preset"
                ? "Choose from common time slots for daily availability"
                : "Enter custom time with AM/PM format (e.g., 9:00 AM - 5:00 PM)"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Hourly Rate (USD) *</label>
              <div className="relative">
                <BsCurrencyDollar
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <input
                  type="number"
                  name="hourlyRate"
                  required
                  min="1"
                  step="0.5"
                  disabled={isSubmitting}
                  placeholder="e.g., 50"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Total Slots Available *</label>
              <div className="relative">
                <BsHash
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <input
                  type="number"
                  name="totalSlot"
                  required
                  min="1"
                  disabled={isSubmitting}
                  placeholder="e.g., 10"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Session Start Date *</label>
              <div className="relative">
                <BsCalendar
                  className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <DatePicker
                  selected={sessionStartDate}
                  onChange={(date) =>
                    !isSubmitting && setSessionStartDate(date)
                  }
                  selectsStart
                  startDate={sessionStartDate}
                  endDate={sessionEndDate}
                  placeholderText="Select start date"
                  disabled={isSubmitting}
                  dateFormat="MMMM d, yyyy"
                  className={`${inputClass} pl-9 cursor-pointer`}
                  wrapperClassName="w-full"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Session End Date *</label>
              <div className="relative">
                <BsCalendar
                  className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <DatePicker
                  selected={sessionEndDate}
                  onChange={(date) => !isSubmitting && setSessionEndDate(date)}
                  selectsEnd
                  startDate={sessionStartDate}
                  endDate={sessionEndDate}
                  minDate={sessionStartDate}
                  placeholderText="Select end date"
                  disabled={isSubmitting}
                  dateFormat="MMMM d, yyyy"
                  className={`${inputClass} pl-9 cursor-pointer`}
                  wrapperClassName="w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Institution / University *</label>
              <div className="relative">
                <BsBuilding
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <input
                  type="text"
                  name="institution"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., Bangladesh University of Engineering & Technology"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Teaching Experience *</label>
              <div className="relative">
                <BsPerson
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  size={15}
                />
                <input
                  type="text"
                  name="experience"
                  value={experienceValue}
                  onChange={handleExperienceChange}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., 5"
                  className={`${inputClass} pl-9`}
                />
              </div>
              <p
                className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Enter number only - &quot;years&quot; will be added
                automatically
              </p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Location *</label>
            <div className="relative">
              <BsGeoAlt
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={15}
              />
              <input
                type="text"
                name="location"
                required
                disabled={isSubmitting}
                placeholder="e.g., Dhanmondi, Dhaka, Bangladesh"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Teaching Mode *</label>
            <div className="relative">
              <BsLaptop
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={15}
              />
              <select
                name="teachingMode"
                required
                disabled={isSubmitting}
                className={`${inputClass} pl-9 cursor-pointer`}
              >
                <option value="">-- Select teaching mode --</option>
                {TEACHING_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>About the Tutor (Optional)</label>
            <div className="relative">
              <BsInfoCircle
                className={`absolute left-3 top-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={15}
              />
              <textarea
                name="about"
                rows="4"
                disabled={isSubmitting}
                placeholder="Describe the tutor's teaching philosophy, areas of expertise, notable achievements, and approach to student success..."
                className={`${inputClass} pl-9 resize-none`}
              />
            </div>
            <p
              className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Leave empty to use a default description
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition shadow mt-2 relative flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" color="white" />
                <span>Adding Tutor...</span>
              </>
            ) : (
              "Add Tutor"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
