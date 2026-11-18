import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("cookies", "en");
export default function Page() {
  return <LegalPage k="cookies" lang="en" />;
}
