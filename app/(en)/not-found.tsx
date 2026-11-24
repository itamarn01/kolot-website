import type { Metadata } from "next";
import NotFoundView from "@/components/home/NotFoundView";

export const metadata: Metadata = { title: "404 – KOLOT", robots: { index: false } };

export default function NotFound() {
  return <NotFoundView lang="en" />;
}
