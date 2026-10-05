"use client";

import { useEffect, useState } from "react";

export function RotatingText({ items, interval = 2600 }: { items: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setIndex((n) => (n + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  return (
    <span className="rotator">
      {/* key change re-mounts the span, which replays the roll-in animation */}
      <span key={index} className="rotator-item" aria-hidden="true">
        {items[index]}
      </span>
      <span className="sr-only">{items.join(", ")}</span>
    </span>
  );
}
