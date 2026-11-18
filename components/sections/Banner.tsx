import type { Brand } from "@/lib/types";

type Props = {
  variant: "split" | "lines" | "tab";
  color: Brand;
  title: string;
  subtitle?: string;
  anchor?: string | null;
  lang: "he" | "en";
  first?: boolean;
  as?: "h1" | "h2";
};

const isLatin = (s: string) => !/[֐-׿]/.test(s);

/** The angled colored title bars that open every section of the site. */
export default function Banner({ variant, color, title, subtitle, anchor, first, as = "h2" }: Props) {
  const H = as;
  const titleLang = isLatin(title) ? "en" : "he";
  return (
    <section
      id={anchor ?? undefined}
      className={`section banner banner--${variant} c-${color}${first ? " section--flush" : ""}`}
      aria-label={title.replace(/<[^>]+>/g, "")}
    >
      {variant === "lines" && (
        <>
          <div className="banner__stub" data-reveal="grow-l" aria-hidden />
          <div className="banner__outline" data-reveal="grow-r" aria-hidden />
        </>
      )}
      <div className="banner__shape" data-reveal={variant === "tab" ? "grow-l" : "grow-r"} aria-hidden />
      <H className="banner__title" lang={titleLang} dir={titleLang === "en" ? "ltr" : "rtl"} data-reveal="up" style={{ ["--reveal-delay" as string]: ".35s" }} dangerouslySetInnerHTML={{ __html: title }} />
      {subtitle && (
        <p className="banner__subtitle" lang="en" dir="ltr" data-reveal="left" style={{ ["--reveal-delay" as string]: ".5s" }} dangerouslySetInnerHTML={{ __html: subtitle }} />
      )}
    </section>
  );
}
