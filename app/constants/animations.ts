/* ─────────────────────────────────────────────
   Animation Variants
───────────────────────────────────────────── */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};
