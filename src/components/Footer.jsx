"use client";
import Link from "next/link";
import { useGlobals } from "@/providers/AppProvider";
import {
  BsFacebook,
  BsTwitterX,
  BsInstagram,
  BsLinkedin,
  BsEnvelope,
  BsTelephone,
  BsGeoAlt,
  BsBook,
} from "react-icons/bs";

export default function Footer() {
  const { isDark } = useGlobals();

  const tutorLinks = [
    { href: "/tutors", label: "Find a Tutor" },
    { href: "/add-tutor", label: "Become a Tutor" },
    { href: "/my-tutors", label: "My Tutors" },
    { href: "/my-bookings", label: "My Bookings" },
  ];

  const subjectLinks = [
    { href: "/tutors", label: "Mathematics" },
    { href: "/tutors", label: "Physics" },
    { href: "/tutors", label: "Computer Science" },
    { href: "/tutors", label: "English" },
  ];

  const socialLinks = [
    {
      href: "https://facebook.com",
      icon: <BsFacebook size={18} />,
      label: "Facebook",
    },
    {
      href: "https://twitter.com",
      icon: <BsTwitterX size={18} />,
      label: "Twitter",
    },
    {
      href: "https://youtube.com",
      icon: <BsInstagram size={18} />,
      label: "Instagram",
    },
    {
      href: "https://linkedin.com",
      icon: <BsLinkedin size={18} />,
      label: "LinkedIn",
    },
  ];

  return (
    <footer
      suppressHydrationWarning
      className={`border-t transition-colors duration-200 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link
              href="/"
              className={`flex items-center gap-2 text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              <BsBook color="#3182ce" size={24} /> MediQueue
            </Link>
            <p
              className={`text-sm leading-relaxed mb-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Connecting students with expert tutors across every subject. Learn
              smarter, grow faster.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-2 rounded-lg transition ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3
              className={`text-sm font-bold uppercase tracking-wide mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Tutor Services
            </h3>
            <ul className="space-y-2.5">
              {tutorLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={`text-sm transition ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-sm font-bold uppercase tracking-wide mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Popular Subjects
            </h3>
            <ul className="space-y-2.5">
              {subjectLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={`text-sm transition ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-sm font-bold uppercase tracking-wide mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <BsGeoAlt
                  size={15}
                  className={`mt-0.5 shrink-0 ${isDark ? "text-sky-400" : "text-sky-600"}`}
                />
                <span
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Dhanmondi, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <BsTelephone
                  size={15}
                  className={`shrink-0 ${isDark ? "text-sky-400" : "text-sky-600"}`}
                />
                <a
                  href="tel:+8801700000000"
                  className={`text-sm transition ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <BsEnvelope
                  size={15}
                  className={`shrink-0 ${isDark ? "text-sky-400" : "text-sky-600"}`}
                />
                <a
                  href="mailto:support@mediqueue.com"
                  className={`text-sm transition ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                >
                  support@mediqueue.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? "border-gray-800" : "border-gray-100"}`}
        >
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            © {new Date().getFullYear()} MediQueue. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="/"
                className={`text-xs transition ${isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
