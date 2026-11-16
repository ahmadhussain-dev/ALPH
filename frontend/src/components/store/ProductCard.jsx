
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const startingPrice = product.variants?.length
    ? Math.min(...product.variants.map((item) => item.price))
    : null;

  const image = product.images?.[0];

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-3/4 overflow-hidden bg-[#f2f1ee]">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={90}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}

          {product.isFeatured && (
            <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        <div className="pt-4">
          <p className="text-xs text-gray-500">
            {product.category?.name || "Collection"}
          </p>

          <h3 className="mt-2 text-sm font-medium">
            {product.name}
          </h3>

          <p className="mt-2 text-sm">
            {startingPrice !== null
              ? `PKR ${startingPrice.toLocaleString("en-PK")}`
              : "Price unavailable"}
          </p>
        </div>
      </Link>
    </article>
  );
}
