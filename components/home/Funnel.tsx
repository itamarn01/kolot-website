"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import PlaceInput from "@/components/PlaceInput";
import { EMPTY_LEAD, FOLLOW_UP_COPY, HEAR_OPTIONS, RELATION_OPTIONS, followUp, toPayloadFields, validPhone, type LeadFields } from "@/lib/lead";
import type { Lang } from "@/lib/types";
import { leadSource } from "@/lib/source";
import { WHATSAPP } from "./copy";
import "@/components/lead-form.css";

/**
 * The homepage "check availability" section. A plain intro (title + one button); the button turns the
 * section into a one-question-per-screen form. Leads go to the same /api/lead endpoint as the site's
 * other form (Zooglot + monday), with the same fields.
 */


type CountdownText = { before: string; after: string; today: string; tomorrow: string };

/**
 * "204 days to go": fades in and the number races up to the real count (easing out, about a second).
 * Picking another date runs from the number shown to the new one.
 */
function Countdown({ days, lang, text }: { days: number; lang: Lang; text: CountdownText }) {
  const [shown, setShown] = useState(0);
  const [landed, setLanded] = useState(false);
  const shownRef = useRef(0);
  useEffect(() => {
    if (days < 2) return;
    const from = shownRef.current;
    if (from === days || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shownRef.current = days;
      setShown(days);
      return;
    }
    setLanded(false);
    const dur = Math.min(1400, 600 + Math.abs(days - from) * 2);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const v = p < 1 ? Math.round(from + (days - from) * (1 - Math.pow(2, -10 * p))) : days;
      shownRef.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setLanded(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [days]);

  if (days < 2) {
    return (
      <p className="kf-countdown" aria-live="polite">
        <span className="kf-countdown__word">{days === 0 ? text.today : text.tomorrow}</span>
      </p>
    );
  }
  return (
    <p className="kf-countdown" aria-live="polite" aria-label={`${text.before} ${days} ${text.after}`}>
      <span className="kf-countdown__word">{text.before}</span>
      <span className={`kf-countdown__num${landed ? " is-landed" : ""}`} aria-hidden="true">
        {shown.toLocaleString(lang === "he" ? "he-IL" : "en-US")}
      </span>
      <span className="kf-countdown__word">{text.after}</span>
    </p>
  );
}

/** Whole days from today to an ISO date (local time). */
function daysUntil(iso: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
}

const T = {
  he: {
    back: "חזרה",
    next: "המשך",
    submit: "בדיקת זמינות",
    stepOf: (a: number, b: number) => `${a} / ${b}`,
    eyebrows: ["רגע לפני שמתחילים", "מזל טוב!", "כמעט שם", "ממש עוד רגע"],
    q: ["איך קוראים לך?", "מתי ואיפה חוגגים?", "רוצים לספר לנו קצת על האירוע?", "מה הטלפון שלך?"],
    name: "שם מלא",
    relation: "ומה הקשר שלך לאירוע?",
    date: "תאריך האירוע",
    noDate: "עוד אין לנו תאריך",
    venue: "איפה? (לא חובה)",
    venuePh: "למשל: האחוזה בית חנן",
    places: "הצעות מיקום",
    multi: "אפשר לבחור כמה",
    phone: "טלפון",
    wa: "שלחו לי אישור עם הפרטים בוואטסאפ",
    privacy: "בלחיצה על ״בדיקת זמינות״ אתם מאשרים שנחזור אליכם בטלפון ובוואטסאפ לגבי הפנייה, בהתאם ל",
    privacyLink: "מדיניות הפרטיות",
    privacyHref: "/privacy-policy/",
    errName: "נשמח לדעת איך לפנות אליך",
    errPhone: "צריך מספר טלפון תקין כדי שנוכל לחזור אליכם",
    sending: ["שולחים את הפרטים…", "מעבירים ללהקה…", "עוד רגע…"],
    doneEyebrow: "קיבלנו",
    doneTitle: (n: string) => `תודה${n ? " " + n : ""}!`,
    doneText: "הפרטים אצלנו. נחזור אליכם בהקדם עם זמינות לתאריך והצעה מותאמת.",
    doneWa: "מעדיפים לדבר עכשיו? וואטסאפ",
    failTitle: "משהו השתבש בשליחה",
    failText: "הפרטים לא אבדו. אפשר לשלוח אותם אלינו בוואטסאפ:",
    failCta: "שליחה בוואטסאפ",
    waPrefill: "היי קולות! פנייה מהאתר:",
    notesPh: "לדוגמא: תקציב, הרכב ספציפי, סגנונות מוזיקליים אהובים, מעוניינים בדיג׳יי...",
    countdown: { before: "עוד", after: "ימים לאירוע 🎉", today: "זה היום! 🎉", tomorrow: "מחר! 🎉" },
    hear: "איך שמעתם עלינו? (לא חובה)",
    referrer: "מי המליץ? (כדי שנוכל להגיד תודה)",
    hearOther: "איפה?",
    close: "סגירה",
    talk: "מעדיפים לדבר ישירות?",
  },
  en: {
    back: "Back",
    next: "Continue",
    submit: "Check availability",
    stepOf: (a: number, b: number) => `${a} / ${b}`,
    eyebrows: ["Before we start", "Mazal tov!", "Almost there", "One last thing"],
    q: ["What's your name?", "When and where is the party?", "Want to tell us a bit about the event?", "What's your phone number?"],
    name: "Full name",
    relation: "And how are you related to the event?",
    date: "Event date",
    noDate: "We don't have a date yet",
    venue: "Where? (optional)",
    venuePh: "e.g. Tuscany, Italy",
    places: "location suggestions",
    multi: "Pick as many as you like",
    phone: "Phone",
    wa: "Send me a confirmation with my details on WhatsApp",
    privacy: "By tapping “Check availability” you agree that we may contact you by phone and WhatsApp about your request, under our ",
    privacyLink: "privacy policy",
    privacyHref: "/en/privacy-policy/",
    errName: "We'd love to know what to call you",
    errPhone: "We need a valid phone number to get back to you",
    sending: ["Sending your details…", "Passing them to the band…", "Almost there…"],
    doneEyebrow: "Got it",
    doneTitle: (n: string) => `Thank you${n ? ", " + n : ""}!`,
    doneText: "We have your details and will get back to you soon with availability and a tailored proposal.",
    doneWa: "Rather talk now? WhatsApp",
    failTitle: "Something went wrong",
    failText: "Your details aren't lost. Send them to us on WhatsApp:",
    failCta: "Send on WhatsApp",
    waPrefill: "Hi KOLOT! A request from the website:",
    notesPh: "For example: budget, a specific line-up, music styles you love, interested in a DJ...",
    countdown: { before: "That's", after: "days away 🎉", today: "That's today! 🎉", tomorrow: "That's tomorrow! 🎉" },
    hear: "How did you hear about us? (optional)",
    referrer: "Who recommended us? (so we can say thank you)",
    hearOther: "Where?",
    close: "Close",
    talk: "Rather talk to us directly?",
  },
};

const STEPS = 4;
type Phase = "intro" | "form" | "sending" | "done" | "fail";

export default function AvailabilitySection({
  lang,
  eyebrow,
  title,
  text,
  cta,
  startOpen = false,
}: {
  lang: Lang;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  /** skip the intro and open on the first question (the /contact page) */
  startOpen?: boolean;
}) {
  const t = T[lang];
  const [phase, setPhase] = useState<Phase>(startOpen ? "form" : "intro");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [f, setF] = useState<LeadFields>(EMPTY_LEAD);
  const [noDate, setNoDate] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof LeadFields>(k: K, v: LeadFields[K]) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (startOpen) startedAt.current = Date.now();
  }, [startOpen]);

  // Focus the new question so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (phase === "intro") return;
    headRef.current?.focus({ preventScroll: true });
  }, [phase, step]);

  // Rotate the "sending" messages.
  useEffect(() => {
    if (phase !== "sending") return;
    const id = setInterval(() => setTick((x) => x + 1), 900);
    return () => clearInterval(id);
  }, [phase]);

  const start = () => {
    startedAt.current = Date.now();
    setPhase("form");
    setStep(0);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const go = (to: number) => {
    setErr(null);
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const validate = (): string | null => {
    if (step === 0 && !f.contact_name.trim()) return t.errName;
    if (step === 3 && !validPhone(f.phone1)) return t.errPhone;
    return null;
  };

  const onNext = (e?: FormEvent) => {
    e?.preventDefault();
    const bad = validate();
    if (bad) {
      setErr(bad);
      rootRef.current?.querySelector<HTMLInputElement>(".kf-q input")?.focus();
      return;
    }
    if (step < STEPS - 1) go(step + 1);
    else submit();
  };

  const payload = () => {
    const fields = toPayloadFields({ ...f, event_date: noDate ? "" : f.event_date });
    return fields;
  };

  const waLink = () => {
    const p = payload();
    const lines = [p.contact_name, p.relation, p.event_date && p.event_date.split("-").reverse().join("/"), p.event_location, p.phone1, p.notes].filter(Boolean);
    return `${WHATSAPP}?text=${encodeURIComponent([t.waPrefill, ...lines].join("\n"))}`;
  };

  async function submit() {
    setPhase("sending");
    setTick(0);
    // Wait at least ~1.8s: the endpoint rejects instant submissions, and the short pause reads as care, not lag.
    const minWait = new Promise((r) => setTimeout(r, 1800));
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          page: `${decodeURI(window.location.pathname)} · ${document.title.split(" – ")[0]}`,
          fields: payload(),
          whatsapp_consent: f.whatsapp_consent,
          company: honeypot.current?.value || "",
          started_at: startedAt.current,
          source: leadSource(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      await minWait;
      if (!res.ok || !data.ok) throw new Error("failed");
      setPhase("done");
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer?.push({ event: "generate_lead", form: "homepage-funnel", lang });
    } catch {
      await minWait;
      setPhase("fail");
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const firstName = f.contact_name.trim().split(/\s+/)[0] || "";

  return (
    <div ref={rootRef} className={`kf kf--${phase}`}>
      {phase === "intro" && (
        <div className="kh-wrap kh-cta__in kf-intro">
          <p className="kh-label kh-accent">{eyebrow}</p>
          <h2 className="kh-display-xl">{title}</h2>
          <p className="kh-body-l kh-muted">{text}</p>
          <div className="kh-cta__actions">
            <button type="button" className="kh-btn kh-btn--primary" onClick={start}>
              {cta}
            </button>
          </div>
        </div>
      )}

      {phase === "form" && (
        <form className="kf-form kh-wrap" noValidate onSubmit={onNext}>
          <div className="kf-top">
            {step > 0 ? (
              <button type="button" className="kf-back" onClick={() => go(step - 1)}>
                {lang === "he" ? "→" : "←"} {t.back}
              </button>
            ) : startOpen ? (
              <span />
            ) : (
              <button type="button" className="kf-back" onClick={() => setPhase("intro")}>
                {lang === "he" ? "→" : "←"} {t.back}
              </button>
            )}
            <div className="kf-dashes" aria-label={t.stepOf(step + 1, STEPS)}>
              {Array.from({ length: STEPS }).map((_, i) => (
                <span key={i} className={i <= step ? "is-on" : ""} />
              ))}
            </div>
          </div>

          {/* hidden from people, tempting for bots */}
          <div className="kf-hp" aria-hidden>
            <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
          </div>

          <div key={step} className={`kf-q kf-q--${dir > 0 ? "fwd" : "back"}`}>
            <p className="kh-label kh-muted">{t.eyebrows[step]}</p>
            <h3 ref={headRef} tabIndex={-1} className="kh-display-l kf-title">
              {t.q[step]}
            </h3>

            {step === 0 && (
              <>
                <input
                  className="kf-input"
                  name="contact_name"
                  autoComplete="name"
                  placeholder={t.name}
                  aria-label={t.name}
                  value={f.contact_name}
                  onChange={(e) => set("contact_name", e.target.value)}
                  autoFocus
                />
                <fieldset className="kf-chips kf-chips--row">
                  <legend>{t.relation}</legend>
                  {RELATION_OPTIONS.map((o) => (
                    <button type="button" key={o.value} className={f.relation === o.value ? "is-on" : ""} aria-pressed={f.relation === o.value} onClick={() => set("relation", f.relation === o.value ? "" : o.value)}>
                      {o[lang]}
                    </button>
                  ))}
                </fieldset>
                {(() => {
                  const k = followUp(f.relation);
                  if (!k) return null;
                  const q = FOLLOW_UP_COPY[lang][k];
                  const key = k === "celebration" ? "celebration" : "partner_name";
                  return (
                    <label key={k} className="kf-field kf-reveal kf-follow">
                      <span>{q.label}</span>
                      <input
                        className="kf-input kf-input--small"
                        placeholder={q.placeholder}
                        value={f[key]}
                        maxLength={k === "celebration" ? 200 : 120}
                        autoComplete="off"
                        onChange={(e) => set(key, e.target.value)}
                      />
                    </label>
                  );
                })()}
              </>
            )}

            {step === 1 && (
              <>
                <div className="kf-row">
                  <label className="kf-field">
                    <span>{t.date}</span>
                    <input className="kf-input" type="date" aria-label={t.date} min={today} value={noDate ? "" : f.event_date} disabled={noDate} onChange={(e) => set("event_date", e.target.value)} />
                  </label>
                  <div className="kf-field">
                    <label htmlFor="kf-venue">{t.venue}</label>
                    <PlaceInput
                      id="kf-venue"
                      name="event_location"
                      value={f.event_location}
                      placeholder={t.venuePh}
                      listLabel={t.places}
                      onType={(v) => setF((p) => ({ ...p, event_location: v, event_lat: "", event_lng: "" }))}
                      onPick={(pl) => setF((p) => ({ ...p, event_location: pl.label, event_lat: String(pl.lat), event_lng: String(pl.lon) }))}
                    />
                  </div>
                </div>
                {(() => {
                  const d = noDate ? null : daysUntil(f.event_date);
                  return d !== null && d >= 0 ? (
                    <Countdown days={d} lang={lang} text={t.countdown} />
                  ) : null;
                })()}
                <label className="kf-check">
                  <input type="checkbox" checked={noDate} onChange={(e) => setNoDate(e.target.checked)} />
                  <span>{t.noDate}</span>
                </label>
              </>
            )}

            {step === 2 && (
              <textarea
                className="kf-input kf-textarea"
                name="notes"
                rows={4}
                maxLength={2000}
                placeholder={t.notesPh}
                aria-label={t.q[2]}
                value={f.notes}
                onChange={(e) => set("notes", e.target.value)}
                autoFocus
              />
            )}

            {step === 3 && (
              <>
                <input
                  className="kf-input"
                  name="phone1"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  placeholder={lang === "he" ? "050-0000000" : "+1 212 555 0100"}
                  aria-label={t.phone}
                  value={f.phone1}
                  onChange={(e) => set("phone1", e.target.value)}
                  autoFocus
                />
                <label className="kf-check">
                  <input type="checkbox" checked={f.whatsapp_consent} onChange={(e) => set("whatsapp_consent", e.target.checked)} />
                  <span>{t.wa}</span>
                </label>
                <fieldset className="kf-chips kf-chips--small">
                  <legend>{t.hear}</legend>
                  {HEAR_OPTIONS.map((o) => (
                    <button type="button" key={o.value} className={f.hear_about_us === o.value ? "is-on" : ""} aria-pressed={f.hear_about_us === o.value} onClick={() => set("hear_about_us", f.hear_about_us === o.value ? "" : o.value)}>
                      {o[lang]}
                    </button>
                  ))}
                </fieldset>
                {f.hear_about_us === "המלצה" && (
                  <input className="kf-input kf-input--small kf-reveal" placeholder={t.referrer} aria-label={t.referrer} value={f.referrer} maxLength={120} onChange={(e) => set("referrer", e.target.value)} />
                )}
                {f.hear_about_us === "אחר" && (
                  <input className="kf-input kf-input--small kf-reveal" placeholder={t.hearOther} aria-label={t.hearOther} value={f.hear_other} maxLength={120} onChange={(e) => set("hear_other", e.target.value)} />
                )}
                <p className="kf-privacy">
                  {t.privacy}
                  <a href={t.privacyHref}>{t.privacyLink}</a>.
                </p>
              </>
            )}

            {err && (
              <p className="kf-error" role="alert">
                {err}
              </p>
            )}
          </div>

          <div className="kf-bottom">
            <button type="submit" className="kh-btn kh-btn--primary kf-next">
              {step === STEPS - 1 ? t.submit : t.next}
            </button>
            <a className="kf-talk" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              {t.talk}
            </a>
          </div>
        </form>
      )}

      {phase === "sending" && (
        <div className="kh-wrap kf-status" aria-live="polite">
          <span className="kf-pulse" aria-hidden />
          <p className="kh-display-m">{t.sending[Math.min(tick, t.sending.length - 1)]}</p>
        </div>
      )}

      {phase === "done" && (
        <div className="kh-wrap kf-status" aria-live="polite">
          <p className="kh-label kh-accent">{t.doneEyebrow}</p>
          <h3 ref={headRef} tabIndex={-1} className="kh-display-xl">
            {t.doneTitle(firstName)}
          </h3>
          <p className="kh-body-l kh-muted">{t.doneText}</p>
          <a className="kh-btn kh-btn--outline" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            {t.doneWa}
          </a>
        </div>
      )}

      {phase === "fail" && (
        <div className="kh-wrap kf-status" role="alert">
          <h3 ref={headRef} tabIndex={-1} className="kh-display-l">
            {t.failTitle}
          </h3>
          <p className="kh-body-l kh-muted">{t.failText}</p>
          <div className="kh-cta__actions">
            <a className="kh-btn kh-btn--primary" href={waLink()} target="_blank" rel="noopener noreferrer">
              {t.failCta}
            </a>
            <button type="button" className="kh-btn kh-btn--outline" onClick={() => setPhase("form")}>
              {t.back}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
