"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { Eye, EyeOff, X, ArrowRight } from "lucide-react";
import { encryptPassword } from "@/lib/security/clientEncrypt";
import { BABY_NAME_MAX, PASSWORD_MIN, USERNAME_MIN, USERNAME_MAX } from "@/lib/utils/constants";

const signupSchema = Yup.object({
  username: Yup.string()
    .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
    .max(USERNAME_MAX, `Username must be ${USERNAME_MAX} characters or less`)
    .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores")
    .required("Username is required"),

  email: Yup.string().email("Enter a valid email address").required("Email is required"),

  phone: Yup.string()
    .matches(/^\+?[\d\s\-().]{7,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),

  password: Yup.string()
    .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),

  babyName: Yup.string().max(BABY_NAME_MAX, "Name too long"),

  babyDob: Yup.date()
    .max(new Date(), "Date cannot be in the future")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
});

function getInputBorderClass(touched, error) {
  if (touched && error) return "border-[#D97A6A]";
  if (touched && !error) return "border-[#A8C5A0]";
  return "border-[#E0D4C8]";
}

function InputField({
  id,
  label,
  placeholder,
  type = "text",
  formik,
  optional = false,
  rightElement,
  inputClassName = "",
}) {
  const touched = formik.touched[id];
  const error = formik.errors[id];
  const hasError = touched && error;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#5C3D2E]">
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-[#B09A8A]">(optional)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 bg-[#FDFAF6] text-[#3D2B1F] border-[1.5px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:border-[#C28A5A] focus:ring-4 focus:ring-[#C28A5A]/20 ${rightElement ? "pr-12" : ""} ${getInputBorderClass(touched, error)} ${inputClassName}`}
          aria-invalid={hasError ? "true" : "false"}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {hasError && <p className="text-xs text-[#D97A6A]">{error}</p>}
    </div>
  );
}

function PasswordField({ id, label, formik }) {
  const [show, setShow] = useState(false);
  return (
    <InputField
      id={id}
      label={label}
      placeholder="********"
      type={show ? "text" : "password"}
      formik={formik}
      rightElement={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="transition-colors duration-150 text-[#B09A8A] hover:text-[#C28A5A]"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  );
}

export function AuthRegisterPage({ isOpen = true, onClose = () => {} }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      babyName: "",
      babyDob: "",
    },
    validationSchema: signupSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess(false);

      try {
        const encryptedPassword = await encryptPassword(values.password);
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            phone: values.phone,
            password: encryptedPassword,
            babyName: values.babyName,
            babyDob: values.babyDob,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setSubmitError(data?.error || "Unable to create account");
          return;
        }
        setSubmitSuccess(true);
        resetForm();
      } catch (error) {
        setSubmitError("Unable to create account");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[rgba(168,155,138,0.55)] backdrop-blur-[3px]">
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-white max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 transition-colors duration-200 text-[#A0856C] hover:bg-[#F0E8DF]"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="px-6 sm:px-10 py-8 sm:py-10">
          <div className="text-center mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 font-serif text-[#3D2B1F]">
              Create Your Account
            </h1>
            <p className="text-sm text-[#9E8475]">Join Atelier Decor for a curated nursery experience.</p>
          </div>

          {submitSuccess && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm text-center font-medium bg-[#E8F5E9] text-[#2E7D32]">
              Account created successfully
            </div>
          )}

          {submitError && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm text-center font-medium bg-[#FDECEC] text-[#B24545]">
              {submitError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField id="username" label="Username" placeholder="johndoe" formik={formik} />
              <InputField
                id="email"
                label="Email Address"
                placeholder="email@example.com"
                type="email"
                formik={formik}
              />
            </div>

            <InputField
              id="phone"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              type="tel"
              formik={formik}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordField id="password" label="Password" formik={formik} />
              <PasswordField id="confirmPassword" label="Confirm Password" formik={formik} />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-[#E0D4C8]" />
              <span className="text-xs font-semibold tracking-[0.15em] whitespace-nowrap text-[#B09A8A]">
                NURSERY DETAILS
              </span>
              <div className="flex-1 h-px bg-[#E0D4C8]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="babyName"
                label="Baby Name"
                placeholder="Optional"
                formik={formik}
                optional
              />
              <InputField
                id="babyDob"
                label="Baby Date of Birth"
                placeholder=""
                type="date"
                formik={formik}
                optional
                inputClassName="date-input"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-white transition-all duration-200 mt-2 bg-[#C28A5A] hover:bg-[#B07848] shadow-[0_4px_14px_rgba(194,138,90,0.35)] disabled:bg-[#D4A574] disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#9E8475]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium hover:underline text-[#C28A5A]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
