import { pageFor } from "@/lib/page-factory";

const p = pageFor("djs");
export const generateMetadata = p.generateMetadata;
export default p.Route;
