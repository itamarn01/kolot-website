"use client";

import { useState } from "react";

export type StepsCopy = {
  go: string;
  copyOnly: string;
  copied: string;
  failed: string;
  steps: [string, string, string];
};

/** Copies inside the click itself (Safari only allows it there); the old execCommand route covers older phones and in-app browsers. */
function copyText(text: string): Promise<boolean> {
  const legacy = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      /* ignore */
    }
    ta.remove();
    return ok;
  };
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).then(() => true, legacy);
  return Promise.resolve(legacy());
}

/**
 * The one big button: copies the couple's own words and opens Google's review form in a new tab,
 * so this page (and its steps) is still there when they come back.
 */
export default function GoogleReviewSteps({ text, href, t }: { text: string; href: string; t: StepsCopy }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = () => void copyText(text).then((ok) => setState(ok ? "copied" : "failed"));
  return (
    <div className="kh-ask__action" data-state={state}>
      <a className="kh-btn kh-btn--primary kh-ask__go" href={href} target="_blank" rel="noopener" onClick={copy}>
        <span aria-hidden>★</span>
        {t.go}
      </a>
      <p className="kh-ask__status" role="status">
        {state === "copied" ? t.copied : state === "failed" ? t.failed : ""}
      </p>
      <ol className="kh-ask__steps">
        {t.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <button type="button" className="kh-ask__copy" onClick={copy}>
        {t.copyOnly}
      </button>
    </div>
  );
}
