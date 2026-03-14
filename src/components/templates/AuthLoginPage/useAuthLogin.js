import { PASSWORD_MIN } from "@/lib/utils/constants";
import * as Yup from "yup";
import { encryptPassword } from "@/lib/security/clientEncrypt";
import { useState } from "react";
import { useFormik } from "formik";

const useAuthLogin = ({ onSuccess } = {}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loginSchema = Yup.object({
    identifier: Yup.string()
      .test("email-or-phone", "Enter a valid email or phone number", (value) => {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s\-().]{7,15}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      })
      .required("Email or phone number is required"),
    password: Yup.string()
      .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
      .required("Password is required"),
  });

  const getInputBorderClass = (touched, error) => {
    if (touched && error) return "border-[#D97A6A]";
    if (touched && !error) return "border-[#A8C5A0]";
    return "border-[#E0D4C8]";
  };

  const formik = useFormik({
    initialValues: { identifier: "", password: "" },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess(false);

      try {
        const encryptedPassword = await encryptPassword(values.password);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: values.identifier, password: encryptedPassword }),
        });
        const data = await response.json();
        if (!response.ok) {
          setSubmitError(data?.error || "Unable to sign in");
          return;
        }
        setSubmitSuccess(true);
        if (onSuccess) onSuccess(data?.data);
      } catch (error) {
        setSubmitError("Unable to sign in");
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  return {
    formik,
    showPassword,
    isSubmitting,
    submitSuccess,
    submitError,
    setShowPassword,
    getInputBorderClass,
  };
};

export default useAuthLogin;
