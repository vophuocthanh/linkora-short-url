"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyImageStatus = "idle" | "copying" | "copied" | "error";

interface UseCopyImage {
  status: CopyImageStatus;
  copyImage: (imageUrl: string) => Promise<void>;
}

export function useCopyImage(resetAfter = 2200): UseCopyImage {
  const [status, setStatus] = useState<CopyImageStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyImage = useCallback(
    async (imageUrl: string) => {
      setStatus("copying");
      try {
        if (typeof ClipboardItem === "undefined") {
          throw new Error("ClipboardItem is not supported");
        }

        const item = new ClipboardItem({
          "image/png": fetch(imageUrl).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch QR image");
            return res.blob();
          }),
        });

        await navigator.clipboard.write([item]);
        setStatus("copied");
      } catch {
        setStatus("error");
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setStatus("idle"), resetAfter);
    },
    [resetAfter],
  );

  return { status, copyImage };
}
