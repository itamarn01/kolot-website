import Banner from "./sections/Banner";
import ZooglotForm from "./ZooglotForm";
import { CookieSettingsButton } from "./consent";
import { AtIcon, DoubleUp, FacebookIcon, InstagramIcon, PhoneIcon, YoutubeIcon } from "./icons";
import { CONTACT, LEGAL_LINKS, UI } from "@/lib/site";
import type { Lang } from "@/lib/types";

export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = UI[lang];
  return (
    <>
      <Banner variant="split" color="yellow" title={t.contactTitle} subtitle={t.contactSubtitle} anchor="contact-us" lang={lang} />
      <ZooglotForm lang={lang} />
      <a className="to-top" href="#top" aria-label={t.backToTop}>
        <DoubleUp />
      </a>
      <footer className="footer-bar">
        <div className="footer-bar__social">
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={CONTACT.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <YoutubeIcon />
          </a>
        </div>
        <div className="footer-bar__info">
          <a className="footer-info" href={`mailto:${CONTACT.email}`}>
            <AtIcon />
            <span>{CONTACT.email}</span>
          </a>
          <a className="footer-info" href={CONTACT.phoneHref}>
            <PhoneIcon />
            <span>{CONTACT.phone}</span>
          </a>
        </div>
        <img className="footer-bar__logo" src="/media/kolot-logo-08-1.png" alt="KOLOT" width={103} height={62} loading="lazy" />
      </footer>
      <nav className="legal-bar" aria-label={lang === "he" ? "מידע משפטי" : "Legal"}>
        <span>
          © {new Date().getFullYear()} KOLOT – {t.rights}
        </span>
        {LEGAL_LINKS[lang].map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <CookieSettingsButton label={t.cookieManage} />
      </nav>
    </>
  );
}
