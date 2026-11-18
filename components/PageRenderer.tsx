import type { Page } from "@/lib/types";
import { getTestimonials } from "@/lib/content";
import Banner from "./sections/Banner";
import Hero from "./sections/Hero";
import Intro from "./sections/Intro";
import Cta from "./sections/Cta";
import Joy from "./sections/Joy";
import Ensembles from "./sections/Ensembles";
import Gallery from "./sections/Gallery";
import Videos from "./sections/Videos";
import Testimonials from "./sections/Testimonials";
import { PackagesSummary, AddonsBox, PackagesFooter } from "./sections/Packages";
import PackagesFull from "./sections/PackagesFull";
import EnsembleList from "./sections/EnsembleList";
import SiteFooter from "./SiteFooter";
import WorldwideTeaser from "./international/WorldwideTeaser";
import SiteHeader, { LangSwitch } from "./SiteHeader";

export default function PageRenderer({ page }: { page: Page }) {
  const { lang } = page;
  const testimonials = getTestimonials();
  const wide = page.slug === "home" || page.slug === "en";
  let bannerCount = 0;
  let h1Used = false;

  const body = page.sections.map((s, i) => {
    const prev = page.sections[i - 1];
    const afterHero = prev?.type === "hero";
    switch (s.type) {
      case "hero":
        return <Hero key={i} images={s.images} anchor={s.anchor} label={page.title} />;
      case "banner": {
        bannerCount++;
        // first page banner is the page title → h1 (one h1 per page)
        const as = !h1Used ? "h1" : "h2";
        h1Used = true;
        return <Banner key={i} {...s} lang={lang} first={afterHero} as={as} />;
      }
      case "intro":
        return <Intro key={i} {...s} lang={lang} />;
      case "cta":
        return <Cta key={i} text={s.text} href={s.href} lang={lang} />;
      case "joy":
        return <Joy key={i} html={s.html} image={s.image} />;
      case "ensembles":
        return <Ensembles key={i} items={s.items} flush={prev?.type === "banner" || prev?.type === "heading"} />;
      case "gallery":
        return <Gallery key={i} images={s.images} lang={lang} />;
      case "videos":
        return <Videos key={i} slides={s.slides} lang={lang} wide={wide} />;
      case "perfectMatch":
        return (
          <div key={i} className="section perfect" data-reveal="zoom">
            <img src={s.src} alt="The perfect match" width={800} height={125} loading="lazy" />
          </div>
        );
      case "heading":
        return s.variant === "reviews" ? (
          <h2 key={i} className="head reviews-head section" dir={lang === "en" ? "ltr" : "rtl"} style={{ textAlign: (s.align as "start") ?? "start", marginTop: 0 }} data-reveal="up" dangerouslySetInnerHTML={{ __html: s.html }} />
        ) : (
          <h2 key={i} className="section related-head" data-reveal="up" dir={lang === "en" ? "ltr" : "rtl"} dangerouslySetInnerHTML={{ __html: s.html }} />
        );
      case "testimonials":
        return <Testimonials key={i} items={testimonials} lang={lang} />;
      case "packagesSummary":
        return <PackagesSummary key={i} packages={s.packages} />;
      case "ensembleList":
        return <EnsembleList key={i} items={s.items} lang={lang} />;
      case "packagesFull":
        return <PackagesFull key={i} section={s} lang={lang} />;
      case "addons":
        return <AddonsBox key={i} section={s} />;
      case "worldwide":
        return <WorldwideTeaser key={i} lang={lang} />;
      case "packagesFooter":
        return <PackagesFooter key={i} section={s} />;
      default:
        return null;
    }
  });
  void bannerCount;

  if (page.layout === "packages") {
    return (
      <main id="main" className="pk-page" style={{ position: "relative" }}>
        <h1 className="visually-hidden">{page.title}</h1>
        <LangSwitch lang={lang} alt={page.alt} className="lang-switch pk-page__lang" />
        {body}
      </main>
    );
  }
  return (
    <>
      <SiteHeader lang={lang} alt={page.alt} />
      <main id="main">{body}</main>
      <SiteFooter lang={lang} />
    </>
  );
}
