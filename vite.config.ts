import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import tailwindcss from "@tailwindcss/vite";

const mdxPlugin = mdx({
  providerImportSource: undefined,
  remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: "frontmatter" }]],
  rehypePlugins: [
    [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark-dimmed" }, keepBackground: false }],
  ],
}) as Plugin;

const mdxTransform = mdxPlugin.transform as Extract<
  Plugin["transform"],
  (...args: never[]) => unknown
>;

// Compiles app/posts/*.mdx at build time, so nothing reads the filesystem
// or compiles MDX on the Worker at request time (Workers forbid both).
const mdxBuildTime: Plugin = {
  ...mdxPlugin,
  enforce: "pre",
  // @mdx-js/rollup strips the query before filtering, so it would otherwise
  // also claim `*.mdx?raw`. Leave suffixed ids to Vite so `?raw` still yields
  // untouched source (lib/blog.ts parses frontmatter and headings out of it).
  transform(value, id, options) {
    if (id.includes("?")) return;
    return mdxTransform.call(this, value, id, options);
  },
};

export default defineConfig({
  plugins: [
    mdxBuildTime,
    vinext({
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
    tailwindcss(),
  ],
});
