import type { Lang } from "@/lib/types";

type Props = {
  heading: string | null;
  headingAlign?: string | null;
  columns: string[];
  align?: string | null;
  image: string | null;
  lang: Lang;
};

const isLatin = (s: string) => !/[֐-׿]/.test(s.replace(/<[^>]+>/g, ""));

export default function Intro({ heading, headingAlign, columns, align, image, lang }: Props) {
  const headingLtr = heading ? lang === "en" || isLatin(heading) : false;
  const textDir = lang === "en" ? "ltr" : "rtl";
  const H = (
    heading && (
      <h2
        className="head intro__heading"
        dir={headingLtr && lang === "en" ? "ltr" : undefined}
        lang={headingLtr ? "en" : undefined}
        style={{ textAlign: (headingAlign as "start") ?? "start" }}
        data-reveal="down"
        dangerouslySetInnerHTML={{ __html: heading }}
      />
    )
  );

  if (image) {
    return (
      <section className="section section--flush intro intro--image">
        <div className="intro__text">
          {H}
          {columns.map((c, k) => (
            <div key={k} className="rich" dir={textDir} style={{ textAlign: (align as "start") ?? "start" }} data-reveal="up" dangerouslySetInnerHTML={{ __html: c }} />
          ))}
        </div>
        <div className="intro__media" data-reveal="zoom">
          <img src={image} alt="" loading="lazy" width={587} height={391} />
        </div>
      </section>
    );
  }
  return (
    <section className="section section--flush intro">
      {H}
      <div className="intro__cols">
        {columns.map((c, k) => (
          <div
            key={k}
            className="rich"
            dir={textDir}
            style={{ textAlign: (align as "start") ?? "start", ["--reveal-delay" as string]: `${k * 0.15}s` }}
            data-reveal="up"
            dangerouslySetInnerHTML={{ __html: c }}
          />
        ))}
      </div>
    </section>
  );
}
