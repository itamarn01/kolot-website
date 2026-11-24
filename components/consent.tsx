"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/types";

export const GTM_ID = "GTM-W5DWRFJ6";
const KEY = "kolot-consent-v1";
/** Pages that never show the notice: /contact (the Instagram bio link) and /r/<id> (a couple's "post it on Google"
 * page) are one-job pages and the notice covered their main button. Without a choice only necessary storage is used, so nothing non-essential loads there. */
const QUIET = /^\/(en\/)?(contact|r\/[^/]+)\/?$/;

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
    body: "האתר משתמש בעוגיות",
    policy: "פרטים",
    accept: "אישור",
    reject: "רק הכרחיות",
    settings: "הגדרות",
    save: "שמירה",
    necessary: "הכרחיות",
    analytics: "סטטיסטיקה",
    marketing: "שיווק",
    policyHref: "/cookie-policy/",
  },
  en: {
    body: "This site uses cookies",
    policy: "Details",
    accept: "Accept",
    reject: "Necessary only",
    settings: "Settings",
    save: "Save",
    necessary: "Necessary",
    analytics: "Statistics",
    marketing: "Marketing",
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
      } else if (!QUIET.test(location.pathname)) setShow(true);
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
        <div className="cookie" role="dialog" aria-modal="false" aria-labelledby="cookie-title" dir={lang === "he" ? "rtl" : "ltr"} lang={lang}>
          <p className="cookie__text" id="cookie-title">
            {t.body} · <a href={t.policyHref}>{t.policy}</a>
          </p>
          <div className="cookie__actions">
            <button className="cookie__btn cookie__btn--primary" type="button" onClick={() => save({ analytics: true, marketing: true })}>
              {t.accept}
            </button>
            <button className="cookie__btn" type="button" onClick={() => save({ analytics: false, marketing: false })}>
              {t.reject}
            </button>
            <button className="cookie__link" type="button" onClick={() => setPrefs((v) => !v)} aria-expanded={prefs}>
              {t.settings}
            </button>
          </div>
          {prefs && (
            <div className="cookie__prefs">
              {(
                [
                  ["necessary", t.necessary],
                  ["analytics", t.analytics],
                  ["marketing", t.marketing],
                ] as const
              ).map(([k, label]) => (
                <div className="cookie__pref" key={k}>
                  <strong>{label}</strong>
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
