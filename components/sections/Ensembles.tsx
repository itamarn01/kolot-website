import type { Brand } from "@/lib/types";

const RING: Record<Brand, string> = {
  cyan: "/media/ellipse-7.svg",
  orange: "/media/ellipse-8.svg",
  yellow: "/media/ellipse-10.svg",
};
const GLOW: Record<Brand, string> = { cyan: "#87cede", orange: "#f08354", yellow: "#f7c11e" };

type Item = { label: string; href: string; icon: string | null; ring: Brand };

export default function Ensembles({ items, flush }: { items: Item[]; flush?: boolean }) {
  return (
    <nav className={`section ensembles${flush ? " section--flush" : ""}`} aria-label="KOLOT ensembles" style={{ marginTop: flush ? 30 : undefined }}>
      {items.map((it, k) => (
        <a
          key={it.href}
          className="ensemble"
          href={it.href}
          data-reveal="up"
          style={{ ["--ring" as string]: `url("${RING[it.ring]}")`, ["--glow" as string]: GLOW[it.ring], ["--reveal-delay" as string]: `${k * 0.1}s` }}
        >
          <span className="ensemble__ring">{it.icon && <img src={it.icon} alt="" loading="lazy" />}</span>
          <span className="ensemble__label" dangerouslySetInnerHTML={{ __html: it.label }} />
        </a>
      ))}
    </nav>
  );
}
