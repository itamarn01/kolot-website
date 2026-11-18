import type { Metadata, Viewport } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "KOLOT – קולות", template: "%s" },
  icons: { icon: "/media/iconkolot-300x300.jpg", apple: "/media/iconkolot-300x300.jpg" },
};
export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function HebrewLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="he">{children}</RootShell>;
}
