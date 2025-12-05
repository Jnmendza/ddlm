// app/api/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createClient,
  type PostgrestSingleResponse,
} from "@supabase/supabase-js";
import type {
  Database,
  Tables,
  FunctionArgs,
  FunctionReturn,
} from "@/types/database";

export const revalidate = 60; // cache 60s (tweak as you like)

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Typed rows
type ImageRow = Tables<"images">;
type TagRow = Tables<"tags">;
type ImageTagRow = Tables<"image_tags">;

// Shape returned to the client
export type ApiImage = Pick<
  ImageRow,
  "id" | "storage_path" | "alt" | "width" | "height" | "created_at" | "position"
> & { url: string };

const supabase = createClient<Database>(URL, ANON, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const publicUrl = (path: string): string =>
  `${URL}/storage/v1/object/public/${path}`;

export async function GET(req: NextRequest) {
  const { searchParams } = new globalThis.URL(req.url);
  const tagsParam = searchParams.get("tags"); // "streets,night"
  const modeAll = searchParams.get("mode") === "all"; // AND logic
  const limitRaw = Number(searchParams.get("limit") ?? "20");
  const pageRaw = Number(searchParams.get("page") ?? "1");

  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 100)
    : 20;
  const page = Number.isFinite(pageRaw) ? Math.max(pageRaw, 1) : 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // No tag filters — list all published
    if (!tagsParam) {
      const { data, error }: PostgrestSingleResponse<ImageRow[]> =
        await supabase
          .from("images")
          .select("*")
          .eq("published", true)
          .order("position", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false })
          .range(from, to);

      if (error) throw error;

      const payload: ApiImage[] = (data ?? []).map((row) => ({
        id: row.id,
        storage_path: row.storage_path,
        alt: row.alt,
        width: row.width ?? null,
        height: row.height ?? null,
        created_at: row.created_at,
        position: row.position ?? null,
        url: publicUrl(row.storage_path),
      }));

      return NextResponse.json(payload);
    }

    // Parse tag slugs
    const slugs = tagsParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (slugs.length === 0) {
      return NextResponse.json<ApiImage[]>([]);
    }

    if (modeAll) {
      // Require ALL tags (via RPC)
      const args = { slugs } satisfies FunctionArgs<"image_ids_with_all_tags">;
      const { data: ids, error: rerr } = (await supabase.rpc(
        "image_ids_with_all_tags",
        args
      )) as PostgrestSingleResponse<FunctionReturn<"image_ids_with_all_tags">>;

      if (rerr) throw rerr;

      const imageIds = (ids ?? []).map((r) => r.id);
      if (imageIds.length === 0) {
        return NextResponse.json<ApiImage[]>([]);
      }

      const { data, error }: PostgrestSingleResponse<ImageRow[]> =
        await supabase
          .from("images")
          .select("*")
          .in("id", imageIds)
          .eq("published", true)
          .order("position", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false })
          .range(from, to);

      if (error) throw error;

      const payload: ApiImage[] = (data ?? []).map((row) => ({
        id: row.id,
        storage_path: row.storage_path,
        alt: row.alt,
        width: row.width ?? null,
        height: row.height ?? null,
        created_at: row.created_at,
        position: row.position ?? null,
        url: publicUrl(row.storage_path),
      }));

      return NextResponse.json(payload);
    }

    // ANY tag match (two-step to keep types clean)
    const { data: tagRows, error: terr }: PostgrestSingleResponse<TagRow[]> =
      await supabase.from("tags").select("*").in("slug", slugs);

    if (terr) throw terr;

    const tagIds = (tagRows ?? []).map((t) => t.id);
    if (tagIds.length === 0) {
      return NextResponse.json<ApiImage[]>([]);
    }

    const {
      data: linkRows,
      error: lerr,
    }: PostgrestSingleResponse<ImageTagRow[]> = await supabase
      .from("image_tags")
      .select("*")
      .in("tag_id", tagIds)
      .limit(2000); // This limit might need to be higher or paginated too if there are MANY links

    if (lerr) throw lerr;

    const imageIds = Array.from(
      new Set((linkRows ?? []).map((r) => r.image_id))
    );
    if (imageIds.length === 0) {
      return NextResponse.json<ApiImage[]>([]);
    }

    const { data, error }: PostgrestSingleResponse<ImageRow[]> = await supabase
      .from("images")
      .select("*")
      .in("id", imageIds)
      .eq("published", true)
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const payload: ApiImage[] = (data ?? []).map((row) => ({
      id: row.id,
      storage_path: row.storage_path,
      alt: row.alt,
      width: row.width ?? null,
      height: row.height ?? null,
      created_at: row.created_at,
      position: row.position ?? null,
      url: publicUrl(row.storage_path),
    }));

    return NextResponse.json(payload);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
