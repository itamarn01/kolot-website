import { pageFor } from "@/lib/page-factory";

const p = pageFor("packages");
export const generateMetadata = p.generateMetadata;
export default p.Route;
