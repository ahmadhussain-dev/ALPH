
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUser,
  logoutUser,
} from "@/features/auth/auth.service";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      try {
        const response = await getCurrentUser();

        // Adjust this extraction to match your backend response.
        const currentUser =
          response.data?.user ??
          response.user ??
          response.data;

        if (active) setUser(currentUser);
      } catch (error) {
        if (active) {
          setError("Please sign in to access your account.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to sign out. Please try again."
      );
    }
  };

  if (loading) {
    return <main className="p-10">Loading account...</main>;
  }

  if (!user) {
    return (
      <main className="p-10">
        <p>{error}</p>
        <button
          onClick={() => router.replace("/login")}
          className="mt-4 underline"
        >
          Go to login
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-semibold">
        My Account
      </h1>

      <div className="mt-8 rounded-xl border p-6">
        <p className="text-sm text-gray-500">Full name</p>
        <p className="mt-1 font-medium">{user.fullName}</p>

        <p className="mt-5 text-sm text-gray-500">Email</p>
        <p className="mt-1 font-medium">{user.email}</p>

        <p className="mt-5 text-sm text-gray-500">Role</p>
        <p className="mt-1 font-medium">{user.role}</p>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-black px-6 py-3 text-white"
        >
          Logout
        </button>
        <Link href="/account/orders">
          My Orders
        </Link>
      </div>
    </main>
  );
}
