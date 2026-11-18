import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("terms", "en");
export default function Page() {
  return <LegalPage k="terms" lang="en" />;
}
