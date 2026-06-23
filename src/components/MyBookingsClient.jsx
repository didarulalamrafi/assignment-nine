"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/utils/auth-client";
import { useGlobals } from "@/providers/AppProvider";
import { toast } from "react-toastify";
import { BsX, BsExclamationTriangle } from "react-icons/bs";
import { authFetch } from "@/lib/utils/jwt";

export default function MyBookingsClient() {
  const { isDark } = useGlobals();
  const { data: session, isPending: sessionLoading } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

useEffect(() => {
  if (!session?.user?.email) return;

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings?email=${session.user.email}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, [session?.user?.email]);

  const openCancelModal = (booking) => {
    setCancelTarget(booking);
    setCancelModal(true);
  };

const handleCancel = async () => {
  const targetId = cancelTarget?._id || cancelTarget?.id;

  if (!targetId) {
    toast.error("Could not find a valid booking ID");
    console.error(
      "Cancel failed: cancelTarget is missing both _id and id properties.",
      cancelTarget,
    );
    return;
  }

  setCancelLoading(true);
  try {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${targetId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
        credentials: "include",
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Server responded with status ${res.status}: ${errorText}`,
      );
    }

    const data = await res.json();
    console.log("Server cancel response:", data);

    setBookings((prev) =>
      prev.map((b) => {
        const currentId = b._id || b.id;
        return currentId === targetId ? { ...b, status: "cancelled" } : b;
      }),
    );

    toast.success("Booking cancelled successfully!");
    setCancelModal(false);
  } catch (error) {
    console.error("Detailed cancellation error:", error);
    toast.error("Failed to cancel booking");
  } finally {
    setCancelLoading(false);
  }
};

  const getStatusBadge = (status) => {
    const styles = {
      pending: isDark
        ? "bg-yellow-900/20 text-yellow-400"
        : "bg-yellow-50 text-yellow-600",
      confirmed: isDark
        ? "bg-green-900/20 text-green-400"
        : "bg-green-50 text-green-600",
      cancelled: isDark
        ? "bg-red-900/20 text-red-400"
        : "bg-red-50 text-red-500",
    };
    return styles[status] || styles.pending;
  };

  const isCurrentlyLoading = !session?.user?.email ? false : loading;

  if (isCurrentlyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          My Booked Sessions
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          Track and manage your booked tutor sessions
        </p>
      </div>

      {bookings.length === 0 ? (
        <div
          className={`rounded-2xl border p-16 text-center ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="text-5xl mb-4">📅</div>
          <h2
            className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            No bookings yet
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            You haven&apos;t booked any sessions. Browse tutors and book one!
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500"}`}
                >
                  <th className="px-4 py-3 text-left">Tutor Name</th>
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}
              >
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`transition ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}
                  >
                    <td
                      className={`px-4 py-3 text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {booking.tutorName}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {booking.studentName}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {booking.studentEmail}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getStatusBadge(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {booking.status !== "cancelled" ? (
                        <button
                          onClick={() => openCancelModal(booking)}
                          className={`flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-xs font-medium transition ${isDark ? "bg-red-900/20 text-red-400 hover:bg-red-900/40" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                        >
                          <BsX size={14} /> Cancel
                        </button>
                      ) : (
                        <span
                          className={`text-xs ${isDark ? "text-gray-600" : "text-gray-300"}`}
                        >
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {cancelModal && cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"}`}
          >
            <div className="text-center mb-6">
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${isDark ? "bg-red-900/20" : "bg-red-50"}`}
              >
                <BsExclamationTriangle size={24} className="text-red-500" />
              </div>
              <h2
                className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Cancel Booking
              </h2>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Are you sure you want to cancel your session with{" "}
                <span className="font-semibold">{cancelTarget.tutorName}</span>?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                Keep It
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white transition"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
