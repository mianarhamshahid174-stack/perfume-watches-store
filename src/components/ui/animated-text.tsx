"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { LUXURY_EASE } from "@/lib/motion";

export interface AnimatedTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  wordClassName?: string;
  delay?: number;
}

export function AnimatedText({
  text,
  as: Component = "h2",
  className,
  wordClassName,
  delay = 0,
}: AnimatedTextProps) {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.85,
        ease: LUXURY_EASE,
      },
    },
  };

  return (
    <Component
      // @ts-expect-error ref typing for dynamic element
      ref={ref}
      className={cn("inline-block overflow-hidden", className)}
    >
      <motion.span
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.1em]"
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={wordVariants}
            className={cn("inline-block transform-gpu", wordClassName)}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
