import type { MDXContent } from "mdx/types";
import type { ReactNode } from "react";

// Custom components you can use inside any .mdx post.
function Note({ children }: { children: ReactNode }) {
  return <aside className="note">{children}</aside>;
}

const components = { Note };

export function Mdx({ Content }: { Content: MDXContent }) {
  return <Content components={components} />;
}
