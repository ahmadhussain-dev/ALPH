
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], productName }) {
  const [activeImage, setActiveImage] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-3/4 items-center justify-center bg-gray-100 text-gray-400">
        No image available
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100">
  <Image
    src={selectedImage.url}
    alt={selectedImage.alt || product.name}
    fill
    priority
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image.url}-${index}`}
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeImage === index}
              className={`aspect-square overflow-hidden border ${
                activeImage === index
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <Image
    src={image.url}
    alt={image.alt || product.name}
    fill
    sizes="64px"
    className="object-cover"
  />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
