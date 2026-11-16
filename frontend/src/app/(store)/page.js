
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4]">

      <header className="flex items-center justify-between border-b bg-white px-8 py-5">
        <h1 className="text-2xl font-semibold tracking-widest">
          ALPH
        </h1>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-8 py-28">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
          New collection
        </p>

        <h2 className="mt-5 max-w-2xl text-5xl font-semibold leading-tight">
          Simplicity is the ultimate form of elegance.
        </h2>

        <p className="mt-6 max-w-lg text-gray-600">
          Explore carefully selected styles designed for
          everyday comfort and timeless appeal.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-block bg-black px-8 py-4 text-sm text-white hover:bg-gray-800"
        >
          Create your account
        </Link>
        <Link
  href="/products"
  className="mt-8 inline-block bg-black px-8 py-4 text-sm text-white"
>
  Explore Collection
</Link>
      </section>

    </main>
  );
}
