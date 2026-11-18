import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("accessibility", "he");
export default function Page() {
  return <LegalPage k="accessibility" lang="he" />;
}
