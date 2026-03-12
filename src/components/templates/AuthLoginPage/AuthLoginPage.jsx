"use client";

import Link from "next/link";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import useAuthLogin from "./useAuthLogin";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export function AuthLoginPage({ isOpen = true, onClose = () => {} }) {
  const {
    formik,
    showPassword,
    isSubmitting,
    submitSuccess,
    submitError,
    setShowPassword,
    getInputBorderClass,
  } = useAuthLogin();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(168,155,138,0.55)] backdrop-blur-[3px]">
      <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-[#FDFAF6]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 transition-colors duration-200 text-[#A0856C] hover:bg-[#F0E8DF]"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="px-10 py-10">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F0E8DF]">
              <Lock size={22} className="text-[#C28A5A]" strokeWidth={1.8} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-1.5 font-serif text-[#3D2B1F]">Sign In</h1>
            <p className="text-sm text-[#9E8475]">Welcome back to Atelier Decor</p>
          </div>

          {submitSuccess && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm text-center font-medium bg-[#E8F5E9] text-[#2E7D32]">
              Signed in successfully
            </div>
          )}

          {submitError && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm text-center font-medium bg-[#FDECEC] text-[#B24545]">
              {submitError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold tracking-[0.12em] mb-2 text-[#6B5040]"
              >
                EMAIL OR PHONE NUMBER
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="name@example.com"
                value={formik.values.identifier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 bg-white text-[#3D2B1F] border-[1.5px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:border-[#C28A5A] focus:ring-4 focus:ring-[#C28A5A]/20 ${getInputBorderClass(formik.touched.identifier, formik.errors.identifier)}`}
              />
              {formik.touched.identifier && formik.errors.identifier && (
                <p className="mt-1.5 text-xs text-[#D97A6A]">{formik.errors.identifier}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-[0.12em] text-[#6B5040]"
                >
                  PASSWORD
                </label>
                <button
                  type="button"
                  className="text-xs font-medium hover:underline transition-colors duration-150 text-[#C28A5A]"
                  onClick={() => alert("Forgot password flow")}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200 bg-white text-[#3D2B1F] border-[1.5px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:border-[#C28A5A] focus:ring-4 focus:ring-[#C28A5A]/20 ${getInputBorderClass(formik.touched.password, formik.errors.password)}`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-150 text-[#B09A8A] hover:text-[#C28A5A]"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1.5 text-xs text-[#D97A6A]">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide text-white transition-all duration-200 relative overflow-hidden bg-[#C28A5A] hover:bg-[#B07848] shadow-[0_4px_14px_rgba(194,138,90,0.35)] disabled:bg-[#D4A574] disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex items-center my-6 gap-3">
            <div className="flex-1 h-px bg-[#E0D4C8]" />
            <span className="text-xs font-medium tracking-widest text-[#B09A8A]">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-[#E0D4C8]" />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 bg-white border-[1.5px] border-[#E0D4C8] text-[#4B3832] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:bg-[#F8F2EC] hover:border-[#C28A5A]"
            onClick={() => alert("Google OAuth flow")}
          >
            <GoogleIcon />
            Google
          </button>

          <p className="mt-6 text-center text-sm text-[#9E8475]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium hover:underline text-[#C28A5A]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
