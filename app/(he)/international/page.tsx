import IntlRoute, { intlMetadata } from "@/components/international/IntlRoute";

export const metadata = intlMetadata("he");
export default function Page() {
  return <IntlRoute lang="he" />;
}
