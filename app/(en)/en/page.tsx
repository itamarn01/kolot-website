import { pageFor } from "@/lib/page-factory";
import HomePage from "@/components/home/HomePage";

const p = pageFor("en");
export const generateMetadata = p.generateMetadata;

export default function Page() {
  return <HomePage lang="en" />;
}
