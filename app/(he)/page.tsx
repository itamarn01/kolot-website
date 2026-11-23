import { pageFor } from "@/lib/page-factory";
import HomePage from "@/components/home/HomePage";

const p = pageFor("home");
export const generateMetadata = p.generateMetadata;

export default function Page() {
  return <HomePage lang="he" />;
}
