"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn, signOut } from "@/lib/utils/auth-client";
import { useGlobals } from "@/providers/AppProvider";
import { toast } from "react-toastify";
import { useSyncExternalStore } from "react";
import {
  BsEnvelope,
  BsLock,
  BsPerson,
  BsLink45Deg,
  BsGoogle,
  BsHeartPulse,
  BsEyeSlash,
  BsEye,
} from "react-icons/bs";

const emptySubscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
};

export default function RegisterPage() {
  const { isDark } = useGlobals();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const mounted = useIsMounted();

  const validatePassword = (password) => {
    const errs = {};
    if (password.length < 6) {
      errs.password = "Must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
      errs.password = "Must contain at least one uppercase letter";
    }
    else if (!/[a-z]/.test(password)) {
      errs.password = "Must contain at least one lowercase letter";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const pwErrors = validatePassword(data.password);
    if (Object.keys(pwErrors).length > 0) {
      setErrors(pwErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image || undefined,
      });

      if (error) {
        setErrors({ general: error.message || "Registration failed" });
        setLoading(false);
        return;
      }

      toast.success("Account created! Please sign in.");
      await signOut();
      setLoading(false);
      router.push("/login");
    } catch (err) {
      setErrors({ general: "An unexpected error occurred." });
      setLoading(false);
    }
  };
  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/" });
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "enter your name",
      icon: <BsPerson size={16} />,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "enter your email",
      icon: <BsEnvelope size={16} />,
    },
    {
      name: "image",
      label: "Photo URL",
      type: "text",
      placeholder: "enter your photo url",
      icon: <BsLink45Deg size={16} />,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "enter your password",
      icon: <BsLock size={16} />,
    },
  ];

  if (!mounted) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-200 ${isDark ? "bg-gray-950" : "bg-sky-50"}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 transition-colors duration-200 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"}`}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 mb-3">
            <BsHeartPulse size={28} />
          </div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Create Account
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Join MediQueue and start booking sessions
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, type, placeholder, icon }) => (
            <div key={name}>
              <label
                className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {label}{" "}
                {name === "image" && (
                  <span
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    (optional)
                  </span>
                )}
              </label>
              <div className="relative">
                <span
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {icon}
                </span>
                <input
                  type={
                    name === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : type
                  }
                  name={name}
                  required={name !== "image"}
                  placeholder={placeholder}
                  onChange={() =>
                    setErrors((prev) => ({ ...prev, [name]: "" }))
                  }
                  className={`w-full pl-9 ${name === "password" ? "pr-10" : "pr-4"} py-2.5 rounded-lg text-sm border outline-none transition
      ${
        isDark
          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500"
          : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500"
      } ${errors[name] ? "border-red-400" : ""}`}
                />
                {name === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {showPassword ? (
                      <BsEyeSlash size={16} />
                    ) : (
                      <BsEye size={16} />
                    )}
                  </button>
                )}
              </div>
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold transition"
          >
            {loading ? "Creating account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-sky-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
