// app/api/tags/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/database";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(URL, ANON, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type TagRow = Tables<"tags">;
export type ApiTag = Pick<TagRow, "id" | "slug" | "label">;

export const revalidate = 3600;

export async function GET() {
  const { data, error } = await supabase
    .from("tags")
    .select("id, slug, label")
    .order("label", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as ApiTag[]);
}
