
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginUser,
  registerUser,
} from "@/features/auth/auth.service";

import {
  loginSchema,
  registerSchema,
} from "@/features/auth/auth.validation";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      isRegister ? registerSchema : loginSchema
    ),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setServerError("");

    try {
      if (isRegister) {
        await registerUser(values);
      } else {
        await loginUser({
          email: values.email,
          password: values.password,
        });
      }

      router.replace("/account");
      router.refresh();
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {isRegister && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full name
          </label>

          <input
            {...register("fullName")}
            type="text"
            placeholder="Your full name"
            className={inputClass}
          />

          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Email address
        </label>

        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={inputClass}
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Password
        </label>

        <input
          {...register("password")}
          type="password"
          placeholder="Enter your password"
          className={inputClass}
        />

        {errors.password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Please wait..."
          : isRegister
            ? "Create account"
            : "Sign in"}
      </button>
    </form>
  );
}
