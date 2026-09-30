"use client";

import { Variants, Transition } from "framer-motion";

/**
 * Editorial Luxury Motion Transitions
 * Restrained, dignified, cinematic, and micro-calibrated.
 */

export const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EDITORIAL_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];
export const EXIT_EASE: [number, number, number, number] = [0.32, 0, 0.67, 0];

export const transitionLuxury: Transition = {
  duration: 0.85,
  ease: LUXURY_EASE,
};

export const transitionSubtle: Transition = {
  duration: 0.45,
  ease: LUXURY_EASE,
};

export const transitionCinematic: Transition = {
  duration: 1.2,
  ease: LUXURY_EASE,
};

// 1. Fade Reveals
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: LUXURY_EASE },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: LUXURY_EASE },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE },
  },
};

// 2. Slide Reveals
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: LUXURY_EASE },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: LUXURY_EASE },
  },
};

// 3. Staggered Container for Lists & Menus
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: LUXURY_EASE },
  },
};

// 4. Modal Scale & Fade
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: { duration: 0.3, ease: EXIT_EASE },
  },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

// 5. Drawer Slide-Over (Right Side)
export const drawerVariants: Variants = {
  hidden: { x: "100%", opacity: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: LUXURY_EASE },
  },
  exit: {
    x: "100%",
    opacity: 0.9,
    transition: { duration: 0.4, ease: EXIT_EASE },
  },
};

// 6. Mobile Navigation Drawer (Top / Left)
export const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: LUXURY_EASE },
  },
};

// 7. Mega Menu Slide Down
export const megaMenuVariants: Variants = {
  hidden: { opacity: 0, y: 10, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: { duration: 0.4, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0,
    y: 8,
    pointerEvents: "none",
    transition: { duration: 0.25, ease: LUXURY_EASE },
  },
};

// 8. Image Curtain Reveal
export const imageCurtainVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 1.1, ease: LUXURY_EASE },
  },
};

export const imageZoomVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.7, ease: LUXURY_EASE },
  },
};
