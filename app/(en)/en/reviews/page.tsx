import type { Metadata } from "next";
import ReviewsPage from "@/components/home/ReviewsPage";

export const metadata: Metadata = {
  title: "Reviews – KOLOT",
  description: "What couples and parents wrote to us after their wedding, word for word.",
  alternates: { canonical: "/en/reviews/", languages: { en: "/en/reviews/", he: "/reviews/" } },
};

export default function Page() {
  return <ReviewsPage lang="en" />;
}
