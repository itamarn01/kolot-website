import { pageFor } from "@/lib/page-factory";

const p = pageFor("reception");
export const generateMetadata = p.generateMetadata;
export default p.Route;
