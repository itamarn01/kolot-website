import { pageFor } from "@/lib/page-factory";

const p = pageFor("en");
export const generateMetadata = p.generateMetadata;
export default p.Route;
