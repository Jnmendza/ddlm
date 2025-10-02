// lib/data/images.ts
import { sbBrowser } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export async function listImages() {
  const supabase = sbBrowser();
  const { data, error } = await supabase
    .from("images")
    .select("id, storage_path, alt, width, height, created_at, position")
    .eq("published", true)
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Pick<
    Tables<"images">,
    | "id"
    | "storage_path"
    | "alt"
    | "width"
    | "height"
    | "created_at"
    | "position"
  >[];
}

export async function listImagesByTagSlugs(slugs: string[]) {
  const supabase = sbBrowser();
  if (!slugs?.length) return listImages();

  // 1) get tag ids
  const { data: tags, error: tErr } = await supabase
    .from("tags")
    .select("id, slug")
    .in("slug", slugs);
  if (tErr) throw tErr;
  const ids = (tags ?? []).map((t) => t.id);
  if (!ids.length) return [];

  // 2) images that have ANY of those tag ids
  const { data, error } = await supabase
    .from("images")
    .select(
      `
      id, storage_path, alt, width, height, created_at, position,
      image_tags!inner(tag_id),
      tags:image_tags(tag:tag_id (slug, label))
    `
    )
    .in("image_tags.tag_id", ids)
    .eq("published", true)
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
