"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type PickedPlace = { label: string; lat: number; lon: number };
type Suggestion = PickedPlace & { title: string; where: string };

/**
 * Text field with venue / city suggestions while typing (WAI-ARIA 1.2 combobox, list autocomplete).
 * Free text still works – picking a suggestion only adds its coordinates.
 * The list is in the page flow (not a floating popup) so it is never clipped by the card on a phone.
 */
export default function PlaceInput({
  id,
  name,
  value,
  placeholder,
  describedBy,
  listLabel,
  onType,
  onPick,
}: {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  describedBy?: string;
  listLabel: string;
  onType: (text: string) => void;
  onPick: (p: PickedPlace) => void;
}) {
  const listId = useId();
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const query = useRef<string | null>(null); // the text to search for; null = don't search (just picked / restored)
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.current;
    if (q === null) return;
    if (q.trim().length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }
    const t = setTimeout(async () => {
      abort.current?.abort();
      const ac = new AbortController();
      abort.current = ac;
      try {
        const res = await fetch(`/api/places/?q=${encodeURIComponent(q.trim())}`, { signal: ac.signal });
        const data = await res.json();
        const list: Suggestion[] = (data?.places || []).slice(0, 5);
        setItems(list);
        setActive(-1);
        setOpen(list.length > 0);
      } catch {
        /* offline / aborted – the field still works as plain text */
      }
    }, 260);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => () => abort.current?.abort(), []);

  const pick = (s: Suggestion) => {
    query.current = null;
    setOpen(false);
    setItems([]);
    setActive(-1);
    onPick({ label: s.label, lat: s.lat, lon: s.lon });
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => {
        const n = a + d;
        if (n < -1) return items.length - 1;
        if (n >= items.length) return -1;
        return n;
      });
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      e.stopPropagation(); // don't move to the next step
      pick(items[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }
  };

  const expanded = open && items.length > 0;

  return (
    <div className="lf-place">
      <input
        id={id}
        name={name}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        className="lf-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          query.current = e.target.value;
          onType(e.target.value);
        }}
        onKeyDown={onKey}
        onFocus={() => items.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />
      <ul id={listId} role="listbox" aria-label={listLabel} className="lf-places" hidden={!expanded}>
        {items.map((s, i) => (
          <li
            key={`${s.label}-${i}`}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            className={`lf-place-opt${i === active ? " is-active" : ""}`}
            onMouseDown={(e) => e.preventDefault()} // keep focus in the field
            onClick={() => pick(s)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            <span className="lf-place-txt">
              <span className="lf-place-title">{s.title}</span>
              {s.where && <span className="lf-place-where">{s.where}</span>}
            </span>
          </li>
        ))}
      </ul>
      <span className="visually-hidden" aria-live="polite">
        {expanded ? `${items.length} ${listLabel}` : ""}
      </span>
    </div>
  );
}
