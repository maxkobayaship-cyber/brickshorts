import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "MaxShorts — tijolos, celular e produtos",
  description:
    "MaxShorts: três feeds verticais de tijolos, montagem de celular e lançamentos de gadgets. Estilo Shorts, sem conta.",
  applicationName: "MaxShorts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#120c07",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${fredoka.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#120c07] text-white">{children}</body>
    </html>
  );
}
