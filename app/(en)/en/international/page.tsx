import IntlRoute, { intlMetadata } from "@/components/international/IntlRoute";

export const metadata = intlMetadata("en");
export default function Page() {
  return <IntlRoute lang="en" />;
}
