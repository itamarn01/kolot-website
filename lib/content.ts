import fs from "node:fs";
import path from "node:path";
import type { Page, Testimonial } from "./types";

const DIR = path.join(process.cwd(), "content");

/** Load one page's content. `file` is the JSON name in content/pages (route with "/" → "__"). */
export function getPage(file: string): Page {
  return JSON.parse(fs.readFileSync(path.join(DIR, "pages", `${file}.json`), "utf8"));
}

export function getAllPages(): Page[] {
  return fs
    .readdirSync(path.join(DIR, "pages"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => getPage(f.replace(/\.json$/, "")));
}

export function getTestimonials(): Testimonial[] {
  return JSON.parse(fs.readFileSync(path.join(DIR, "testimonials.json"), "utf8"));
}
