import type { Metadata } from "next";
import ReviewsPage from "@/components/home/ReviewsPage";

export const metadata: Metadata = {
  title: "המלצות – KOLOT קולות",
  description: "מה זוגות והורים כתבו לנו אחרי החתונה, מילה במילה.",
  alternates: { canonical: "/reviews/", languages: { en: "/en/reviews/", he: "/reviews/" } },
};

export default function Page() {
  return <ReviewsPage lang="he" />;
}
