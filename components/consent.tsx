"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/types";

export const GTM_ID = "GTM-W5DWRFJ6";
const KEY = "kolot-consent-v1";

export type Consent = { necessary: true; analytics: boolean; marketing: boolean; date: string };

type Ctx = { consent: Consent | null; save: (c: Omit<Consent, "necessary" | "date">) => void; open: () => void };
const ConsentCtx = createContext<Ctx>({ consent: null, save: () => {}, open: () => {} });
export const useConsent = () => useContext(ConsentCtx);

function loadGtm() {
  if (document.getElementById("gtm-script")) return;
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

const T = {
  he: {
    title: "האתר משתמש בעוגיות 🍪",
    body: "אנחנו משתמשים בעוגיות הכרחיות כדי שהאתר יעבוד, ובאישורך גם בעוגיות סטטיסטיקה (Google Tag Manager / Analytics) ושיווק כדי לשפר את האתר. אפשר לשנות את הבחירה בכל עת.",
    policy: "למדיניות העוגיות",
    accept: "אישור הכל",
    reject: "רק הכרחיות",
    settings: "הגדרות",
    save: "שמירת הבחירה",
    necessary: "הכרחיות",
    necessaryD: "נדרשות לתפקוד האתר (שמירת הבחירה שלך, הגדרות נגישות).",
    analytics: "סטטיסטיקה",
    analyticsD: "Google Tag Manager / Google Analytics – מדידת שימוש אנונימית.",
    marketing: "שיווק ותוכן מוטמע",
    marketingD: "תוכן מרשתות חברתיות (אינסטגרם) ופרסום ממומן.",
    policyHref: "/cookie-policy/",
  },
  en: {
    title: "This site uses cookies 🍪",
    body: "We use necessary cookies to make the site work and, with your permission, statistics (Google Tag Manager / Analytics) and marketing cookies to improve it. You can change your choice at any time.",
    policy: "Cookie policy",
    accept: "Accept all",
    reject: "Necessary only",
    settings: "Settings",
    save: "Save my choice",
    necessary: "Necessary",
    necessaryD: "Required for the site to work (remembering this choice, accessibility settings).",
    analytics: "Statistics",
    analyticsD: "Google Tag Manager / Google Analytics – anonymous usage measurement.",
    marketing: "Marketing & embedded content",
    marketingD: "Social media embeds (Instagram) and advertising.",
    policyHref: "/en/cookie-policy/",
  },
};

export function ConsentProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const c = JSON.parse(raw) as Consent;
        setConsent(c);
        setDraft({ analytics: c.analytics, marketing: c.marketing });
      } else setShow(true);
    } catch {
      setShow(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (consent?.analytics) loadGtm();
  }, [consent]);

  const save = useCallback((c: Omit<Consent, "necessary" | "date">) => {
    const full: Consent = { necessary: true, ...c, date: new Date().toISOString() };
    setConsent(full);
    setDraft({ analytics: c.analytics, marketing: c.marketing });
    try {
      localStorage.setItem(KEY, JSON.stringify(full));
    } catch {}
    setShow(false);
    setPrefs(false);
    // withdrawing analytics after GTM loaded: reload so the tags are gone
    if (!c.analytics && document.getElementById("gtm-script")) window.location.reload();
  }, []);

  const open = useCallback(() => {
    setShow(true);
    setPrefs(true);
  }, []);

  const t = T[lang];
  return (
    <ConsentCtx.Provider value={{ consent, save, open }}>
      {children}
      {ready && show && (
        <div className="cookie" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
          <div>
            <h2 id="cookie-title">{t.title}</h2>
            <p style={{ margin: 0 }}>
              {t.body} <a href={t.policyHref}>{t.policy}</a>
            </p>
          </div>
          <div className="cookie__actions">
            <button className="cookie__btn" type="button" onClick={() => setPrefs((v) => !v)} aria-expanded={prefs}>
              {t.settings}
            </button>
            <button className="cookie__btn" type="button" onClick={() => save({ analytics: false, marketing: false })}>
              {t.reject}
            </button>
            <button className="cookie__btn cookie__btn--primary" type="button" onClick={() => save({ analytics: true, marketing: true })}>
              {t.accept}
            </button>
          </div>
          {prefs && (
            <div className="cookie__prefs">
              {(
                [
                  ["necessary", t.necessary, t.necessaryD],
                  ["analytics", t.analytics, t.analyticsD],
                  ["marketing", t.marketing, t.marketingD],
                ] as const
              ).map(([k, label, d]) => (
                <div className="cookie__pref" key={k}>
                  <div>
                    <strong>{label}</strong>
                    <small>{d}</small>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      aria-label={label}
                      checked={k === "necessary" ? true : draft[k]}
                      disabled={k === "necessary"}
                      onChange={(e) => k !== "necessary" && setDraft((d0) => ({ ...d0, [k]: e.target.checked }))}
                    />
                    <span />
                  </label>
                </div>
              ))}
              <div className="cookie__actions">
                <button className="cookie__btn cookie__btn--primary" type="button" onClick={() => save(draft)}>
                  {t.save}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </ConsentCtx.Provider>
  );
}

export function CookieSettingsButton({ label }: { label: string }) {
  const { open } = useConsent();
  return (
    <button type="button" onClick={open}>
      {label}
    </button>
  );
}
