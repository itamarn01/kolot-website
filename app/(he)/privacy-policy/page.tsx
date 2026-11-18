import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("privacy", "he");
export default function Page() {
  return <LegalPage k="privacy" lang="he" />;
}
