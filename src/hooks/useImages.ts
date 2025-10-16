// src/hooks/useImages.ts
import useSWR from "swr";
import type { ApiImage } from "@/types/api";

const fetcher = async (url: string): Promise<ApiImage[]> => {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<ApiImage[]>;
};

export function useImages(params?: { slugs?: string[]; mode?: "any" | "all" }) {
  const qs = new URLSearchParams();
  if (params?.slugs?.length) qs.set("tags", params.slugs.join(","));
  if (params?.mode === "all") qs.set("mode", "all");
  const key = `/api/images${qs.toString() ? `?${qs}` : ""}`;
  const { data, error, isLoading } = useSWR<ApiImage[]>(key, fetcher);
  return { images: data ?? [], isLoading, error };
}
