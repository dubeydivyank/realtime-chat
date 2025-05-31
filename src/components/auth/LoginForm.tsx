"use client";

import Image from "next/image";
import logo from "../../../public/periskope-logo.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthError } from "./AuthError";

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm({ loginAction }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;

      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters long";
        break;
    }
    return undefined;
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      const formDataEntries = new FormData(form);
      const newErrors: FormErrors = {};

      const email = formDataEntries.get("email") as string;
      const password = formDataEntries.get("password") as string;

      newErrors.email = validateField("email", email);
      newErrors.password = validateField("password", password);

      Object.keys(newErrors).forEach((key) => {
        if (newErrors[key as keyof FormErrors] === undefined) {
          delete newErrors[key as keyof FormErrors];
        }
      });

      setErrors(newErrors);
      setTouched({
        email: true,
        password: true,
      });

      return Object.keys(newErrors).length === 0;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    const response = await loginAction(formData);

    if (response?.error) {
      setErrors((prev) => ({
        ...prev,
        general: response.error,
      }));
      setIsLoading(false);
    }
    if (response?.success) {
      router.push("/");
    }
  };

  const getFieldClasses = (fieldName: string) => {
    const baseClasses =
      "w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 placeholder:text-sm";
    const hasError = errors[fieldName as keyof FormErrors];

    if (hasError) {
      return `${baseClasses} border-red-300 focus:ring-red-500`;
    }

    return `${baseClasses} border-gray-200 focus:ring-green-500`;
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
          <Image src={logo} alt="Periskope Logo" />
        </div>
        <h3 className="text-m font-bold text-gray-600">Sign in to your account</h3>
      </div>

      {errors.general && <AuthError error={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              className={getFieldClasses("email")}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              className={getFieldClasses("password")}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </button>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
              Create account
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
