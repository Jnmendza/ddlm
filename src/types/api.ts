import type { Tables } from "@/types/database";

export type ApiImage = Pick<
  Tables<"images">,
  "id" | "storage_path" | "alt" | "width" | "height" | "created_at" | "position"
> & { url: string };

export type ApiTag = Pick<Tables<"tags">, "id" | "slug" | "label">;
