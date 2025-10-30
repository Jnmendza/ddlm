export const toRenderUrl = (
  url: string,
  width: number,
  height: number,
  opts: {
    resize?: "cover" | "contain" | "fill";
    quality?: number;
    format?: "origin";
  } = {}
) => {
  // Supabase Storage → Transform API (render) URL
  const u = new URL(url);
  const key = u.pathname.replace("/storage/v1/object/public/", "");
  const base = `${u.origin}/storage/v1/render/image/public/${key}`;
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    resize: opts.resize ?? "cover",
    quality: String(opts.quality ?? 85),
  });
  if (opts.format) params.set("format", opts.format);
  return `${base}?${params.toString()}`;
};

export const RING_W = 620;
export const RING_H = 540;

const RAW_DEFAULTS = [
  "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People1.jpg",
  "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People2.jpg",
  "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People3.jpg",
  "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People4.jpg",
  "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People5.jpg",
];

export const defaultImages = RAW_DEFAULTS.map((u) =>
  toRenderUrl(u, RING_W, RING_H, { resize: "cover", quality: 85 })
);
