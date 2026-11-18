export default function Joy({ html, image }: { html: string; image: string }) {
  return (
    <section className="section joy" aria-label={html.replace(/<[^>]+>/g, " ")}>
      <div className="joy__image" style={{ backgroundImage: `url("${image}")` }} data-reveal="left" role="img" aria-label="KOLOT saxophone player on stage" />
      <div className="joy__panel" data-reveal="grow-r" aria-hidden />
      <p className="joy__text" lang="en" data-reveal="right" style={{ ["--reveal-delay" as string]: ".45s" }} dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
