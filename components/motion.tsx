"use client";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Fades content in on scroll. Reduced-motion users get the same element with an instant, motionless reveal.
 * (Swapping to a plain <div> for them left the server's inline opacity:0 in place after hydration, hiding the content.)
 */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}>
      {children}
    </motion.div>
  );
}

export function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value); // SSR/no-JS shows the real number
  useEffect(() => {
    if (!inView || reduce) return;
    setN(0);
    const c = animate(0, value, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);
  return <span ref={ref}>{prefix}{n.toLocaleString("en-GB")}{suffix}</span>;
}
