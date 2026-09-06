import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibilityMap = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibilityMap.set(id, entry.intersectionRatio);
          });

          let bestId = sectionIds[0] ?? '';
          let bestRatio = -1;
          visibilityMap.forEach((ratio, secId) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = secId;
            }
          });
          if (bestRatio > 0) setActive(bestId);
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: '-80px 0px -40% 0px' },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return active;
}
