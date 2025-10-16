// src/lib/media.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function publicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export const publicImageUrl = (path: string) =>
  `${process.env.NEXT_PUBCLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
