"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  align?: "left" | "center" | "right";
  size?: "display" | "xl" | "lg" | "md";
  className?: string;
  animate?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  actionText,
  actionHref,
  align = "center",
  size = "xl",
  className,
  animate = true,
}: SectionHeadingProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  const titleSizes = {
    display: "text-4xl sm:text-6xl md:text-7xl leading-[1.05]",
    xl: "text-3xl sm:text-5xl md:text-6xl leading-[1.1]",
    lg: "text-2xl sm:text-4xl md:text-5xl leading-[1.15]",
    md: "text-xl sm:text-3xl md:text-4xl leading-[1.2]",
  };

  const content = (
    <div
      className={cn(
        "flex flex-col max-w-4xl space-y-3 sm:space-y-4",
        alignStyles[align],
        className
      )}
    >
      {eyebrow && (
        <span className="font-sans text-[10px] sm:text-xs font-semibold uppercase tracking-ultra text-metallic">
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "font-serif-luxury font-light text-ivory tracking-tight",
          titleSizes[size]
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p className="font-sans text-xs sm:text-sm text-neutral-stone max-w-2xl font-light leading-relaxed">
          {subtitle}
        </p>
      )}

      {actionText && actionHref && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="group inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-editorial text-metallic hover:text-metallic-light transition-colors"
          >
            <span>{actionText}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
