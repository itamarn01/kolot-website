import { PhoneIcon } from "../icons";

export default function Cta({ text, href, lang }: { text: string; href: string; lang: "he" | "en" }) {
  return (
    <a className="section cta" href={href} data-reveal="up">
      <span className="cta__stub" aria-hidden />
      <span className="cta__frame" aria-hidden />
      <span className="cta__inner">
        <span className="cta__text" dir={lang === "en" ? "ltr" : "rtl"} dangerouslySetInnerHTML={{ __html: text }} />
        <PhoneIcon className="cta__icon" />
      </span>
    </a>
  );
}
