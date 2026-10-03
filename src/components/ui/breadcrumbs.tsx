"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  homeLabel?: string;
  baseUrl?: string;
}

export function Breadcrumbs({
  items,
  className,
  homeLabel = "Home",
  baseUrl = "https://velora.pk",
}: BreadcrumbsProps) {
  // BreadcrumbList JSON-LD Schema
  const schemaList = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeLabel,
      item: baseUrl,
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.label,
      item: item.href ? (item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`) : undefined,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaList,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn("flex items-center text-[11px] font-sans tracking-editorial uppercase", className)}
      >
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              href="/"
              className="text-neutral-stone hover:text-metallic transition-colors duration-200"
            >
              {homeLabel}
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <li className="text-neutral-slate select-none">
                  <ChevronRight className="h-3 w-3 stroke-[1.5]" />
                </li>
                <li>
                  {isLast || !item.href ? (
                    <span
                      aria-current={isLast ? "page" : undefined}
                      className="text-ivory font-medium"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-neutral-stone hover:text-metallic transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
