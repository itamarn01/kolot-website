import type { Lang } from "@/lib/types";
import { COPY, WHATSAPP } from "./copy";
import AvailabilitySection from "./Funnel";
import { HeaderShell, InquireButton, MobileMenu } from "./Interactive";
import { CookieSettingsButton } from "../consent";

/** Header, footer and the floating WhatsApp button, shared by the homepage and the new-design pages. */

const M = "/media/home";

/** `alt` = the same page in the other language (defaults to the other homepage). */
export function SiteHeader({ lang, alt }: { lang: Lang; alt?: string }) {
  const c = COPY[lang];
  return (
    <HeaderShell>
      <div className="kh-header__in kh-wrap">
        <a href={c.home} className="kh-header__logo" aria-label="KOLOT">
          <img
            src={`${M}/logo-header.svg`}
            alt="KOLOT"
            width={96}
            height={76}
          />
        </a>
        <nav className="kh-header__nav" aria-label="Main">
          {c.nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="kh-header__actions">
          <a
            className="kh-label kh-muted kh-lang"
            href={alt ?? c.alt}
            hrefLang={lang === "he" ? "en" : "he"}
            aria-label={c.langLabel}
          >
            {c.langShort}
          </a>
          <InquireButton className="kh-btn kh-btn--primary kh-header__cta" href="#contact">
            {c.headerCta}
          </InquireButton>
          <MobileMenu lang={lang} />
        </div>
      </div>
    </HeaderShell>
  );
}

/** The availability section ("Your evening starts here" + the step-by-step form), then the footer. On every page. */
export function SiteFooter({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <>
      <section className="kh-cta" id="contact">
        <div className="kh-cta__glow" aria-hidden />
        <div className="kh-cta__beam" aria-hidden />
        <AvailabilitySection lang={lang} eyebrow={c.ctaEyebrow} title={c.ctaTitle} text={c.ctaText} cta={c.available} />
      </section>
      <footer className="kh-footer">
        <div className="kh-wrap kh-footer__in">
          <img
            src={`${M}/logo-footer.svg`}
            alt="KOLOT"
            width={72}
            height={57}
          />
          <nav className="kh-footer__nav" aria-label="Footer">
            {c.footerNav.map((n) => (
              <a
                key={n.label}
                href={n.href}
                {...(n.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="kh-footer__legal">
            <span>© 2026 KOLOT</span>
            {c.legal.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            <CookieSettingsButton label={lang === "he" ? "הגדרות עוגיות" : "Cookie settings"} />
          </div>
          <p className="kh-label kh-footer__tag">TURN IT UP</p>
        </div>
      </footer>

      <a
        className="kh-wa"
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.whatsapp}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
