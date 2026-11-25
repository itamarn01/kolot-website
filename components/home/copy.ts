import type { Lang } from "@/lib/types";

/** All homepage copy, taken from the Figma file "אתר קולות" (Home · Desktop · HE / EN). */

export const WHATSAPP = "https://wa.me/972555081080";
export const PHONE = { he: "055-508-1080", en: "+972 55-508-1080", href: "tel:+972555081080" };
export const INSTAGRAM = "https://www.instagram.com/kolotband/";
export const YOUTUBE = "https://www.youtube.com/user/kolotMusic";

const M = "/media/home";

/** A square clip. `youtube` = video id, opened in the YouTube lightbox; `video` = local MP4 played inline. */
export type Clip = { title: { he: string; en: string }; poster: string; time?: string; youtube?: string; video?: string };
export type Reel = { title: { he: string; en: string }; poster: string; video?: string };


const T = "/media/video-thumbs";

/** The big player under "See us live". */
export const MAIN_VIDEO = { youtube: "fOlMxqGVV1Y", poster: "/media/video-thumbs/clip-2022-08-18-12-31-29.webp" };

/** Square clips under the big player: the other YouTube videos from the current site (homepage #videos + reception/corporate). */
export const CLIPS: Clip[] = [
  { youtube: "7mXq8bQDG_w", poster: `${T}/maxresdefault-2.webp`, title: { he: "מזרחי ישראלי", en: "Mizrahi & Israeli" } },
  { youtube: "T9GGKMDukiM", poster: `${T}/chupa.webp`, title: { he: "מחרוזת חופה", en: "Chuppah medley" } },
  { youtube: "RNLV4R3jlK0", poster: `${T}/basof.webp`, title: { he: "בסוף זה הלחן · קאבר", en: "Basof Ze HaLachan · Cover" } },
  { youtube: "NkuTfMrascI", poster: `${T}/maxresdefault-1.webp`, title: { he: "מחרוזת חסידית", en: "Chassidic medley" } },
  {
    youtube: "uhWXBGHdrg8",
    poster: `${T}/clip-2024-12-12-18-56-57.webp`,
    title: { he: "Live Sessions · Lose Control × Die With A Smile", en: "Live Sessions · Lose Control × Die With A Smile" },
  },
];

export const REELS: Reel[] = [
  { title: { he: "חופה · כינור סולו", en: "Chuppah · Solo violin" }, poster: `${M}/reel-1.webp` },
  { title: { he: "כניסה לרחבה", en: "Dance-floor entrance" }, poster: `${M}/reel-2.webp` },
  { title: { he: "סט חסידי", en: "Chassidic set" }, poster: `${M}/reel-3.webp` },
  { title: { he: "סקסופון · קבלת פנים", en: "Sax · Reception" }, poster: `${M}/reel-4.webp` },
  { title: { he: "אפטר פארטי", en: "After party" }, poster: `${M}/reel-5.webp` },
];

/** Background loop of the "we don't just play" section (silent, shown in black and white) + the full colour version with sound. */
export const STATEMENT = { loop: `${M}/statement-loop.mp4`, full: `${M}/statement-full.mp4`, poster: `${M}/statement-poster.webp` };

export const LINEUP = [
  {
    thumb: `${M}/lineup-1.jpg`,
    he: { title: "להקה לחתונה", tag: "WEDDING BAND", text: "להקה מלאה, זמרים וכלי נשיפה. אנרגיה של הופעה.", href: "/להקה-לחתונה/" },
    en: { title: "Wedding Band", tag: "THE MAIN EVENT", text: "Full band, vocalists and horns. The energy of a live show.", href: "/en/wedding-band/" },
  },
  {
    thumb: `${M}/lineup-2.jpg`,
    he: { title: "קבלת פנים", tag: "RECEPTION", text: "ג׳אז, סקסופון וכינורות. אווירה של לאונג׳ יוקרתי.", href: "/reception/" },
    en: { title: "Reception", tag: "COCKTAIL HOUR", text: "Jazz, saxophone and strings. The feel of a luxury lounge.", href: "/en/reception-2/" },
  },
  {
    thumb: `${M}/lineup-3.webp`,
    he: { title: "דיג׳ייז", tag: "DJS", text: "סטים שנבנים בזמן אמת ומשתלבים עם הלהקה.", href: "/djs/" },
    en: { title: "DJs", tag: "ALL NIGHT LONG", text: "Sets built in real time, blending seamlessly with the band.", href: "/en/djs2/" },
  },
  {
    thumb: `${M}/lineup-4.webp`,
    he: { title: "בר ובת מצווה", tag: "BAR & BAT MITZVAH", text: "שמחה לכל המשפחה, מהסבתא ועד החברים מהכיתה.", href: "/להקה-לחתונה-copy/" },
    en: { title: "Bar & Bat Mitzvah", tag: "FAMILY", text: "Joy for the whole family, from grandma to the friends from class.", href: "/en/barbatmitzva/" },
  },
  {
    thumb: `${M}/lineup-5.webp`,
    he: { title: "אירועי חברה", tag: "CORPORATE", text: "גאלות, כנסים ומסיבות חברה בהפקה מוזיקלית מלאה.", href: "/corporate/" },
    en: { title: "Corporate", tag: "GALAS & PARTIES", text: "Galas, conferences and company parties with full music production.", href: "/en/corporate-2/" },
  },
  {
    thumb: `${M}/lineup-6.webp`,
    he: { title: "KOLOT Worldwide", tag: "DESTINATION", text: "חתונות יעד ואירועי יוקרה בכל העולם.", href: "/international/" },
    en: { title: "KOLOT Worldwide", tag: "DESTINATION", text: "Destination weddings and luxury events, worldwide.", href: "/en/international/" },
  },
];

export const BENEFITS = [
  { icon: "award", he: ["15 שנות ניסיון", "מעל 1000 חתונות ואירועים. יודעים לקרוא כל רחבה."], en: ["15 years of experience", "1000+ weddings and events. We know how to read every dance floor."] },
  { icon: "mic", he: ["הנגנים הטובים בארץ", "זמרים, נגנים וכלי נשיפה מהשורה הראשונה בישראל."], en: ["Israel's finest musicians", "Top-tier vocalists, musicians and horn players."] },
  { icon: "globe", he: ["אירועים בכל העולם", "מאירופה ועד ארה״ב. מגיעים עם הצוות, הסאונד והאנרגיה."], en: ["Events worldwide", "From Europe to the US. We arrive with the crew, the sound and the energy."] },
  { icon: "hand", he: ["ההפקות הגדולות בישראל", "עובדים יד ביד עם חברות ההפקה המובילות בישראל."], en: ["Israel's biggest productions", "We work hand in hand with Israel's leading production companies."] },
  { icon: "speaker", he: ["סאונד ברמה עולמית", "ציוד ואיכות סאונד ברמה הגבוהה בעולם, בכל אולם ובכל מקום."], en: ["World-class sound", "Premium sound in every venue, anywhere in the world."] },
  { icon: "music", he: ["כל סגנון, באותו ערב", "חסידי, ישראלי, מזרחי ולועזי. רפרטואר תפור עליכם שיחבר את כולם."], en: ["Every style, one night", "Chassidic, Israeli, Mizrahi and international. A repertoire tailored to bring everyone together."] },
] as const;

/**
 * "Our story" section, the band's own text word for word.
 * Blocks: p = paragraph, h = small sub-heading, li = bullet list.
 * Inside text, **name** is shown bright and bold, ==line== in yellow.
 */
export type StoryBlock = { p: string } | { h: string } | { li: string[] };
export const STORY_PHOTOS = { early: `${M}/story-2009.webp`, today: `${M}/story-today.webp` };
export const STORY: Record<Lang, {
  eyebrow: string;
  title: string;
  blocks: StoryBlock[];
  signoff: string;
  sign: string;
  more: string;
  less: string;
  tags: [string, string];
  alts: [string, string];
}> = {
  he: {
    eyebrow: "OUR STORY",
    title: "הכל התחיל איפשהו ב-2009.",
    blocks: [
      { p: "חבורה של נערים מוזיקאים רעבים, עם המון חלומות ומטרה אחת פשוטה – רק למצוא איפה לנגן." },
      { p: "הגרעין שלנו כלל את **נתנאל יוסף** (בסיסט עם גרוב ייחודי ודיג'יי), **איתמר נובוסלסקי** (פסנתרן ג'אז מטורף ואמן תופים), **יוחאי טובול** (סקסופוניסט וחיית סאונד וטכנולוגיה) ו**יניב וסלי** (פסנתרן נשמה שאי אפשר להתעלם מהנוכחות הבימתית שלו)." },
      { p: "היה לנו כמעט הכל – גרוב, תשוקה וכימיה נדירה. ==רק דבר אחד קטן היה חסר: זמר.==" },
      { p: "חיפשנו בנרות, עד שמצאנו איזה בחור אלמוני ומוכשר בשם **חנן בן ארי**. החיבור היה מיידי. חרשנו יחד את הארץ בחתונות ואירועים, צברנו שעות במה וגיבשנו את ה-DNA שלנו – עד שהגיע הרגע שבו חנן פרץ והפך לאחד הכוכבים הגדולים במיינסטרים הישראלי." },
      { p: "ואז הגיע הרגע למלא נעליים גדולות במיוחד. אל קדמת הבמה של להקת קולות נכנס **טל שבח** – והוא לא רק מילא אותן, הוא עשה את זה ביג טיים. היום טל הוא בקלות אחד הקולות הבולטים והמבוקשים בתעשיית האירועים הישראלית." },
      { p: "זמן קצר אחר כך הצטרפו לצוות שתי צלעות נוספות שהרימו אותנו עוד שלב למעלה:" },
      {
        li: [
          "**אריאל קנדאבי** – זמר ויוצר ישראלי שהופיע ומופיע בארץ ובחו\"ל לצד מיטב אמני הזמר החסידי.",
          "**רובי בדלוב** – חיית במה מטורפת שנע בקלילות בין בון ג'ובי והביטלס לבין ג'יי בלבין וברונו מארס.",
        ],
      },
      { h: "ואיפה אנחנו היום?" },
      { p: "לאורך השנים גדלנו, התפתחנו והרחבנו את הרפרטואר שלנו כך שנוכל להתאים את עצמנו כמעט לכל קהל ולכל סגנון מוזיקלי. אנחנו עובדים עם מיטב צוותי הסאונד בישראל, ומשלבים טכנולוגיה וסטנדרט מוזיקלי שרואים בדרך כלל רק בהפקות ובבמות הגדולות ביותר." },
      { p: "את כל הניסיון, העוצמה והדיוק הזה אנחנו מביאים ישירות לאירוע הפרטי שלכם – באותה אהבה ובאותה התרגשות, כאילו זו הפעם הראשונה שאנחנו עולים על במה." },
    ],
    signoff: "מחכים לשמוח ולחגוג איתכם,",
    sign: "קולות",
    more: "לסיפור המלא",
    less: "לקצר",
    tags: ["2009", "היום"],
    alts: ["להקת קולות בימיה הראשונים", "להקת קולות היום"],
  },
  en: {
    eyebrow: "OUR STORY",
    title: "It all started somewhere back in 2009.",
    blocks: [
      { p: "We were a group of hungry young musicians with big dreams and one simple goal—just finding somewhere to play. Our original core brought together **Netanel Yosef** (a bassist with an unmistakable groove and a DJ), **Itamar Novoselsky** (a phenomenal jazz pianist and master drummer), **Yochay Tubul** (a soulful saxophonist and a wizard of sound and tech), and **Yaniv Vessely** (a soulful pianist with an undeniable stage presence)." },
      { p: "We had almost everything—groove, passion, and rare musical chemistry. ==Just one small thing was missing: a lead singer.==" },
      { p: "We searched everywhere until we found an unknown, wildly talented guy named **Hanan Ben Ari**. The connection was instant. We crisscrossed the country together playing weddings and events, putting in the stage hours and shaping our musical DNA—until Hanan broke out and became one of Israel’s biggest mainstream superstars." },
      { p: "Suddenly, we had some massive shoes to fill." },
      { p: "Stepping into the spotlight as Kolot’s frontman was **Tal Shevach**—and he didn’t just fill those shoes, he owned them. Today, Tal is easily one of the most prominent and sought-after voices in the live events industry." },
      { p: "Not long after, two more powerhouses joined the lineup and took us to the next level:" },
      {
        li: [
          "**Ariel Kandabi** – an Israeli singer and songwriter who has performed across Israel and worldwide alongside top artists in the Jewish and Hassidic music scene.",
          "**Rubi Badalov** – an absolute force on stage who glides effortlessly from Bon Jovi and The Beatles to J Balvin and Bruno Mars.",
        ],
      },
      { h: "Where are we today?" },
      { p: "Over the years, we’ve grown, evolved, and expanded our repertoire to fit virtually any crowd and any musical style. We collaborate with top-tier sound teams and bring the kind of cutting-edge technology and musical standards usually reserved for major concert stages and live productions." },
      { p: "We bring all of that experience, energy, and precision straight to your private celebration—with the exact same love and excitement as if it were our very first show." },
    ],
    signoff: "We can’t wait to celebrate with you,",
    sign: "Kolot",
    more: "Read the full story",
    less: "Show less",
    tags: ["2009", "TODAY"],
    alts: ["KOLOT in the early days", "KOLOT today"],
  },
};

export const MARQUEE = {
  he: ["אין עליכם בעולם", "עשיתם הכי הרבה שמח שיש", "כולם שואלים מי הייתה הלהקה", "אתם פשוט הייתם משהו אחר"],
  en: ["THE BAND WAS PHENOMENAL", "IT MADE THE DAY SO SPECIAL", "YOU CREATED THE ATMOSPHERE"],
};

export const COPY = {
  he: {
    home: "/",
    alt: "/en/",
    nav: [
      { label: "הרכבים", href: "/#lineup" },
      { label: "וידאו", href: "/#showreel" },
      { label: "המלצות", href: "/reviews/" },
      { label: "עלינו", href: "/#story" },
      { label: "Worldwide", href: "/international/" },
      { label: "צור קשר", href: "#contact" },
    ],
    langShort: "EN",
    langLabel: "English",
    headerCta: "בדיקת תאריך",
    menu: "תפריט",
    close: "סגירה",
    liveTag: "KOLOT · LIVE MUSIC FOR WEDDINGS & EVENTS",
    liveTagMobile: "LIVE MUSIC · WEDDINGS & EVENTS",
    sub: ["סטנדרט מוסיקה בינלאומי לחתונות ואירועים.", "להקה לחתונה הרכבי קבלת פנים ודיג׳ייז לחוויה מוסיקלית מושלמת."],
    subMobile: "סטנדרט מוסיקה בינלאומי לחתונות ואירועים. להקה, הרכבי קבלת פנים ודיג׳ייז.",
    watch: "צפו בשואוריל",
    check: "בדיקת זמינות לתאריך",
    meta: ["15 שנה על הבמה", "1000+ חתונות ואירועים", "ישראל וחו״ל"],
    reviewsEyebrow: "WHAT COUPLES SAY",
    allReviews: "לכל ההמלצות",
    reviewsTitle: "מה אומרים עלינו...",
    reviewsText: "מילים חמות ששלחתם לנו אחרי האירוע.",
    reviewsCta: "רוצים שזה יהיה האירוע שלכם?",
    statementEyebrow: "SOUND OF HEART",
    statement: ["אנחנו לא רק מנגנים ברקע.", "אנחנו חלק מהשמחה שלכם."],
    statementWatch: "צפו בווידאו",
    showreelEyebrow: "SHOWREEL 2026",
    showreelTitle: "צפו בנו בלייב",
    showreelTag: "מחרוזת חתונות ישראלית",
    clipsEyebrow: "MORE CLIPS · SWIPE",
    lineupEyebrow: "THE LINE-UP",
    lineupTitle: "כל ההרכבים לכל אירוע.",
    reelsEyebrow: "FROM THE DANCE FLOOR",
    reelsTitle: "רגעים אמיתיים. בלי פילטרים.",
    whyEyebrow: "WHY KOLOT",
    whyTitle: "למה קולות?",
    wwEyebrow: "KOLOT WORLDWIDE",
    wwTitle: ["החתונה שלכם.", "בכל מקום בעולם."],
    wwText: "חתונות יעד ואירועי יוקרה. אנחנו מגיעים עם הצוות, הסאונד והאנרגיה.",
    wwCta: "לעמוד Worldwide",
    wwHref: "/international/",
    ctaEyebrow: "LET'S TALK",
    ctaTitle: "הערב שלכם מתחיל כאן.",
    ctaText: "ספרו לנו על האירוע ונחזור אליכם עם הצעה מותאמת.",
    whatsapp: "וואטסאפ",
    available: "בדיקת זמינות",
    footerNav: [
      { label: "הרכבים", href: "/#lineup" },
      { label: "וידאו", href: "/#showreel" },
      { label: "המלצות", href: "/reviews/" },
      { label: "עלינו", href: "/#story" },
      { label: "Worldwide", href: "/international/" },
      { label: "צור קשר", href: "#contact" },
      { label: "Instagram", href: INSTAGRAM },
      { label: "YouTube", href: YOUTUBE },
    ],
    legal: [
      { label: "פרטיות", href: "/privacy-policy/" },
      { label: "עוגיות", href: "/cookie-policy/" },
      { label: "נגישות", href: "/accessibility-statement/" },
      { label: "תנאי שימוש", href: "/terms/" },
    ],
    prev: "הקודם",
    next: "הבא",
    play: "ניגון",
    pause: "השהיה",
    formTitle: "בדיקת זמינות",
  },
  en: {
    home: "/en/",
    alt: "/",
    nav: [
      { label: "Line-up", href: "/en/#lineup" },
      { label: "Video", href: "/en/#showreel" },
      { label: "Reviews", href: "/en/reviews/" },
      { label: "About", href: "/en/#story" },
      { label: "Worldwide", href: "/en/international/" },
      { label: "Contact", href: "#contact" },
    ],
    langShort: "עב",
    langLabel: "עברית",
    headerCta: "Check your date",
    menu: "Menu",
    close: "Close",
    liveTag: "KOLOT · LIVE MUSIC FOR WEDDINGS & EVENTS",
    liveTagMobile: "LIVE MUSIC · WEDDINGS & EVENTS",
    sub: ["An international standard of live music for weddings and events.", "Wedding band, reception ensembles and DJs, for a flawless musical night."],
    subMobile: "An international standard of live music for weddings and events.",
    watch: "Watch the showreel",
    check: "Check availability",
    meta: ["15 years on stage", "1000+ weddings & events", "Israel & abroad"],
    reviewsEyebrow: "WHAT COUPLES SAY",
    allReviews: "All reviews",
    reviewsTitle: "What people say about us...",
    reviewsText: "Warm words you sent us after your event.",
    reviewsCta: "Want this to be your event?",
    statementEyebrow: "SOUND OF HEART",
    statement: ["We're not background music.", "We're part of the celebration."],
    statementWatch: "Watch the video",
    showreelEyebrow: "SHOWREEL 2026",
    showreelTitle: "See us live",
    showreelTag: "Israeli wedding medley",
    clipsEyebrow: "MORE CLIPS · SWIPE",
    lineupEyebrow: "THE LINE-UP",
    lineupTitle: "Every line-up, for every event.",
    reelsEyebrow: "FROM THE DANCE FLOOR",
    reelsTitle: "Real moments. No filters.",
    whyEyebrow: "WHY KOLOT",
    whyTitle: "Why KOLOT?",
    wwEyebrow: "KOLOT WORLDWIDE",
    wwTitle: ["Your wedding.", "Anywhere in the world."],
    wwText: "Destination weddings and luxury events. We bring the crew, the sound and the energy.",
    wwCta: "KOLOT Worldwide",
    wwHref: "/en/international/",
    ctaEyebrow: "LET'S TALK",
    ctaTitle: "Your night starts here.",
    ctaText: "Tell us about your event and we'll come back with a tailored proposal.",
    whatsapp: "WhatsApp",
    available: "Check availability",
    footerNav: [
      { label: "Line-up", href: "/en/#lineup" },
      { label: "Video", href: "/en/#showreel" },
      { label: "Reviews", href: "/en/reviews/" },
      { label: "About", href: "/en/#story" },
      { label: "Worldwide", href: "/en/international/" },
      { label: "Contact", href: "#contact" },
      { label: "Instagram", href: INSTAGRAM },
      { label: "YouTube", href: YOUTUBE },
    ],
    legal: [
      { label: "Privacy", href: "/en/privacy-policy/" },
      { label: "Cookies", href: "/en/cookie-policy/" },
      { label: "Accessibility", href: "/en/accessibility-statement/" },
      { label: "Terms", href: "/en/terms/" },
    ],
    prev: "Previous",
    next: "Next",
    play: "Play",
    pause: "Pause",
    formTitle: "Check availability",
  },
} as const;

export type HomeCopy = (typeof COPY)[Lang];
