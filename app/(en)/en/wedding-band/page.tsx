import { pageFor } from "@/lib/page-factory";

const p = pageFor("en__wedding-band");
export const generateMetadata = p.generateMetadata;
export default p.Route;
