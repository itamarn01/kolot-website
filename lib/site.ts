import type { Lang } from "./types";

export const SITE_URL = "https://kolotband.co.il";

export const CONTACT = {
  email: "kolotmusic@gmail.com",
  phone: "055-5081080",
  phoneHref: "tel:+972555081080",
  facebook: "https://www.facebook.com/kolotband",
  instagram: "https://www.instagram.com/kolotband/",
  youtube: "https://www.youtube.com/user/kolotMusic",
};

/**
 * Legal placeholders – fill these in before going live.
 * They are used by the privacy policy, terms and accessibility statement.
 */
export const LEGAL = {
  owner: {
    he: { name: "להקת קולות", person: "נתנאל יוסף", id: "עוסק מורשה 036897734", address: "הגליל 20, חיפה" },
    en: { name: "KOLOT band", person: "Netanel Yosef", id: "Licensed dealer (Osek Murshe) no. 036897734", address: "20 HaGalil St., Haifa, Israel" },
  },
  accessibility: {
    he: { name: "נתנאל יוסף", phone: "054-3038000", phoneHref: "tel:+972543038000" },
    en: { name: "Netanel Yosef", phone: "+972 54-303-8000", phoneHref: "tel:+972543038000" },
  },
  lastUpdated: "24/11/2026",
};

export type NavItem = { label: string; href: string; children?: NavItem[]; highlight?: boolean };

const he = (p: string) => p;

export const NAV: Record<Lang, NavItem[]> = {
  he: [
    { label: "קצת עלינו", href: "/#about" },
    {
      label: "הרכבים",
      href: "/#bands",
      children: [
        { label: "להקה לחתונה", href: he("/להקה-לחתונה/") },
        { label: "הרכבי קבלת פנים", href: "/reception/" },
        { label: "דיג׳ייז", href: "/djs/" },
        { label: "להקה לבר/בת מצוה", href: he("/להקה-לחתונה-copy/") },
        { label: "להקה לאירועי חברה", href: "/corporate/" },
      ],
    },
    { label: "בינלאומי ויוקרה", href: "/international/", highlight: true },
    { label: "גלריה", href: "/#gallery" },
    { label: "וידאו", href: "/#videos" },
    { label: "TESTIMONIALS", href: "/#testimonials" },
    { label: "צור קשר", href: "#contact-us" },
  ],
  en: [
    { label: "About Us", href: "/en/#about" },
    {
      label: "Our Bands",
      href: "/en/#bands",
      children: [
        { label: "Wedding Band", href: "/en/wedding-band/" },
        { label: "Reception Bands", href: "/en/reception-2/" },
        { label: "DJ’s", href: "/en/djs2/" },
        { label: "Bar/Bat Mitzva", href: "/en/barbatmitzva/" },
        { label: "Corporate events", href: "/en/corporate-2/" },
      ],
    },
    { label: "Worldwide & Luxury", href: "/en/international/", highlight: true },
    { label: "Gallery", href: "/en/#gallery" },
    { label: "Videos", href: "/en/#videos" },
    { label: "Testimonials", href: "/en/#testimonials" },
    { label: "Contact Us", href: "#contact-us" },
  ],
};

export const LEGAL_LINKS: Record<Lang, { label: string; href: string }[]> = {
  he: [
    { label: "הצהרת נגישות", href: "/accessibility-statement/" },
    { label: "מדיניות פרטיות", href: "/privacy-policy/" },
    { label: "מדיניות עוגיות", href: "/cookie-policy/" },
    { label: "תנאי שימוש", href: "/terms/" },
  ],
  en: [
    { label: "Accessibility Statement", href: "/en/accessibility-statement/" },
    { label: "Privacy Policy", href: "/en/privacy-policy/" },
    { label: "Cookie Policy", href: "/en/cookie-policy/" },
    { label: "Terms of Use", href: "/en/terms/" },
  ],
};

export const UI = {
  he: {
    skip: "דלג לתוכן הראשי",
    menu: "תפריט",
    openMenu: "פתיחת תפריט",
    closeMenu: "סגירת תפריט",
    langLabel: "English",
    langShort: "EN",
    contactTitle: "צרו קשר",
    contactSubtitle: "TALK TO US",
    backToTop: "חזרה לראש העמוד",
    moreReviews: "רוצים לראות עוד תגובות",
    play: "ניגון הסרטון",
    prev: "הקודם",
    next: "הבא",
    gallery: "גלריית תמונות",
    rights: "כל הזכויות שמורות",
    cookieManage: "הגדרות עוגיות",
    included: "כלול",
  },
  en: {
    skip: "Skip to main content",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    langLabel: "עברית",
    langShort: "HE",
    contactTitle: "צרו קשר",
    contactSubtitle: "TALK TO US",
    backToTop: "Back to top",
    moreReviews: "more reviews",
    play: "Play video",
    prev: "Previous",
    next: "Next",
    gallery: "Photo gallery",
    rights: "All rights reserved",
    cookieManage: "Cookie settings",
    included: "Included",
  },
} as const;
