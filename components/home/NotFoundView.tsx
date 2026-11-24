import type { Lang } from "@/lib/types";
import "./home.css";

const COPY = {
  he: {
    title: "העמוד לא נמצא",
    text: "אולי הקישור השתנה, או שהעמוד הזה כבר לא קיים. בואו נחזור למוזיקה.",
    home: { label: "לדף הבית", href: "/" },
    second: { label: "המלצות", href: "/reviews/" },
    other: { label: "English", href: "/en/", lang: "en" },
  },
  en: {
    title: "Page not found",
    text: "The link may have changed, or this page no longer exists. Let's get back to the music.",
    home: { label: "Home", href: "/en/" },
    second: { label: "Reviews", href: "/en/reviews/" },
    other: { label: "עברית", href: "/", lang: "he" },
  },
};

/** The 404 page in the site's design: used by the global not-found and by notFound() inside each language. */
export default function NotFoundView({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const he = lang === "he";
  return (
    <div className="kh kh-404" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      <main id="main" className="kh-404__main">
        <a href={c.home.href} aria-label="KOLOT">
          <img src="/media/home/logo-header.svg" alt="KOLOT" width={96} height={76} />
        </a>
        <p className="kh-label kh-accent">404</p>
        <h1 className="kh-display-l">{c.title}</h1>
        <p className="kh-body kh-muted">{c.text}</p>
        <div className="kh-404__btns">
          <a className="kh-btn kh-btn--primary" href={c.home.href}>
            {c.home.label}
          </a>
          <a className="kh-btn kh-btn--outline" href={c.second.href}>
            {c.second.label}
          </a>
        </div>
        <a className="kh-label kh-muted kh-404__lang" href={c.other.href} hrefLang={c.other.lang}>
          {c.other.label}
        </a>
      </main>
    </div>
  );
}
