
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">

        <Link
          href="/"
          className="text-xl font-semibold tracking-wide"
        >
          ALPH
        </Link>

        <h1 className="mt-8 text-3xl font-semibold">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Join us and discover your next favourite style.
        </p>

        <div className="mt-8">
          <AuthForm mode="register" />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-black underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}
