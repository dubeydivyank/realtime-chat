"use client";

import Image from "next/image";
import logo from "../../../public/periskope-logo.svg";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthError } from "./AuthError";

interface SignupFormProps {
  signupAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

interface FormErrors {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
  profilePicture?: string;
  general?: string;
}

export function SignupForm({ signupAction }: SignupFormProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters long";
        if (!/^[a-zA-Z0-9_\s]+$/.test(value))
          return "Username can only contain letters, numbers, underscores, and spaces";
        break;

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;

      case "mobile":
        if (!value.trim()) return "Mobile number is required";
        const mobileRegex = /^\+?[0-9]\d{1,14}$/;
        if (!mobileRegex.test(value.replace(/\s+/g, ""))) return "Please enter a valid mobile number";
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 1 * 1000 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: "File with maximum size of 1MB is allowed",
        }));
        return false;
      }

      setErrors((prev) => ({
        ...prev,
        profilePicture: undefined,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      const formDataEntries = new FormData(form);
      const newErrors: FormErrors = {};

      const username = formDataEntries.get("username") as string;
      const email = formDataEntries.get("email") as string;
      const mobile = formDataEntries.get("mobile") as string;
      const password = formDataEntries.get("password") as string;

      newErrors.username = validateField("username", username || "");
      newErrors.email = validateField("email", email || "");
      newErrors.mobile = validateField("mobile", mobile || "");
      newErrors.password = validateField("password", password || "");

      Object.keys(newErrors).forEach((key) => {
        if (newErrors[key as keyof FormErrors] === undefined) {
          delete newErrors[key as keyof FormErrors];
        }
      });

      setErrors(newErrors);
      setTouched({
        username: true,
        email: true,
        mobile: true,
        password: true,
      });

      return Object.keys(newErrors).length === 0;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    const response = await signupAction(formData);

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
    <div className="max-w-2xl w-full space-y-6 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
          <Image src={logo} alt="Periskope Logo" />
        </div>
        <h3 className="text-m font-bold text-gray-600">Create your account to get started</h3>
      </div>

      {errors.general && <AuthError error={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div
            className={`w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden ${
              errors.profilePicture ? "border-red-300" : "border-gray-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-gray-400 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-xs text-gray-500">Add Photo</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="profile_picture"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <span className="text-xs text-gray-500 text-center">Add a profile photo</span>
          {errors.profilePicture && <p className="text-xs text-red-600 text-center">{errors.profilePicture}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getFieldClasses("username")}
                placeholder="Choose a username"
              />
              {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}
            </div>

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
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                autoComplete="tel"
                required
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getFieldClasses("mobile")}
                placeholder="+91 9898989898"
              />
              {errors.mobile && <p className="text-xs text-red-600">{errors.mobile}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getFieldClasses("password")}
                placeholder="Create a strong password"
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>
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
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
