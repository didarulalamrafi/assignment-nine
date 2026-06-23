"use client";
import { useSession } from "@/lib/utils/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import {
  BsPerson,
  BsEnvelope,
  BsShieldCheck,
  BsCalendar3,
  BsBookmark,
  BsPlusCircle,
  BsArrowLeft,
  BsPatchCheckFill,
} from "react-icons/bs";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-16 px-4">
      
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group"
        >
          <BsArrowLeft
            size={15}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
  
          <div className="h-28 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

        
          <div className="px-6 pb-6">
            <div className="-mt-12 mb-4 flex items-end justify-between">
           
              <div className="relative">
                {user?.image ? (
                  <div className="w-24 h-24 rounded-2xl ring-4 ring-white dark:ring-gray-900 shadow-lg overflow-hidden">
                    <Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl ring-4 ring-white dark:ring-gray-900 shadow-lg bg-linear-to-br from-sky-100 to-blue-200 dark:from-sky-900 dark:to-blue-900 flex items-center justify-center">
                    <span className="text-2xl font-bold text-sky-600 dark:text-sky-300">
                      {initials}
                    </span>
                  </div>
                )}
 
                {user?.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
                    <BsPatchCheckFill size={18} className="text-sky-500" />
                  </div>
                )}
              </div>

              <span className="text-xs px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium border border-sky-200 dark:border-sky-800">
                Student
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {user?.name || "Anonymous User"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
              <BsEnvelope size={13} />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
     
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Account Details
            </h2>

            <InfoRow
              icon={<BsPerson size={15} className="text-sky-500" />}
              label="Full Name"
              value={user?.name || "—"}
            />
            <InfoRow
              icon={<BsEnvelope size={15} className="text-sky-500" />}
              label="Email"
              value={user?.email || "—"}
            />
            <InfoRow
              icon={<BsShieldCheck size={15} className="text-sky-500" />}
              label="Email Verified"
              value={
                user?.emailVerified ? (
                  <span className="text-emerald-500 font-medium">Verified</span>
                ) : (
                  <span className="text-amber-500 font-medium">Pending</span>
                )
              }
            />
            <InfoRow
              icon={<BsCalendar3 size={15} className="text-sky-500" />}
              label="Member Since"
              value={joinedDate}
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Quick Actions
            </h2>

            <div className="space-y-2.5">
              <ActionLink
                href="/my-bookings"
                icon={<BsBookmark size={15} />}
                label="My Booked Sessions"
                desc="View & manage your bookings"
              />
              <ActionLink
                href="/my-tutors"
                icon={<BsPerson size={15} />}
                label="My Tutors"
                desc="Tutors you've added"
              />
              <ActionLink
                href="/add-tutor"
                icon={<BsPlusCircle size={15} />}
                label="Add a Tutor"
                desc="List a new tutor session"
              />
            </div>
          </div>
        </div>

        {!user?.image && (
          <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl px-5 py-4 flex items-start gap-3">
            <BsPerson size={18} className="text-sky-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-sky-700 dark:text-sky-300">
                No profile photo set
              </p>
              <p className="text-xs text-sky-600/70 dark:text-sky-400/70 mt-0.5">
                You registered without a photo URL. Your initials are shown
                instead.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionLink({ href, icon, label, desc }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group"
    >
      <span className="p-1.5 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-sky-500 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/40 transition-colors">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {label}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {desc}
        </p>
      </div>
    </Link>
  );
}
