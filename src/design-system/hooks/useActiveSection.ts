import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], rootMargin = "-20% 0px -70% 0px") {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin, threshold: 0 }
    );

    const nodes = ids
      .map(id => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    nodes.forEach(n => observer.observe(n));

    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
