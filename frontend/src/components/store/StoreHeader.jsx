
import Link from "next/link";
import { useCart } from "@/context/CartContext";
export default function StoreHeader() {
  const { cart } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

        <Link
          href="/"
          className="text-2xl font-semibold tracking-[0.25em]"
        >
          ALPH
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/" className="hover:text-gray-500">
            Home
          </Link>

          <Link href="/products" className="hover:text-gray-500">
            Shop
          </Link>

          <Link href="/products?sort=newest" className="hover:text-gray-500">
            New Arrivals
          </Link>
          <Link href="/cart" className="relative">
  Cart
  <span className="ml-1 text-xs">
    ({cart.totalItems})
  </span>
</Link>
        </nav>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/products" aria-label="Search products">
            Search
          </Link>

          <Link href="/account">
            Account
          </Link>
        </div>

      </div>
    </header>
  );
}
