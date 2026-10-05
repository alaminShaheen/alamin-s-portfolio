import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ title, more, children }: { title: string; more?: { href: string; label: string }; children: ReactNode }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {more && <Link href={more.href} className="more">{more.label}</Link>}
      </div>
      {children}
    </section>
  );
}

export function Row({ href, title, meta, detail }: { href: string; title: string; meta: string; detail?: string }) {
  const external = /^https?:/.test(href);
  return (
    <li>
      <a href={href} className="row" {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        <span className="row-title">{title}</span>
        <span className="row-meta">{meta}</span>
        {detail && <span className="row-detail">{detail}</span>}
      </a>
    </li>
  );
}
