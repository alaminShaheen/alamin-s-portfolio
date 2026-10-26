import localFont from "next/font/local";

export const incognito = localFont({
  src: [
    { path: "./incognito_regular.woff2", weight: "400" },
    { path: "./incognito_medium.woff2", weight: "600" },
    { path: "./incognito_medium.woff2", weight: "700" },
  ],
  variable: "--font-incognito",
  display: "swap",
});
