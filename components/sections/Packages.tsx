import type { Instrument, Section } from "@/lib/types";

type Summary = Extract<Section, { type: "packagesSummary" }>;
type Addons = Extract<Section, { type: "addons" }>;
type Footer = Extract<Section, { type: "packagesFooter" }>;

export function Inst({ it, lg }: { it: Instrument; lg?: boolean }) {
  return (
    <li className={`inst${lg ? " inst--lg" : ""}`}>
      <span className="inst__circle">{it.icon && <img src={it.icon} alt="" loading="lazy" />}</span>
      <span className="inst__label">{it.label}</span>
    </li>
  );
}

/** Wordmark + instruments, used inside the wedding / bar-mitzva / corporate pages. */
export function PackagesSummary({ packages }: { packages: Summary["packages"] }) {
  return (
    <section className="section section--flush pk-summary" style={{ marginTop: 30 }}>
      {packages.map((p, k) => (
        <div key={p.key} className={`pk-col c-${p.color}`} data-reveal="up" style={{ ["--reveal-delay" as string]: `${(packages.length - 1 - k) * 0.15}s` }}>
          <div className="pk-col__logo">
            <img src={p.logo} alt={p.key.toUpperCase()} loading="lazy" />
          </div>
          <div className="pk-col__box">
            <ul className="inst-row" style={{ listStyle: "none", margin: 0 }}>
              {p.instruments.map((it, i) => (
                <Inst key={i} it={it} />
              ))}
            </ul>
            {p.extraTitle && <span className="pk-extra-title" dangerouslySetInnerHTML={{ __html: p.extraTitle }} />}
            {p.extras && (
              <ul className="inst-row" style={{ listStyle: "none", margin: 0 }}>
                {p.extras.map((it, i) => (
                  <Inst key={i} it={it} lg />
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export function AddonsBox({ section }: { section: Addons }) {
  return (
    <section className="addons" data-reveal="up">
      <img className="addons__logo" src={section.logo} alt="KOLOT – turn it up" width={183} height={130} loading="lazy" />
      <h2 className="addons__title" dangerouslySetInnerHTML={{ __html: section.title }} />
      <ul className="addons__list">
        {section.items.map((it) => (
          <li key={it.label}>
            <span>{it.label}</span>
            <span>{it.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PackagesFooter({ section }: { section: Footer }) {
  return (
    <footer className="pk-footer">
      <p dangerouslySetInnerHTML={{ __html: section.note }} />
      <p className="pk-footer__contact" dir="ltr" dangerouslySetInnerHTML={{ __html: section.contact }} />
    </footer>
  );
}
