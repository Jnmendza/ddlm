// src/hooks/useImages.ts
import useSWRInfinite from "swr/infinite";
import type { ApiImage } from "@/types/api";

const fetcher = async (url: string): Promise<ApiImage[]> => {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<ApiImage[]>;
};

const PAGE_LIMIT = 20;

export function useImages(params?: { slugs?: string[]; mode?: "any" | "all" }) {
  const getKey = (pageIndex: number, previousPageData: ApiImage[]) => {
    // Reached the end
    if (previousPageData && !previousPageData.length) return null;

    const qs = new URLSearchParams();
    if (params?.slugs?.length) qs.set("tags", params.slugs.join(","));
    if (params?.mode === "all") qs.set("mode", "all");
    qs.set("page", (pageIndex + 1).toString());
    qs.set("limit", PAGE_LIMIT.toString());

    return `/api/images?${qs.toString()}`;
  };

  const { data, error, isLoading, size, setSize, isValidating } =
    useSWRInfinite<ApiImage[]>(getKey, fetcher, {
      revalidateFirstPage: false,
      persistSize: true,
    });

  const images = data ? data.flat() : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_LIMIT);

  return {
    images,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    size,
    setSize,
    error,
    isValidating,
  };
}
