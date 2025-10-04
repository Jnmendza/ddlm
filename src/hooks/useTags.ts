// src/hooks/useTags.ts
import useSWR from "swr";
import type { ApiTag } from "@/types/api";

const fetcher = async (url: string): Promise<ApiTag[]> => {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<ApiTag[]>;
};

export function useTags() {
  const { data, error, isLoading } = useSWR<ApiTag[]>("/api/tags", fetcher);
  return { tags: data ?? [], isLoading, error };
}
