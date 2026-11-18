import { pageFor } from "@/lib/page-factory";

const p = pageFor("ppackages");
export const generateMetadata = p.generateMetadata;
export default p.Route;
