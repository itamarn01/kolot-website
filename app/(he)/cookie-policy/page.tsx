import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("cookies", "he");
export default function Page() {
  return <LegalPage k="cookies" lang="he" />;
}
