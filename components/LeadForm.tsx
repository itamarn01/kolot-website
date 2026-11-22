"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import {
  EMPTY_LEAD,
  FORM_BG_IMAGES,
  FORM_BG_VIDEO,
  FORM_COPY,
  HEAR_OPTIONS,
  RELATION_OPTIONS,
  toPayloadFields,
  validEmail,
  validPhone,
  type LeadFields,
} from "@/lib/lead";
import { CONTACT } from "@/lib/site";
import type { Lang } from "@/lib/types";
import PlaceInput from "./PlaceInput";
import "./lead-form.css";

const DRAFT_KEY = "kolot-lead-draft-v1";
const STEPS = 4;
type Status = "idle" | "sending" | "done" | "fail";

function Chips({
  name,
  legend,
  options,
  value,
  lang,
  onPick,
}: {
  name: string;
  legend: string;
  options: { value: string; he: string; en: string }[];
  value: string;
  lang: Lang;
  onPick: (v: string) => void;
}) {
  return (
    <fieldset className="lf-chips">
      <legend className="lf-label">{legend}</legend>
      <div className="lf-chiprow">
        {options.map((o) => (
          <label key={o.value} className={`lf-chip${value === o.value ? " is-on" : ""}`}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onPick(o.value)} />
            <span>{o[lang]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function LeadForm({ lang, worldwide = false }: { lang: Lang; worldwide?: boolean }) {
  const t = FORM_COPY[lang];
  const pathname = usePathname();
  const [f, setF] = useState<LeadFields>(EMPTY_LEAD);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waSent, setWaSent] = useState(false);
  const [restored, setRestored] = useState(false);
  const [slide, setSlide] = useState(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number>(0);
  const headRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  // restore a half-filled form (people often come back after checking a date with their partner)
  useEffect(() => {
    startedAt.current = Date.now();
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && typeof d === "object" && (d.contact_name || d.phone1)) {
          setF({ ...EMPTY_LEAD, ...d });
          setRestored(true);
        }
      }
    } catch {}
  }, []);
  useEffect(() => {
    if (status === "done") return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(f));
      } catch {}
    }, 400);
    return () => clearTimeout(id);
  }, [f, status]);

  // background stills crossfade (until there is a video)
  useEffect(() => {
    if (FORM_BG_VIDEO) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % FORM_BG_IMAGES.length), 7000);
    return () => clearInterval(id);
  }, []);

  // move focus to the new step's title (keyboard / screen-reader users land in the right place)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: true });
    // if the card's top went above the screen (long step on a phone), bring it back into view
    const card = formRef.current?.closest(".lead-card") || headRef.current?.closest(".lead-card");
    if (card) {
      const top = card.getBoundingClientRect().top;
      if (top < 70 || top > window.innerHeight * 0.6) window.scrollBy({ top: top - 90, behavior: "smooth" });
    }
  }, [step, status]);

  const set = <K extends keyof LeadFields>(k: K, v: LeadFields[K]) => setF((p) => ({ ...p, [k]: v }));

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!f.contact_name.trim()) e.contact_name = t.errors.contact_name;
    if (!validPhone(f.phone1)) e.phone1 = t.errors.phone1;
    if (f.email.trim() && !validEmail(f.email)) e.email = t.errors.email;
    return e;
  }, [f, t]);

  const stepFields: Record<number, string[]> = { 0: ["contact_name"], 1: [], 2: ["phone1", "email"], 3: [] };
  const err = (k: string) => (touched[k] ? errors[k] : undefined);

  const go = (to: number) => {
    setDir(to > step ? "fwd" : "back");
    setStep(to);
  };

  const next = () => {
    const bad = stepFields[step].filter((k) => errors[k]);
    if (bad.length) {
      setTouched((p) => ({ ...p, ...Object.fromEntries(bad.map((k) => [k, true])) }));
      formRef.current?.querySelector<HTMLElement>(`[name="${bad[0]}"]`)?.focus();
      return;
    }
    if (step < STEPS - 1) go(step + 1);
    else submit();
  };

  const onKey = (e: KeyboardEvent<HTMLFormElement>) => {
    const el = e.target as HTMLElement;
    if (e.key === "Enter" && el.tagName === "INPUT" && (el as HTMLInputElement).type !== "checkbox") {
      e.preventDefault();
      next();
    }
  };

  const fieldsForWa = () => {
    const p = toPayloadFields(f);
    const L = lang === "he"
      ? { n: "שם", r: "קרבה", d: "תאריך", l: "מיקום", p: "טלפון", e: "מייל" }
      : { n: "Name", r: "Relation", d: "Date", l: "Location", p: "Phone", e: "Email" };
    const lines = [
      p.contact_name && `${L.n}: ${p.contact_name}`,
      p.relation && `${L.r}: ${p.relation}`,
      p.event_date && `${L.d}: ${p.event_date.split("-").reverse().join("/")}`,
      p.event_location && `${L.l}: ${p.event_location}`,
      p.phone1 && `${L.p}: ${p.phone1}`,
      p.email && `${L.e}: ${p.email}`,
      p.notes,
    ].filter(Boolean);
    return `https://wa.me/${CONTACT.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent([t.waPrefill, ...lines].join("\n"))}`;
  };

  async function submit() {
    if (Object.keys(errors).length) {
      const firstBad = Object.keys(errors)[0];
      setTouched((p) => ({ ...p, [firstBad]: true }));
      go(firstBad === "contact_name" ? 0 : 2);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          page: decodeURI(pathname || "/") + (worldwide ? " · Worldwide" : ""),
          fields: toPayloadFields(f),
          whatsapp_consent: f.whatsapp_consent,
          company: honeypot.current?.value || "",
          started_at: startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      setWaSent(data.whatsapp === "sent");
      setStatus("done");
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer?.push({ event: "generate_lead", form: worldwide ? "worldwide" : "contact", lang });
    } catch {
      setStatus("fail");
    }
  }

  const reset = () => {
    setF(EMPTY_LEAD);
    setTouched({});
    setStep(0);
    setStatus("idle");
    setRestored(false);
    startedAt.current = Date.now();
  };

  const progress = status === "done" ? 100 : Math.round((step / STEPS) * 100) + 8;
  const firstName = f.contact_name.trim().split(/\s+/)[0] || "";

  const field = (
    name: keyof LeadFields,
    opts: { type?: string; autoComplete?: string; inputMode?: "tel" | "email" | "text"; optional?: boolean; dirLtr?: boolean; min?: string } = {},
  ) => {
    const id = `lf-${name}`;
    const hint = t.hints[name];
    const e = err(name);
    return (
      <div className={`lf-field${e ? " has-error" : ""}`}>
        <label className="lf-label" htmlFor={id}>
          {t.labels[name]}
          {opts.optional && <span className="lf-opt"> ({t.optional})</span>}
        </label>
        <input
          id={id}
          name={name}
          type={opts.type || "text"}
          autoComplete={opts.autoComplete}
          inputMode={opts.inputMode}
          dir={opts.dirLtr ? "ltr" : undefined}
          min={opts.min}
          value={String(f[name])}
          placeholder={t.placeholders[name]}
          aria-invalid={e ? true : undefined}
          aria-describedby={[hint && `${id}-hint`, e && `${id}-err`].filter(Boolean).join(" ") || undefined}
          onChange={(ev) => set(name, ev.target.value as never)}
          onBlur={() => String(f[name]).trim() && setTouched((p) => ({ ...p, [name]: true }))}
          className="lf-input"
        />
        {hint && !e && (
          <p id={`${id}-hint`} className="lf-hint">
            {hint}
          </p>
        )}
        {e && (
          <p id={`${id}-err`} className="lf-error" role="alert">
            {e}
          </p>
        )}
      </div>
    );
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="lead" aria-labelledby="lead-title" dir={lang === "he" ? "rtl" : "ltr"} lang={lang}>
      <div className="lead-bg" aria-hidden>
        {FORM_BG_VIDEO ? (
          <video src={FORM_BG_VIDEO} poster={FORM_BG_IMAGES[0]} autoPlay muted loop playsInline />
        ) : (
          FORM_BG_IMAGES.map((src, i) => <div key={src} className={`lead-slide${i === slide ? " is-on" : ""}`} style={{ backgroundImage: `url("${src}")` }} />)
        )}
      </div>
      <div className="lead-shade" aria-hidden />

      <div className="lead-inner">
        <div className="lead-intro" data-reveal="up">
          <h2 id="lead-title" className="lead-title">
            {worldwide ? t.titleIntl : t.title}
          </h2>
          <p className="lead-sub">{t.sub}</p>
          <ul className="lead-trust">
            {t.trust.map((x) => (
              <li key={x}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="lead-card" data-reveal="up" style={{ ["--reveal-delay" as string]: ".15s" }}>
          <div className="lf-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={t.stepOf(step + 1, STEPS)}>
            <span style={{ width: `${progress}%` }} />
          </div>

          {status === "done" ? (
            <div className="lf-done" aria-live="polite">
              <div className="lf-burst" aria-hidden>
                {Array.from({ length: 14 }).map((_, i) => (
                  <i key={i} style={{ ["--i" as string]: i }} />
                ))}
              </div>
              <svg className="lf-check" viewBox="0 0 52 52" aria-hidden>
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l7 7 15-16" />
              </svg>
              <h3 ref={headRef} tabIndex={-1} className="lf-done-title">
                {t.successTitle(firstName)}
              </h3>
              <p className="lf-done-text">{waSent ? t.successWa : t.successNoWa}</p>
              <div className="lf-actions lf-actions--center">
                <a className="lf-btn lf-btn--wa" href={`https://wa.me/${CONTACT.phoneHref.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  {t.successCta}
                </a>
                <button type="button" className="lf-link" onClick={reset}>
                  {t.again}
                </button>
              </div>
            </div>
          ) : status === "fail" ? (
            <div className="lf-done" role="alert">
              <h3 ref={headRef} tabIndex={-1} className="lf-done-title">
                {t.failTitle}
              </h3>
              <p className="lf-done-text">{t.failText}</p>
              <div className="lf-actions lf-actions--center">
                <a className="lf-btn lf-btn--wa" href={fieldsForWa()} target="_blank" rel="noopener noreferrer">
                  {t.failCta}
                </a>
                <button type="button" className="lf-link" onClick={() => setStatus("idle")}>
                  {t.back}
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={(e) => (e.preventDefault(), next())} onKeyDown={onKey}>
              <div className="lf-head">
                <span className="lf-stepof">{t.stepOf(step + 1, STEPS)}</span>
                <h3 ref={headRef} tabIndex={-1} className="lf-title">
                  {t.steps[step]}
                </h3>
                {restored && step === 0 && <p className="lf-restored">{t.draft}</p>}
              </div>

              {/* hidden from people, tempting for bots */}
              <div className="lf-hp" aria-hidden>
                <label>
                  Company <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div key={step} className={`lf-step lf-step--${dir}`}>
                {step === 0 && (
                  <>
                    {field("contact_name", { autoComplete: "name" })}
                    <Chips name="relation" legend={t.labels.relation} options={RELATION_OPTIONS} value={f.relation} lang={lang} onPick={(v) => set("relation", v)} />
                    {f.relation === "אחר" && (
                      <div className="lf-reveal">
                        {field("relation_other", { optional: true })}
                      </div>
                    )}
                  </>
                )}
                {step === 1 && (
                  <>
                    {field("event_date", { type: "date", optional: true, min: today })}
                    <div className="lf-field">
                      <label className="lf-label" htmlFor="lf-event_location">
                        {t.labels.event_location}
                        <span className="lf-opt"> ({t.optional})</span>
                      </label>
                      <PlaceInput
                        id="lf-event_location"
                        name="event_location"
                        value={f.event_location}
                        placeholder={t.placeholders.event_location}
                        describedBy="lf-event_location-hint"
                        listLabel={t.placesLabel}
                        onType={(v) => setF((p) => ({ ...p, event_location: v, event_lat: "", event_lng: "" }))}
                        onPick={(pl) => setF((p) => ({ ...p, event_location: pl.label, event_lat: String(pl.lat), event_lng: String(pl.lon) }))}
                      />
                      <p id="lf-event_location-hint" className="lf-hint">
                        {t.hints.event_location}
                      </p>
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    {field("phone1", { type: "tel", autoComplete: "tel", inputMode: "tel", dirLtr: true })}
                    {field("email", { type: "email", autoComplete: "email", inputMode: "email", optional: true, dirLtr: true })}
                    <label className="lf-check-line">
                      <input type="checkbox" checked={f.whatsapp_consent} onChange={(e) => set("whatsapp_consent", e.target.checked)} />
                      <span className="lf-box" aria-hidden>
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12.5l4.2 4.2L19 7" />
                        </svg>
                      </span>
                      <span>{t.labels.whatsapp_consent}</span>
                    </label>
                  </>
                )}
                {step === 3 && (
                  <>
                    <Chips name="hear_about_us" legend={t.labels.hear_about_us} options={HEAR_OPTIONS} value={f.hear_about_us} lang={lang} onPick={(v) => set("hear_about_us", v)} />
                    {f.hear_about_us === "המלצה" && <div className="lf-reveal">{field("referrer", { optional: true })}</div>}
                    {f.hear_about_us === "אחר" && <div className="lf-reveal">{field("hear_other", { optional: true })}</div>}
                    <div className="lf-field">
                      <label className="lf-label" htmlFor="lf-notes">
                        {t.labels.notes}
                        <span className="lf-opt"> ({t.optional})</span>
                      </label>
                      <textarea
                        id="lf-notes"
                        name="notes"
                        rows={3}
                        maxLength={2000}
                        className="lf-input lf-textarea"
                        placeholder={t.placeholders.notes}
                        value={f.notes}
                        onChange={(e) => set("notes", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="lf-actions">
                {step > 0 && (
                  <button type="button" className="lf-btn lf-btn--ghost" onClick={() => go(step - 1)}>
                    {t.back}
                  </button>
                )}
                <button type="submit" className="lf-btn lf-btn--primary" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <span className="lf-spin" aria-hidden /> {t.sending}
                    </>
                  ) : step === STEPS - 1 ? (
                    t.submit
                  ) : (
                    <>
                      {t.next[step]} <i aria-hidden className="lf-arrow">→</i>
                    </>
                  )}
                </button>
              </div>

              <p className="lf-privacy">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" />
                </svg>
                {t.privacy} <a href={t.privacyHref}>{t.privacyLink}</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
