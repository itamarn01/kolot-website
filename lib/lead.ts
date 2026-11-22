import type { Lang } from "./types";

/**
 * Contact form – same fields as the Zooglot "מזל טוב!!" forms.
 * Option VALUES are what the CRM stores (always Hebrew, so the board's chips/filters keep working);
 * the visitor sees the label in their language.
 */
export type LeadFields = {
  contact_name: string;
  relation: string;
  relation_other: string;
  event_date: string;
  event_location: string;
  /** coordinates of the suggestion the visitor picked (empty if typed freely) */
  event_lat: string;
  event_lng: string;
  phone1: string;
  email: string;
  whatsapp_consent: boolean;
  hear_about_us: string;
  hear_other: string;
  referrer: string;
  notes: string;
};

export const EMPTY_LEAD: LeadFields = {
  contact_name: "",
  relation: "",
  relation_other: "",
  event_date: "",
  event_location: "",
  event_lat: "",
  event_lng: "",
  phone1: "",
  email: "",
  whatsapp_consent: true,
  hear_about_us: "",
  hear_other: "",
  referrer: "",
  notes: "",
};

export const RELATION_OPTIONS = [
  { value: "כלה", he: "כלה", en: "Bride" },
  { value: "חתן", he: "חתן", en: "Groom" },
  { value: "הורה", he: "הורה", en: "Parent" },
  { value: "מפיק/ה", he: "מפיק/ה", en: "Producer" },
  { value: "אחר", he: "אחר", en: "Other" },
];

export const HEAR_OPTIONS = [
  { value: "Instagram", he: "Instagram", en: "Instagram" },
  { value: "Facebook", he: "Facebook", en: "Facebook" },
  { value: "Youtube", he: "YouTube", en: "YouTube" },
  { value: "ניגנתם אצל חברים", he: "ניגנתם אצל חברים", en: "You played at a friend's event" },
  { value: "המלצה", he: "המלצה", en: "Recommendation" },
  { value: "גוגל", he: "גוגל", en: "Google" },
  { value: "אחר", he: "אחר", en: "Other" },
];

export const phoneDigits = (s: string) => s.replace(/\D/g, "");
/** Israeli or international number: 9–15 digits once formatting is stripped. */
export const validPhone = (s: string) => {
  const d = phoneDigits(s);
  return d.length >= 9 && d.length <= 15;
};
export const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** What the server sends on to Zooglot: "Other" free text replaces the chip value, like the Zooglot form does. */
export function toPayloadFields(f: LeadFields) {
  const relation = f.relation === "אחר" && f.relation_other.trim() ? f.relation_other.trim() : f.relation;
  const hear = f.hear_about_us === "אחר" && f.hear_other.trim() ? f.hear_other.trim() : f.hear_about_us;
  return {
    contact_name: f.contact_name.trim(),
    relation,
    event_date: f.event_date,
    event_location: f.event_location.trim(),
    event_lat: f.event_location.trim() ? f.event_lat : "",
    event_lng: f.event_location.trim() ? f.event_lng : "",
    phone1: f.phone1.trim(),
    email: f.email.trim(),
    hear_about_us: hear,
    referrer: f.hear_about_us === "המלצה" ? f.referrer.trim() : "",
    notes: f.notes.trim(),
  };
}

export const FORM_COPY: Record<
  Lang,
  {
    title: string;
    titleIntl: string;
    sub: string;
    trust: string[];
    stepOf: (a: number, b: number) => string;
    steps: string[];
    optional: string;
    labels: Record<string, string>;
    hints: Record<string, string>;
    placeholders: Record<string, string>;
    errors: Record<string, string>;
    next: string[];
    back: string;
    skip: string;
    submit: string;
    sending: string;
    privacy: string;
    placesLabel: string;
    privacyLink: string;
    privacyHref: string;
    draft: string;
    successTitle: (name: string) => string;
    successWa: string;
    successNoWa: string;
    successCta: string;
    again: string;
    failTitle: string;
    failText: string;
    failCta: string;
    waPrefill: string;
  }
> = {
  he: {
    title: "בואו נדבר על האירוע שלכם",
    titleIntl: "בואו נתכנן את האירוע שלכם, בכל מקום בעולם",
    sub: "4 שאלות קצרות, פחות מדקה. נחזור אליכם עם הצעה וזמינות לתאריך.",
    trust: ["נחזור אליכם בהקדם", "ללא התחייבות", "מעל 1,500 אירועים"],
    stepOf: (a, b) => `שלב ${a} מתוך ${b}`,
    steps: ["בואו נכיר", "פרטי האירוע", "איך נחזור אליכם?", "רק אם בא לכם לשתף"],
    optional: "לא חובה",
    labels: {
      contact_name: "איך קוראים לך?",
      relation: "מה הקשר שלך לאירוע?",
      relation_other: "ספרו לנו",
      event_date: "תאריך האירוע",
      event_location: "איפה האירוע?",
      phone1: "טלפון",
      email: "מייל",
      whatsapp_consent: "שלחו לי אישור עם הפרטים בוואטסאפ",
      hear_about_us: "איך שמעתם עלינו?",
      hear_other: "איפה?",
      referrer: "מי המליץ?",
      notes: "משהו נוסף שכדאי שנדע?",
    },
    hints: {
      event_date: "עוד לא סגרתם תאריך? אפשר להשאיר ריק",
      event_location: "התחילו להקליד ונציע אולמות וערים. אפשר גם להשאיר ריק",
      phone1: "נחזור אליכם למספר הזה",
      referrer: "כדי שנוכל להגיד תודה 🙂",
    },
    placeholders: {
      contact_name: "שם מלא",
      event_location: "למשל: האחוזה בית חנן",
      phone1: "050-0000000",
      email: "name@example.com",
      notes: "תקציב, סגנונות מוזיקה שאתם אוהבים, תאריכים חלופיים, דיג׳יי…",
      relation_other: "למשל: אח של הכלה",
      hear_other: "ספרו לנו",
      referrer: "שם",
    },
    errors: {
      contact_name: "נשמח לדעת איך לפנות אליך",
      phone1: "צריך מספר טלפון תקין כדי שנוכל לחזור אליכם",
      email: "כתובת המייל לא נראית תקינה",
    },
    next: ["בואו נמשיך", "עוד קצת וסיימנו", "לשלב האחרון"],
    back: "חזרה",
    skip: "דלגו",
    submit: "בדקו זמינות לתאריך שלי",
    sending: "שולחים…",
    placesLabel: "הצעות מיקום",
    privacy: "אנחנו מכבדים את פרטיותכם ולא מעבירים פרטים לצד שלישי.",
    privacyLink: "מדיניות פרטיות",
    privacyHref: "/privacy-policy/",
    draft: "שמרנו את מה שמילאתם, אפשר להמשיך מאיפה שעצרתם",
    successTitle: (n) => `תודה${n ? " " + n : ""}! 🎉`,
    successWa: "קיבלנו את הפרטים ושלחנו לכם הודעת וואטסאפ עם סיכום. נחזור אליכם בהקדם!",
    successNoWa: "קיבלנו את הפרטים ונחזור אליכם בהקדם!",
    successCta: "לוואטסאפ של הלהקה",
    again: "שליחת פנייה נוספת",
    failTitle: "אופס, משהו השתבש בשליחה",
    failText: "הפרטים שלכם לא אבדו. אפשר לשלוח אותם אלינו בוואטסאפ בלחיצה אחת:",
    failCta: "שליחה בוואטסאפ",
    waPrefill: "היי קולות! פנייה מהאתר:",
  },
  en: {
    title: "Let's talk about your event",
    titleIntl: "Let's plan your event, anywhere in the world",
    sub: "4 quick questions, less than a minute. We'll get back to you with a proposal and availability.",
    trust: ["We'll get back to you soon", "No commitment", "1,500+ events"],
    stepOf: (a, b) => `Step ${a} of ${b}`,
    steps: ["Nice to meet you", "The event", "How do we reach you?", "Only if you feel like sharing"],
    optional: "optional",
    labels: {
      contact_name: "What's your name?",
      relation: "How are you related to the event?",
      relation_other: "Tell us",
      event_date: "Event date",
      event_location: "Where is the event?",
      phone1: "Phone",
      email: "Email",
      whatsapp_consent: "Send me a confirmation with my details on WhatsApp",
      hear_about_us: "How did you hear about us?",
      hear_other: "Where?",
      referrer: "Who recommended us?",
      notes: "Anything else we should know?",
    },
    hints: {
      event_date: "No date yet? Leave it empty",
      event_location: "Start typing a venue or city and pick a suggestion. Can be left empty",
      phone1: "We'll get back to you on this number (country code welcome)",
      referrer: "So we can say thank you 🙂",
    },
    placeholders: {
      contact_name: "Full name",
      event_location: "e.g. Tuscany, Italy",
      phone1: "+1 212 555 0100",
      email: "name@example.com",
      notes: "Budget, music you love, backup dates, DJ…",
      relation_other: "e.g. the bride's brother",
      hear_other: "Tell us",
      referrer: "Name",
    },
    errors: {
      contact_name: "We'd love to know what to call you",
      phone1: "We need a valid phone number to get back to you",
      email: "That email doesn't look quite right",
    },
    next: ["Let's keep going", "Almost there", "To the last step"],
    back: "Back",
    skip: "Skip",
    submit: "Check availability for my date",
    sending: "Sending…",
    placesLabel: "location suggestions",
    privacy: "We respect your privacy and never share your details.",
    privacyLink: "Privacy policy",
    privacyHref: "/en/privacy-policy/",
    draft: "We saved what you typed, so you can pick up where you left off",
    successTitle: (n) => `Thank you${n ? ", " + n : ""}! 🎉`,
    successWa: "We've got your details and sent you a WhatsApp with a summary. We'll be in touch very soon!",
    successNoWa: "We've got your details and we'll be in touch very soon!",
    successCta: "WhatsApp the band",
    again: "Send another request",
    failTitle: "Oops, something went wrong",
    failText: "Your details aren't lost. Send them to us on WhatsApp with one tap:",
    failCta: "Send on WhatsApp",
    waPrefill: "Hi KOLOT! A request from the website:",
  },
};

/** Background of the contact section. Set a video (e.g. "/media/contact.mp4", muted loop) when you have one. */
export const FORM_BG_VIDEO: string | null = null;
export const FORM_BG_IMAGES = ["/media/gallery/kolot-375.jpg", "/media/gallery/kolot-13.jpg", "/media/gallery/kolot-360.jpg"];
