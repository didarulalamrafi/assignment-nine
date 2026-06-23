"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/utils/auth-client";
import { useGlobals } from "@/providers/AppProvider";
import { toast } from "react-toastify";
import {
  BsEnvelope,
  BsLock,
  BsGoogle,
  BsBook,
  BsEyeSlash,
  BsEye,
} from "react-icons/bs";
import { issueJWT } from "@/lib/utils/jwt";

export const metadata = {
  title: "Login | MediQueue",
  description: "Sign in to your MediQueue account",
};

export default function LoginPage() {
  const { isDark } = useGlobals();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";


  const handleLoginAction = async (formData) => {
    setLoading(true);
    setError("");

    const email = formData.get("email");
    const password = formData.get("password");

    const { error: signInError } = await signIn.email({ email, password });

    if (signInError) {
      setError(signInError.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    await issueJWT(email); 
    toast.success("Welcome back!");
    window.location.href = redirectTo; 
  };

 const handleGoogle = async () => {
   const callback = `${window.location.origin}${redirectTo}`;
   await signIn.social({ provider: "google", callbackURL: callback });
 };


  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-200 ${isDark ? "bg-gray-950" : "bg-sky-50"}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 transition-colors duration-200 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"}`}
      >
        <div className="text-center mb-8">
          <div
            className={`flex justify-center text-4xl mb-3 ${isDark ? "text-sky-400" : "text-sky-600"}`}
          >
            <BsBook size={40} />
          </div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Sign in to your MediQueue account
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLoginAction(new FormData(e.target));
          }}
          className="space-y-4"
        >
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Email
            </label>
            <div className="relative">
              <BsEnvelope
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={16}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                onChange={() => setError("")}
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm border outline-none transition
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
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Password
            </label>
            <div className="relative">
              <BsLock
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                onChange={() => setError("")}
                className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm border outline-none transition
                  ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
              >
                {showPassword ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div
            className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
          />
          <span
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            or
          </span>
          <div
            className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
          />
        </div>

        <button
          onClick={handleGoogle}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition
            ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
        >
          <BsGoogle size={16} />
          Continue with Google
        </button>

        <p
          className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-sky-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
