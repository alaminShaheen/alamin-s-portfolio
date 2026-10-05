"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {site} from "@/content/site";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  // Single-key shortcuts: press h / b / w / p anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      const item = site.navItems.find((i) => i.key === e.key.toLowerCase());
      if (item) router.push(item.href);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <nav aria-label="main" className="nav">
      {site.navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
            <kbd aria-hidden="true">{item.key}</kbd>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
