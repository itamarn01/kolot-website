import { pageFor } from "@/lib/page-factory";

const p = pageFor("home");
export const generateMetadata = p.generateMetadata;
export default p.Route;
