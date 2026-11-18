import { pageFor } from "@/lib/page-factory";

const p = pageFor("energy-packages");
export const generateMetadata = p.generateMetadata;
export default p.Route;
