"use client";

import clsx from "clsx";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment } from "react";

import { locales } from "@/i18n/locales";
import { killScrollAnimations } from "@/lib/scroll/cleanup";

type Props = {
  className?: string;
};

export default function LocaleSwitcher({ className }: Props) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname.split("/");
  const [, , ...rest] = segments;
  const basePath = `/${rest.join("/")}`.replace(/\/$/, "") || "/";
  const queryString = searchParams.toString();

  return (
    <nav
      aria-label={t("label")}
      className={clsx("flex items-center gap-2", className)}
    >
      {locales.map((code, idx) => {
        const isActive = code === locale;
        const trimmedBase = basePath === "/" ? "" : basePath;
        const path = `/${code}${trimmedBase}`;
        const targetHref = queryString ? `${path}?${queryString}` : path;
        return (
          <Fragment key={code}>
            <Link
              href={targetHref}
              className={clsx(
                "transition-colors hover:text-white",
                isActive ? "text-white" : undefined
              )}
              aria-current={isActive ? "true" : undefined}
              prefetch={false}
              onClick={killScrollAnimations}
            >
              {t(code)}
            </Link>
            {idx < locales.length - 1 && (
              <span aria-hidden className='opacity-70'>
                |
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
