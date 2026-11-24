import type { Metadata } from "next";
import ContactPage from "@/components/home/ContactPage";

export const metadata: Metadata = {
  title: "Contact – KOLOT",
  description: "Tell us about your event and we'll come back with availability and a tailored proposal.",
  alternates: { canonical: "/en/contact/", languages: { en: "/en/contact/", he: "/contact/" } },
};

export default function Page() {
  return <ContactPage lang="en" />;
}
