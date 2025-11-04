import type { ApiTag } from "@/types/api";
import type { useTranslations } from "next-intl";

export type CategorySlug = "all" | ApiTag["slug"];

export type Translate = ReturnType<typeof useTranslations>;
