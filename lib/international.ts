import type { Lang } from "./types";

/**
 * KOLOT Worldwide – destination weddings & luxury events.
 *
 * VIDEOS: drop the original MP4s into /public/media/international/ and set `video` on each story
 * (e.g. "/media/international/paris.mp4"). Until then each card shows its `poster` still and links to the reel.
 * Tip: export 1080×1920 (9:16) H.264, ~6–10 Mbps, 10–30 s, no audio needed for the loops.
 */

export type Story = {
  key: string;
  place: Record<Lang, string>;
  country: Record<Lang, string>;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
  instagram: string | null;
  poster: string;
  video: string | null;
};

export const HERO_VIDEO: string | null = null; // e.g. "/media/international/hero.mp4" (16:9, 15–30 s loop)
export const HERO_IMAGES = ["/media/gallery/kolot-401.jpg", "/media/gallery/kolot-106.jpg", "/media/gallery/kolot-375.jpg"];

export const DESTINATIONS: Story[] = [
  {
    key: "paris",
    place: { en: "Paris", he: "פריז" },
    country: { en: "France", he: "צרפת" },
    title: { en: "Paris in a minute (and a bit)", he: "פריז בדקה וקצת" },
    text: {
      en: "A celebration in the City of Light, with our full live band, singers and DJ flown in for one unforgettable night.",
      he: "חגיגה בעיר האורות – להקה חיה, זמרים ודיג׳יי שטסו במיוחד ללילה אחד בלתי נשכח.",
    },
    instagram: "https://www.instagram.com/reel/DaBU8wLNlpJ/",
    poster: "/media/gallery/kolot-401.jpg",
    video: null,
  },
  {
    key: "vienna",
    place: { en: "Vienna", he: "וינה" },
    country: { en: "Austria", he: "אוסטריה" },
    title: { en: "Kolot in Vienna", he: "קולות בווינה" },
    text: {
      en: "Our live band, singers and DJ brought the full Kolot experience to the heart of Vienna.",
      he: "הלהקה, הזמרים והדיג׳יי שלנו הביאו את חוויית קולות המלאה ללב וינה.",
    },
    instagram: null, // add the reel link when the video is ready
    poster: "/media/gallery/kolot-416.jpg",
    video: null,
  },
  {
    key: "italy",
    place: { en: "Italy", he: "איטליה" },
    country: { en: "Europe", he: "אירופה" },
    title: { en: "Italy, you were a dream", he: "איטליה, היית חלום" },
    text: {
      en: "A destination wedding produced with Ely Katz | Symphonia Events – from the first note of the chuppah to the last dance.",
      he: "חתונת יעד בהפקת אלי כץ | Symphonia Events – מהתו הראשון בחופה ועד הריקוד האחרון.",
    },
    instagram: "https://www.instagram.com/reel/Df0DSILNrr_/",
    poster: "/media/gallery/kolot-360.jpg",
    video: null,
  },
  {
    key: "new-york",
    place: { en: "New York", he: "ניו יורק" },
    country: { en: "USA", he: "ארה״ב" },
    title: { en: "Manhattan & the Statue of Liberty behind us", he: "מנהטן ופסל החירות מאחורינו" },
    text: {
      en: "Kolot in New York with Ely Katz | Symphonia Events – live music with the Manhattan skyline as our backdrop.",
      he: "קולות בניו יורק עם אלי כץ | Symphonia Events – מוזיקה חיה עם קו הרקיע של מנהטן ברקע.",
    },
    instagram: "https://www.instagram.com/p/B0UZvRUDQW1/",
    poster: "/media/gallery/kolot-21.jpg",
    video: null,
  },
  {
    key: "california",
    place: { en: "California", he: "קליפורניה" },
    country: { en: "USA", he: "ארה״ב" },
    title: { en: "Destination weddings, Kolot style", he: "חתונות יעד בסגנון קולות" },
    text: {
      en: "Across the ocean with Symphonia Events – Israeli energy, Jewish simcha and international hits for a crowd from all over the world.",
      he: "מעבר לאוקיינוס עם Symphonia Events – אנרגיה ישראלית, שמחה יהודית ולהיטים בינלאומיים לקהל מכל העולם.",
    },
    instagram: "https://www.instagram.com/reel/Db3lzbftatf/",
    poster: "/media/gallery/kolot-372.jpg",
    video: null,
  },
  {
    key: "israel",
    place: { en: "Israel", he: "ישראל" },
    country: { en: "Coming home", he: "חוזרים הביתה" },
    title: { en: "Couples from abroad, celebrating in Israel", he: "זוגות מחו״ל שמתחתנים בארץ" },
    text: {
      en: "For couples flying in from the US, UK and Europe: we plan remotely in English, work hand in hand with your planner and bring both worlds to the dance floor.",
      he: "לזוגות שמגיעים מארה״ב, אנגליה ואירופה: מתכננים איתכם מרחוק באנגלית, עובדים יד ביד עם המפיקה ומביאים את שני העולמות לרחבה.",
    },
    instagram: "https://www.instagram.com/reel/DVOnjZzDCH3/",
    poster: "/media/gallery/kolot-108.jpg",
    video: null,
  },
];

export const LUXURY: Story[] = [
  {
    key: "ultimate",
    place: { en: "The Ultimate", he: "האולטימייט" },
    country: { en: "Luxury events", he: "אירועי יוקרה" },
    title: { en: "Let the vibes speak", he: "תנו לאווירה לדבר" },
    text: {
      en: "Our flagship line-up: brass section, production musicians, a reception ensemble of your choice and an after-party with the Kolot DJ.",
      he: "הרכב הדגל שלנו: מחלקת כלי נשיפה, נגני הפקות, הרכב קבלת פנים לבחירה ואפטר פארטי עם הדיג׳יי של קולות.",
    },
    instagram: "https://www.instagram.com/reel/DLdFGVKozmD/",
    poster: "/media/gallery/kolot-387.jpg",
    video: null,
  },
  {
    key: "viva",
    place: { en: "Viva la Vida", he: "Viva la Vida" },
    country: { en: "Live", he: "לייב" },
    title: { en: "Moments people talk about for years", he: "רגעים שמדברים עליהם שנים" },
    text: {
      en: "Signature arrangements, strings and live-on-DJ moments designed around you – nothing off the shelf.",
      he: "עיבודים מקוריים, כלי מיתר ורגעי לייב און דיג׳יי שנבנים סביבכם – שום דבר מהמדף.",
    },
    instagram: "https://www.instagram.com/reel/DSDbtMEDftf/",
    poster: "/media/gallery/kolot-589.jpg",
    video: null,
  },
];

export const PARTNERS = ["Ely Katz | Symphonia Events", "Victoria Rosen Events"];

type Copy = {
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  heroTitle: string[];
  heroSub: string;
  ctaPlan: string;
  ctaWatch: string;
  scroll: string;
  stats: { value: number; suffix: string; label: string }[];
  destEyebrow: string;
  destTitle: string;
  destHint: string;
  watch: string;
  expEyebrow: string;
  expTitle: string;
  experience: { title: string; text: string }[];
  luxEyebrow: string;
  luxTitle: string;
  luxText: string;
  partnersTitle: string;
  processEyebrow: string;
  processTitle: string;
  process: { title: string; text: string }[];
  quote: string;
  quoteBy: string;
  finalTitle: string;
  finalText: string;
  finalCta: string;
  teaserEyebrow: string;
  teaserTitle: string;
  teaserText: string;
  teaserCta: string;
};

export const COPY: Record<Lang, Copy> = {
  en: {
    metaTitle: "KOLOT Worldwide – Destination Weddings & Luxury Events",
    metaDesc:
      "KOLOT live band, singers and DJ for destination weddings and luxury events – Paris, Vienna, Italy, New York, California and couples from abroad celebrating in Israel. 1,500+ events.",
    eyebrow: "KOLOT WORLDWIDE",
    heroTitle: ["Your celebration.", "Anywhere in the world."],
    heroSub:
      "Live band, singers and DJ for destination weddings and luxury events – from Paris, Vienna and Italy to New York and California, and for couples from abroad celebrating in Israel.",
    ctaPlan: "Plan your event",
    ctaWatch: "Watch our stories",
    scroll: "Scroll",
    stats: [
      { value: 1500, suffix: "+", label: "events celebrated" },
      { value: 15, suffix: "", label: "years on stage" },
      { value: 3, suffix: "", label: "continents" },
    ],
    destEyebrow: "WHERE WE'VE PLAYED",
    destTitle: "From Paris to New York",
    destHint: "Keep scrolling",
    watch: "Watch on Instagram",
    expEyebrow: "THE KOLOT EXPERIENCE",
    expTitle: "Everything that travels with us",
    experience: [
      { title: "One team, door to door", text: "Singers, musicians, DJ and our own sound engineer travel together – one crew that already knows how to make your night work." },
      { title: "Built with your planner", text: "We work hand in hand with leading planners and production companies abroad, from tech riders to run-of-show." },
      { title: "Every tradition, every crowd", text: "Simcha dancing, Hasidic and Israeli hits, international pop and jazz standards – guests from every country on the dance floor." },
      { title: "Bespoke line-ups", text: "From an intimate string quartet for the chuppah to a full brass section and a live-on-DJ after-party." },
      { title: "Planning across time zones", text: "Video planning meetings in English or Hebrew, a dedicated contact and a song list built together with you." },
      { title: "Premium sound, anywhere", text: "Sound and stage lighting coordinated with local suppliers to the same standard you hear at our shows in Israel." },
    ],
    luxEyebrow: "LUXURY EVENTS",
    luxTitle: "The Ultimate KOLOT experience",
    luxText:
      "For the celebrations that have to be perfect: hand-picked musicians, original arrangements and a production designed around your story – in Israel or anywhere in the world.",
    partnersTitle: "Trusted by leading planners",
    processEyebrow: "HOW IT WORKS",
    processTitle: "From first call to last dance",
    process: [
      { title: "Tell us about your event", text: "Date, destination, guest count and the vibe you're dreaming of." },
      { title: "Your custom proposal", text: "A line-up and quote tailored to your venue, travel and program." },
      { title: "Planning together", text: "Video meetings with you and your planner: songs, moments, timeline." },
      { title: "Travel & production", text: "We handle the crew, gear and technical coordination with the venue." },
      { title: "The celebration", text: "You dance. We take care of everything else." },
    ],
    quote:
      "The timing of everything was perfection and the choice of songs was just perfect. You read the crowd, understood the atmosphere and helped create the framework for the simcha through the music.",
    quoteBy: "A KOLOT couple",
    finalTitle: "Let's make it unforgettable – anywhere.",
    finalText: "Tell us where and when. We'll get back to you within one business day with ideas and availability.",
    finalCta: "Start planning",
    teaserEyebrow: "KOLOT WORLDWIDE",
    teaserTitle: "Destination weddings & luxury events",
    teaserText: "Paris · Vienna · Italy · New York · California · couples from abroad in Israel",
    teaserCta: "Discover",
  },
  he: {
    metaTitle: "KOLOT Worldwide – חתונות יעד ואירועי יוקרה",
    metaDesc:
      "להקת קולות בחו״ל ובאירועי יוקרה: להקה חיה, זמרים ודיג׳יי לחתונות יעד – פריז, וינה, איטליה, ניו יורק, קליפורניה – ולזוגות מחו״ל שמתחתנים בישראל. מעל 1,500 אירועים.",
    eyebrow: "KOLOT WORLDWIDE",
    heroTitle: ["החגיגה שלכם.", "בכל מקום בעולם."],
    heroSub: "להקה חיה, זמרים ודיג׳יי לחתונות יעד ולאירועי יוקרה – מפריז, וינה ואיטליה ועד ניו יורק וקליפורניה, ולזוגות מחו״ל שחוגגים בישראל.",
    ctaPlan: "בואו נתכנן",
    ctaWatch: "לצפייה ברגעים",
    scroll: "גללו",
    stats: [
      { value: 1500, suffix: "+", label: "אירועים" },
      { value: 15, suffix: "", label: "שנים על הבמה" },
      { value: 3, suffix: "", label: "יבשות" },
    ],
    destEyebrow: "איפה כבר הופענו",
    destTitle: "מפריז ועד ניו יורק",
    destHint: "המשיכו לגלול",
    watch: "לצפייה באינסטגרם",
    expEyebrow: "חוויית קולות",
    expTitle: "כל מה שטס איתנו",
    experience: [
      { title: "צוות אחד, מהבית ועד הבמה", text: "זמרים, נגנים, דיג׳יי וטכנאי הסאונד שלנו טסים יחד – צוות אחד שיודע בדיוק איך לעשות לכם את הערב." },
      { title: "יד ביד עם המפיקה", text: "עובדים בשיתוף עם מפיקות וחברות הפקה מובילות בחו״ל – מהדרישות הטכניות ועד לוח הזמנים של הערב." },
      { title: "כל מסורת, כל קהל", text: "ריקודי שמחה, חסידי וישראלי, פופ בינלאומי וסטנדרטים של ג׳אז – אורחים מכל מדינה על אותה רחבה." },
      { title: "הרכב בהתאמה אישית", text: "מרביעיית כלי מיתר אינטימית לחופה ועד מחלקת נשיפה מלאה ואפטר פארטי לייב און דיג׳יי." },
      { title: "תכנון בין אזורי זמן", text: "פגישות תכנון בווידאו בעברית או באנגלית, איש קשר צמוד ורשימת שירים שנבנית יחד איתכם." },
      { title: "סאונד פרימיום, בכל מקום", text: "הגברה ותאורת במה בתיאום עם ספקים מקומיים – באותה רמה שאתם מכירים מההופעות שלנו בארץ." },
    ],
    luxEyebrow: "אירועי יוקרה",
    luxTitle: "חוויית ה-Ultimate של קולות",
    luxText: "לאירועים שחייבים להיות מושלמים: נגנים שנבחרו ביד, עיבודים מקוריים והפקה שנבנית סביב הסיפור שלכם – בארץ או בכל מקום בעולם.",
    partnersTitle: "עובדים עם המפיקות המובילות",
    processEyebrow: "איך זה עובד",
    processTitle: "מהשיחה הראשונה ועד הריקוד האחרון",
    process: [
      { title: "ספרו לנו על האירוע", text: "תאריך, יעד, מספר אורחים והאווירה שאתם חולמים עליה." },
      { title: "הצעה מותאמת אישית", text: "הרכב והצעת מחיר שמותאמים למקום, לנסיעות ולתוכנית הערב." },
      { title: "מתכננים יחד", text: "פגישות וידאו איתכם ועם המפיקה: שירים, רגעים, לוח זמנים." },
      { title: "טיסה והפקה", text: "אנחנו דואגים לצוות, לציוד ולתיאום הטכני מול המקום." },
      { title: "החגיגה", text: "אתם רוקדים. אנחנו דואגים לכל השאר." },
    ],
    quote:
      "התזמון של הכל היה מושלם ובחירת השירים פשוט מדויקת. קראתם את הקהל, הבנתם את האווירה ויצרתם דרך המוזיקה את המסגרת לשמחה.",
    quoteBy: "זוג של קולות",
    finalTitle: "בואו נעשה את זה בלתי נשכח – בכל מקום.",
    finalText: "ספרו לנו איפה ומתי. נחזור אליכם תוך יום עסקים עם רעיונות וזמינות.",
    finalCta: "מתחילים לתכנן",
    teaserEyebrow: "KOLOT WORLDWIDE",
    teaserTitle: "חתונות יעד ואירועי יוקרה",
    teaserText: "פריז · וינה · איטליה · ניו יורק · קליפורניה · זוגות מחו״ל בישראל",
    teaserCta: "לגלות עוד",
  },
};

export const INTL_ROUTES: Record<Lang, string> = { en: "/en/international/", he: "/international/" };
