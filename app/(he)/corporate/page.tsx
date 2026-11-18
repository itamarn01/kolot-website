import { pageFor } from "@/lib/page-factory";

const p = pageFor("corporate");
export const generateMetadata = p.generateMetadata;
export default p.Route;
