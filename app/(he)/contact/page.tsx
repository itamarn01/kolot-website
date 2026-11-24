import type { Metadata } from "next";
import ContactPage from "@/components/home/ContactPage";

export const metadata: Metadata = {
  title: "יצירת קשר – KOLOT קולות",
  description: "ספרו לנו על האירוע ונחזור אליכם עם זמינות והצעה מותאמת.",
  alternates: { canonical: "/contact/", languages: { en: "/en/contact/", he: "/contact/" } },
};

export default function Page() {
  return <ContactPage lang="he" />;
}
