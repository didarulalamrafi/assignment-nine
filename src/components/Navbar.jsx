"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BsBook,
  BsBoxArrowRight,
  BsCalendarCheck,
  BsCardList,
  BsHouse,
  BsList,
  BsPeople,
  BsPerson,
  BsPlusCircle,
  BsX,
} from "react-icons/bs";
import ThemeToggle from "./ThemeToggle";
import { signOut, useSession } from "@/lib/utils/auth-client";
import { useGlobals } from "@/providers/AppProvider";
import { toast } from "react-toastify";
import Image from "next/image";
import { clearJWT, getToken, issueJWT } from "@/lib/utils/jwt";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isDark } = useGlobals();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session?.user?.email && !getToken()) {
      issueJWT(session.user.email);
    }
  }, [session]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const isLoggedIn = !!session;
  const userName = session?.user?.name || null;

  const handleLogout = async () => {
    await clearJWT();
    await signOut();
    setProfileOpen(false);
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <BsHouse size={18} />, private: false },
    {
      href: "/tutors",
      label: "Tutors",
      icon: <BsPeople size={18} />,
      private: false,
    },
    {
      href: "/add-tutor",
      label: "Add Tutor",
      icon: <BsPlusCircle size={18} />,
      private: true,
    },
    {
      href: "/my-tutors",
      label: "My Tutors",
      icon: <BsCardList size={18} />,
      private: true,
    },
    {
      href: "/my-bookings",
      label: "My Booked Sessions",
      icon: <BsCalendarCheck size={18} />,
      private: true,
    },
  ];

  const isActive = pathname === "/login";

  const headerClass =
    "fixed top-0 left-0 w-full backdrop-blur-md border-b z-50 transition-colors duration-200 bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-800";

  if (isPending) {
    return (
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center text-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <BsBook color="#3182ce" size={24} /> MediQueue
            </div>
            <div className="w-9 h-9"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center text-center gap-2 text-xl font-bold hover:opacity-80 transition text-gray-900 dark:text-white"
          >
            <BsBook color="#3182ce" size={24} /> MediQueue
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.private && !isLoggedIn) return null;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:shadow-lg hover:scale-105 group"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  {session?.user?.image ? (
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 p-0.5 group-hover:opacity-100 opacity-70 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-800" />
                      </div>

                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Profile"}
                        width={40}
                        height={40}
                        className="relative z-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-md group-hover:shadow-lg transition-shadow duration-300 w-full h-full"
                      />

                      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 p-0.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-linear-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 group-hover:from-sky-200 group-hover:to-blue-200 dark:group-hover:from-sky-800/70 dark:group-hover:to-blue-800/70 transition-all duration-300 rounded-full" />
                      </div>

                      <BsPerson
                        size={18}
                        className="relative z-10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl border py-2 z-50 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <p className="text-sm font-medium truncate text-gray-700 dark:text-gray-200">
                          {userName || "User"}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <BsBoxArrowRight size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm font-medium transition rounded-lg 
    ${
      isActive
        ? "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400"
        : "text-gray-700 dark:text-gray-200 hover:text-sky-600 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md transition text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <BsX size={24} /> : <BsList size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3 shadow-lg transition-colors duration-200 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          {navLinks.map((link) => {
            if (link.private && !isLoggedIn) return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition ${
                  isActive
                    ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t flex items-center justify-between border-gray-200 dark:border-gray-700">
            <ThemeToggle />
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-md transition hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <BsBoxArrowRight size={16} /> Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm font-medium text-sky-600 hover:underline"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
