"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/analytics";
import type { TrackedProduct } from "@/lib/analytics";

export default function ProductViewTracker({
  product,
}: {
  product: TrackedProduct;
}) {
  useEffect(() => {
    trackViewContent(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);
  return null;
}
