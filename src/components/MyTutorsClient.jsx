"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "@/lib/utils/auth-client";
import { useGlobals } from "@/providers/AppProvider";
import { toast } from "react-toastify";
import {
  BsPencil,
  BsTrash,
  BsX,
  BsExclamationTriangle,
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
} from "react-icons/bs";
import { authFetch } from "@/lib/utils/jwt";

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

export default function MyTutorsClient() {
  const { isDark } = useGlobals();
  const { data: session } = useSession();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [updateModal, setUpdateModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [sessionStartDate, setSessionStartDate] = useState(null);
  const [sessionEndDate, setSessionEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ========== আপডেটেড fetchMyTutors ==========
  useEffect(() => {
    if (!session?.user?.email) {
      console.log("🔴 No session email found");
      setLoading(false);
      return;
    }

    const fetchMyTutors = async () => {
      setLoading(true);
      setError(null);

      try {
        const email = session.user.email;
        console.log("🔍 Fetching tutors for email:", email);

        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/my-tutors?email=${encodeURIComponent(email)}`;
        console.log("📡 API URL:", url);

        const res = await authFetch(url, {
          credentials: "include",
        });

        console.log("📊 Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ API Error Response:", errorText);
          throw new Error(
            `HTTP ${res.status}: ${errorText || "Unknown error"}`,
          );
        }

        const data = await res.json();
        console.log("✅ Received tutors:", data);

        // চেক করুন ডাটা অ্যারে কিনা
        if (Array.isArray(data)) {
          setTutors(data);
        } else {
          console.warn("⚠️ Data is not an array:", data);
          setTutors([]);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
        setError(error.message);
        setTutors([]);
        toast.error("Failed to load your tutors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTutors();
  }, [session?.user?.email]);

  const openUpdateModal = (tutor) => {
    setSelectedTutor(tutor);
    setSessionStartDate(
      tutor.sessionStartDate ? new Date(tutor.sessionStartDate) : null,
    );
    setSessionEndDate(
      tutor.sessionEndDate ? new Date(tutor.sessionEndDate) : null,
    );
    setSelectedDays(tutor.availableDays ? tutor.availableDays.split(", ") : []);
    setUpdateModal(true);
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!sessionStartDate || !sessionEndDate) {
      toast.error("Please select session dates");
      return;
    }

    setUpdateLoading(true);
    const formData = new FormData(e.target);
    const updatedTutor = {
      name: formData.get("name"),
      image: formData.get("image"),
      subject: formData.get("subject"),
      availableDays: selectedDays.join(", "),
      timeSlot: formData.get("timeSlot"),
      hourlyRate: Number(formData.get("hourlyRate")),
      totalSlot: Number(formData.get("totalSlot")),
      sessionStartDate: sessionStartDate.toISOString(),
      sessionEndDate: sessionEndDate.toISOString(),
      institution: formData.get("institution"),
      experience: formData.get("experience"),
      location: formData.get("location"),
      teachingMode: formData.get("teachingMode"),
    };

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/tutors/${selectedTutor._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTutor),
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Update failed");

      setTutors((prev) =>
        prev.map((t) =>
          t._id === selectedTutor._id ? { ...t, ...updatedTutor } : t,
        ),
      );
      toast.success("Tutor updated successfully!");
      setUpdateModal(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update tutor");
    } finally {
      setUpdateLoading(false);
    }
  };

  const openDeleteModal = (tutor) => {
    setDeleteTarget(tutor);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/tutors/${deleteTarget._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Delete failed");

      setTutors((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      toast.success("Tutor deleted successfully!");
      setDeleteModal(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete tutor");
    } finally {
      setDeleteLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm border outline-none transition ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500"
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div
          className={`rounded-2xl border p-12 text-center ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h2
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Error Loading Tutors
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          My Tutors
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          Manage your created tutor profiles
        </p>
      </div>

      {tutors.length === 0 ? (
        <div
          className={`rounded-2xl border p-16 text-center ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div className="text-5xl mb-4">📭</div>
          <h2
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            No tutors yet
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            You haven&apos;t added any tutors. Go ahead and create one!
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-sm ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <th className="px-4 py-3 text-left">Tutor</th>
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-4 py-3 text-left">Mode</th>
                  <th className="px-4 py-3 text-left">Rate</th>
                  <th className="px-4 py-3 text-left">Slots</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-gray-800" : "divide-gray-100"
                }`}
              >
                {tutors.map((tutor) => (
                  <tr
                    key={tutor._id}
                    className={`transition ${
                      isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gray-200">
                          {tutor.image && (
                            <Image
                              src={tutor.image}
                              alt={tutor.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {tutor.name}
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {tutor.institution}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          isDark
                            ? "bg-sky-900/30 text-sky-400"
                            : "bg-sky-50 text-sky-600"
                        }`}
                      >
                        {tutor.subject}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {tutor.teachingMode}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${tutor.hourlyRate}/hr
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          tutor.totalSlot === 0
                            ? "bg-red-50 text-red-500"
                            : isDark
                              ? "bg-green-900/20 text-green-400"
                              : "bg-green-50 text-green-600"
                        }`}
                      >
                        {tutor.totalSlot === 0
                          ? "Full"
                          : `${tutor.totalSlot} left`}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {tutor.location}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openUpdateModal(tutor)}
                          className={`p-2 rounded-lg transition ${
                            isDark
                              ? "hover:bg-gray-700 text-sky-400"
                              : "hover:bg-sky-50 text-sky-600"
                          }`}
                          title="Edit"
                        >
                          <BsPencil size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(tutor)}
                          className={`p-2 rounded-lg transition ${
                            isDark
                              ? "hover:bg-red-900/20 text-red-400"
                              : "hover:bg-red-50 text-red-500"
                          }`}
                          title="Delete"
                        >
                          <BsTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateModal && selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 ${
              isDark
                ? "bg-gray-900 border border-gray-800"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Update Tutor
              </h2>
              <button
                onClick={() => setUpdateModal(false)}
                className={`p-1.5 rounded-lg transition ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <BsX size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className={labelClass}>Tutor Name</label>
                <div className="relative">
                  <BsPerson
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={15}
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedTutor?.name || ""}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Photo URL</label>
                <div className="relative">
                  <BsImage
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={15}
                  />
                  <input
                    type="url"
                    name="image"
                    required
                    defaultValue={selectedTutor?.image || ""}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Subject / Category</label>
                <div className="relative">
                  <BsBook
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={15}
                  />
                  <select
                    name="subject"
                    required
                    defaultValue={selectedTutor?.subject || ""}
                    className={`${inputClass} pl-9 cursor-pointer`}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OPTIONS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                        selectedDays.includes(day)
                          ? "bg-sky-600 text-white border-sky-600"
                          : isDark
                            ? "bg-gray-800 border-gray-700 text-gray-300"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Time Slot</label>
                <div className="relative">
                  <BsClock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={15}
                  />
                  <input
                    type="text"
                    name="timeSlot"
                    required
                    defaultValue={selectedTutor?.timeSlot || ""}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hourly Fee ($)</label>
                  <div className="relative">
                    <BsCurrencyDollar
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={15}
                    />
                    <input
                      type="number"
                      name="hourlyRate"
                      required
                      min="1"
                      defaultValue={selectedTutor?.hourlyRate || ""}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Total Slot</label>
                  <div className="relative">
                    <BsHash
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={15}
                    />
                    <input
                      type="number"
                      name="totalSlot"
                      required
                      min="0"
                      defaultValue={selectedTutor?.totalSlot ?? ""}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Session Start Date</label>
                  <div
                    className={`flex items-center border rounded-lg overflow-hidden ${
                      isDark
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <BsCalendar
                      className={`ml-3 shrink-0 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={15}
                    />
                    <DatePicker
                      selected={sessionStartDate}
                      onChange={(date) => setSessionStartDate(date)}
                      placeholderText="Start date"
                      className={`w-full px-3 py-2.5 text-sm outline-none bg-transparent ${
                        isDark
                          ? "text-white placeholder-gray-500"
                          : "text-gray-900"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Session End Date</label>
                  <div
                    className={`flex items-center border rounded-lg overflow-hidden ${
                      isDark
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <BsCalendar
                      className={`ml-3 shrink-0 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={15}
                    />
                    <DatePicker
                      selected={sessionEndDate}
                      onChange={(date) => setSessionEndDate(date)}
                      placeholderText="End date"
                      minDate={sessionStartDate}
                      className={`w-full px-3 py-2.5 text-sm outline-none bg-transparent ${
                        isDark
                          ? "text-white placeholder-gray-500"
                          : "text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Institution</label>
                  <div className="relative">
                    <BsBuilding
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={15}
                    />
                    <input
                      type="text"
                      name="institution"
                      required
                      defaultValue={selectedTutor?.institution || ""}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Experience</label>
                  <div className="relative">
                    <BsPerson
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={15}
                    />
                    <input
                      type="text"
                      name="experience"
                      required
                      defaultValue={selectedTutor?.experience || ""}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <div className="relative">
                  <BsGeoAlt
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={15}
                  />
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue={selectedTutor?.location || ""}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Teaching Mode</label>
                <div className="relative">
                  <BsLaptop
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={15}
                  />
                  <select
                    name="teachingMode"
                    required
                    defaultValue={selectedTutor?.teachingMode || ""}
                    className={`${inputClass} pl-9 cursor-pointer`}
                  >
                    {TEACHING_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold transition mt-2"
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 ${
              isDark
                ? "bg-gray-900 border border-gray-800"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="text-center mb-6">
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
                  isDark ? "bg-red-900/20" : "bg-red-50"
                }`}
              >
                <BsExclamationTriangle size={24} className="text-red-500" />
              </div>
              <h2
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Delete Tutor
              </h2>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deleteTarget.name}</span>? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
                  isDark
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white transition"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
