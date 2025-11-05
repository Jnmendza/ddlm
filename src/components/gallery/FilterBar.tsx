"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useTags } from "@/hooks/useTags";
import { ApiTag } from "@/types/api";

function FilterBarContent() {
  const { tags } = useTags();
  const search = useSearchParams();
  const router = useRouter();

  const initial = useMemo(
    () => new Set((search.get("tags") ?? "").split(",").filter(Boolean)),
    [search]
  );
  const [selected, setSelected] = useState<Set<string>>(initial);

  const toggle = (slug: string) => {
    const next = new Set(selected);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setSelected(next);

    const params = new URLSearchParams(search.toString());
    if (next.size) params.set("tags", Array.from(next).join(","));
    else params.delete("tags");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className='flex flex-wrap gap-2 py-4'>
      {tags.map((t: ApiTag) => {
        const active = selected.has(t.slug);
        return (
          <button
            key={t.id ?? t.slug}
            onClick={() => toggle(t.slug)}
            className={[
              "px-3 py-1 rounded-full border text-xs uppercase tracking-wide",
              active
                ? "bg-marigold text-black border-marigold"
                : "border-neutral-700 hover:border-neutral-400",
            ].join(" ")}
            aria-pressed={active}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterBar() {
  return (
    <Suspense fallback={<div className='py-4 text-xs uppercase opacity-60'>Loading filters…</div>}>
      <FilterBarContent />
    </Suspense>
  );
}
