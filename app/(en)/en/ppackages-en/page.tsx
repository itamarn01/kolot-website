import { pageFor } from "@/lib/page-factory";

const p = pageFor("en__ppackages-en");
export const generateMetadata = p.generateMetadata;
export default p.Route;
