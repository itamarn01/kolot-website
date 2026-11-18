import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("privacy", "en");
export default function Page() {
  return <LegalPage k="privacy" lang="en" />;
}
