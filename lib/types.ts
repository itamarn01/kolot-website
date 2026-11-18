export type Lang = "he" | "en";
export type Brand = "cyan" | "orange" | "yellow";

export type Instrument = { label: string; icon: string | null };
export type Slide = { id: string; thumb: string | null };

export type Section =
  | { type: "hero"; images: string[]; anchor?: string | null }
  | { type: "banner"; variant: "split" | "lines" | "tab"; color: Brand; title: string; subtitle?: string; anchor?: string | null }
  | { type: "intro"; heading: string | null; headingAlign?: string | null; columns: string[]; align?: string | null; image: string | null }
  | { type: "cta"; text: string; href: string; align?: string }
  | { type: "joy"; html: string; image: string }
  | { type: "ensembles"; items: { label: string; href: string; icon: string | null; ring: Brand }[] }
  | { type: "gallery"; images: string[] }
  | { type: "videos"; slides: Slide[] }
  | { type: "perfectMatch"; src: string }
  | { type: "heading"; variant: "reviews" | "related"; html: string; align?: string }
  | { type: "testimonials" }
  | {
      type: "packagesSummary";
      packages: { key: string; color: Brand; logo: string; instruments: Instrument[]; extraTitle?: string; extras?: Instrument[] }[];
    }
  | {
      type: "ensembleList";
      items: {
        title: string;
        desc: string;
        icon: string | null;
        media:
          | { kind: "youtube"; id: string }
          | { kind: "carousel"; slides: Slide[] }
          | { kind: "instagram"; url: string | null };
      }[];
    }
  | {
      type: "packagesFull";
      calculatorBase: number | null;
      includedLabel: string;
      packages: {
        logo: string;
        color: Brand;
        desc: string;
        listTitle: string;
        list: string;
        instruments: Instrument[];
        extraTitle?: string;
        extras?: Instrument[];
        calculator?: { value: number; icon: string; label: string }[];
        price: string;
      }[];
    }
  | { type: "addons"; logo: string; title: string; items: { label: string; price: string }[] }
  | { type: "packagesFooter"; note: string; contact: string };

export type Page = {
  slug: string;
  route: string;
  lang: Lang;
  alt: string;
  title: string;
  description: string | null;
  layout: "default" | "packages";
  sections: Section[];
};

export type Testimonial = { text: string; signoff: string; name: string; date: string; venue: string };
