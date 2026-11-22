import type { ReactNode } from "react";
import { CONTACT, LEGAL } from "./site";
import type { Lang } from "./types";

/** Highlights values that still have to be filled in (see LEGAL in lib/site.ts). */
const P = ({ children }: { children: ReactNode }) => <span className="placeholder">{children}</span>;

export type LegalKey = "accessibility" | "privacy" | "cookies" | "terms";

export const LEGAL_ROUTES: Record<LegalKey, Record<Lang, string>> = {
  accessibility: { he: "/accessibility-statement/", en: "/en/accessibility-statement/" },
  privacy: { he: "/privacy-policy/", en: "/en/privacy-policy/" },
  cookies: { he: "/cookie-policy/", en: "/en/cookie-policy/" },
  terms: { he: "/terms/", en: "/en/terms/" },
};

const mail = <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;
const phone = <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>;

export const LEGAL_PAGES: Record<LegalKey, Record<Lang, { title: string; body: ReactNode }>> = {
  /* ------------------------------------------------------------------ accessibility */
  accessibility: {
    he: {
      title: "הצהרת נגישות",
      body: (
        <>
          <p>
            להקת קולות (KOLOT) רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשים, ובכלל זה לאנשים עם מוגבלות. אנו פועלים להנגיש את האתר בהתאם לחוק
            שוויון זכויות לאנשים עם מוגבלות, התשנ״ח-1998, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.
          </p>
          <h2>רמת הנגישות באתר</h2>
          <p>
            האתר נבנה בהתאם להנחיות התקן הישראלי ת״י 5568 המבוסס על הנחיות WCAG 2.0 של ארגון W3C, ברמת התאמה AA, ונבדק בדפדפנים המובילים (Chrome,
            Safari, Edge, Firefox) ובמכשירים ניידים.
          </p>
          <h2>התאמות שבוצעו באתר</h2>
          <ul>
            <li>מבנה כותרות היררכי, אזורי ניווט מסומנים וקישור „דלג לתוכן הראשי”.</li>
            <li>תמיכה מלאה בניווט מקלדת, כולל סימון פוקוס בולט, סגירת תפריטים וחלונות בלחיצה על Esc.</li>
            <li>טקסט חלופי לתמונות משמעותיות ותוויות לכפתורים ולקישורים המבוססים על אייקונים.</li>
            <li>הגדרת שפה וכיווניות (עברית/אנגלית) לכל עמוד ולכל פסקה באנגלית.</li>
            <li>כיבוד הגדרת „הפחתת תנועה” של מערכת ההפעלה – אנימציות מבוטלות אוטומטית.</li>
            <li>
              תפריט נגישות (הכפתור העגול בפינת המסך) המאפשר: הגדלה והקטנה של הטקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים וכותרות, גופן קריא,
              ריווח טקסט, סמן גדול ועצירת אנימציות. ההגדרות נשמרות לביקור הבא.
            </li>
            <li>סרטונים נפתחים רק בלחיצה ואינם מתנגנים אוטומטית עם קול.</li>
          </ul>
          <h2>חלקים שאינם נגישים במלואם</h2>
          <p>
            תכנים מוטמעים מ-YouTube ומאינסטגרם מסופקים על ידי צדדים שלישיים ואינם בשליטתנו המלאה. אם
            נתקלתם בקושי – נשמח לקבל את פנייתכם גם בטלפון או בדוא״ל.
          </p>
          <h2>פרטי רכז/ת הנגישות</h2>
          <ul>
            <li>
              שם: <P>{LEGAL.accessibilityContact}</P>
            </li>
            <li>טלפון: {phone}</li>
            <li>דוא״ל: {mail}</li>
          </ul>
          <p>נשתדל להשיב לכל פנייה בתוך 14 ימי עבודה. בפנייה מומלץ לפרט את העמוד, תיאור הבעיה וסוג הדפדפן/הטכנולוגיה המסייעת.</p>
          <h2>הסדרי נגישות בשירות</h2>
          <p>
            השירות של קולות ניתן באולמות ובמקומות האירוע שבחרו הלקוחות. נגישות המבנה היא באחריות בעלי המקום. פגישות תכנון יכולות להתקיים גם בטלפון
            או בשיחת וידאו לפי בקשה.
          </p>
          <p>תאריך עדכון ההצהרה: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
    en: {
      title: "Accessibility Statement",
      body: (
        <>
          <p>
            KOLOT is committed to providing equal access to everyone, including people with disabilities. This site is designed to comply with the Israeli
            Equal Rights for Persons with Disabilities Law (1998) and the Accessibility Regulations for Services (2013).
          </p>
          <h2>Conformance level</h2>
          <p>
            The site follows Israeli Standard IS 5568, based on the W3C Web Content Accessibility Guidelines (WCAG) 2.0, level AA, and was tested on the major
            browsers and on mobile devices.
          </p>
          <h2>What we did</h2>
          <ul>
            <li>Semantic heading structure, labelled navigation regions and a “skip to main content” link.</li>
            <li>Full keyboard navigation with a visible focus indicator; menus and dialogs close with Esc.</li>
            <li>Alternative text for meaningful images and labels for icon-only buttons and links.</li>
            <li>Language and text direction declared for every page and English paragraph.</li>
            <li>The operating system “reduce motion” setting is respected – animations are switched off automatically.</li>
            <li>
              An accessibility menu (round button in the corner of the screen): text size, high contrast, grayscale, highlighted links and headings, readable
              font, text spacing, big cursor and stop animations. Your settings are remembered.
            </li>
            <li>Videos only start when you press play.</li>
          </ul>
          <h2>Known limitations</h2>
          <p>
            Embedded YouTube and Instagram content is provided by third parties that we do not fully control. If anything is hard to use, please contact us by phone or email.
          </p>
          <h2>Accessibility coordinator</h2>
          <ul>
            <li>
              Name: <P>{LEGAL.accessibilityContact}</P>
            </li>
            <li>Phone: {phone}</li>
            <li>Email: {mail}</li>
          </ul>
          <p>We aim to answer within 14 business days. Please tell us the page, the problem and the browser / assistive technology you use.</p>
          <p>Last updated: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
  },

  /* ------------------------------------------------------------------ privacy */
  privacy: {
    he: {
      title: "מדיניות פרטיות",
      body: (
        <>
          <p>
            מדיניות זו מסבירה איזה מידע אנו אוספים באתר kolotband.co.il, למה ואיך אנחנו משתמשים בו, בהתאם לחוק הגנת הפרטיות, התשמ״א-1981 (כולל תיקון
            13) ולתקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017.
          </p>
          <h2>מי אחראי על המידע</h2>
          <p>
            <P>{LEGAL.businessName}</P>, <P>{LEGAL.businessId}</P>, <P>{LEGAL.address}</P> („קולות”, „אנחנו”). ליצירת קשר בנושאי פרטיות: {mail}.
          </p>
          <h2>איזה מידע נאסף</h2>
          <ul>
            <li>
              <strong>פרטים שתמסרו בטופס יצירת הקשר</strong> – שם, טלפון, דוא״ל, סוג ותאריך האירוע, מיקום, קרבה לבעלי השמחה, איך שמעתם עלינו ופרטים
              נוספים שתבחרו לכתוב. מסירת המידע אינה חובה חוקית, אך בלעדיו לא נוכל לחזור אליכם.
            </li>
            <li>
              <strong>מידע טכני וסטטיסטי</strong> – רק אם אישרתם עוגיות סטטיסטיקה: נתוני שימוש באתר דרך Google Tag Manager / Google Analytics (כגון עמודים
              שנצפו, סוג מכשיר ומיקום משוער).
            </li>
            <li>
              <strong>העדפות</strong> – בחירת העוגיות והגדרות הנגישות נשמרות בדפדפן שלכם בלבד.
            </li>
          </ul>
          <h2>למה אנחנו משתמשים במידע</h2>
          <ul>
            <li>לחזור אליכם, להציע הצעת מחיר ולתאם את האירוע.</li>
            <li>לנהל את קשרי הלקוחות שלנו (מערכת Zooglot).</li>
            <li>לשפר את האתר ואת השירות (בהסכמה בלבד).</li>
            <li>לעמוד בדרישות החוק.</li>
          </ul>
          <p>לא נשלח לכם דיוור שיווקי ללא הסכמה מפורשת, בהתאם לסעיף 30א לחוק התקשורת (בזק ושידורים).</p>
          <h2>עם מי המידע משותף</h2>
          <ul>
            <li>
              <strong>Zooglot</strong> – מערכת ניהול הלידים שלנו (מאוחסנת ב-Railway וב-Supabase), אליה נשלחים פרטי הטופס. ממנה נשלחת אליכם הודעת אישור בוואטסאפ ממספר הלהקה (אם אישרתם זאת בטופס) ומייל אישור דרך Resend.
            </li>
            <li>
              <strong>Google</strong> – Tag Manager / Analytics, רק בהסכמה.
            </li>
            <li>
              <strong>ספקי אחסון</strong> – האתר מאוחסן ב-Vercel.
            </li>
          </ul>
          <p>חלק מהספקים מאחסנים מידע מחוץ לישראל (בין היתר בארה״ב ובאיחוד האירופי), בהתאם לתקנות העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה.</p>
          <p>איננו מוכרים מידע אישי לאף אחד.</p>
          <h2>כמה זמן נשמור את המידע</h2>
          <p>פרטי פניות נשמרים כל עוד הם נחוצים לטיפול בפנייה ולקשר העסקי, ולא יותר מ-3 שנים מהפנייה האחרונה, אלא אם החוק מחייב אחרת.</p>
          <h2>אבטחת מידע</h2>
          <p>האתר מוגש בחיבור מוצפן (HTTPS) והגישה למידע מוגבלת לבעלי תפקידים בלבד. עם זאת, אין אבטחה מושלמת ברשת.</p>
          <h2>הזכויות שלכם</h2>
          <p>
            אתם רשאים לעיין במידע שנשמר עליכם, לבקש לתקן או למחוק אותו ולחזור בכם מהסכמה לעוגיות בכל עת (קישור „הגדרות עוגיות” בתחתית כל עמוד). פנו
            אלינו ב-{mail} ונשיב בתוך 30 יום. ניתן גם לפנות לרשות להגנת הפרטיות.
          </p>
          <h2>קטינים</h2>
          <p>האתר אינו מיועד לאיסוף מידע מקטינים מתחת לגיל 18 ללא הסכמת הורה.</p>
          <h2>שינויים</h2>
          <p>נעדכן מדיניות זו מעת לעת. עדכון אחרון: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
    en: {
      title: "Privacy Policy",
      body: (
        <>
          <p>
            This policy explains what information we collect on kolotband.co.il, why, and how we use it, in line with the Israeli Privacy Protection Law
            (1981, including Amendment 13) and the Privacy Protection (Data Security) Regulations (2017).
          </p>
          <h2>Who is responsible</h2>
          <p>
            <P>{LEGAL.businessName}</P>, <P>{LEGAL.businessId}</P>, <P>{LEGAL.address}</P> (“KOLOT”, “we”). Privacy contact: {mail}.
          </p>
          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Contact form details</strong> – name, phone, email, event type and date, location, relation to the hosts, how you heard about us and
              anything you choose to add. You are not legally required to provide them, but without them we cannot get back to you.
            </li>
            <li>
              <strong>Usage statistics</strong> – only if you accept statistics cookies: data collected by Google Tag Manager / Google Analytics (pages
              viewed, device type, approximate location).
            </li>
            <li>
              <strong>Preferences</strong> – your cookie choice and accessibility settings are stored in your own browser only.
            </li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To get back to you, send a quote and plan your event.</li>
            <li>To manage our customer relationships (Zooglot CRM).</li>
            <li>To improve the website and our service (with consent only).</li>
            <li>To comply with the law.</li>
          </ul>
          <p>We never send marketing messages without your explicit consent.</p>
          <h2>Who we share it with</h2>
          <ul>
            <li>
              <strong>Zooglot</strong> – our lead management app (hosted on Railway and Supabase) that receives the form. It sends you a WhatsApp confirmation from the band's number (if you agreed in the form) and a confirmation email through Resend.
            </li>
            <li>
              <strong>Google</strong> – Tag Manager / Analytics, with consent only.
            </li>
            <li>
              <strong>Hosting</strong> – the site is hosted on Vercel.
            </li>
          </ul>
          <p>Some providers store data outside Israel (including the US and the EU). We never sell personal data.</p>
          <h2>Retention</h2>
          <p>Enquiries are kept as long as needed to handle them and for our business relationship, and no longer than 3 years after the last contact unless the law requires otherwise.</p>
          <h2>Security</h2>
          <p>The site is served over HTTPS and access to personal data is limited to authorised people. No online system is 100% secure.</p>
          <h2>Your rights</h2>
          <p>
            You may access, correct or delete your data and withdraw cookie consent at any time (“Cookie settings” link at the bottom of every page). Email{" "}
            {mail} and we will respond within 30 days. You may also contact the Israeli Privacy Protection Authority.
          </p>
          <h2>Changes</h2>
          <p>We may update this policy from time to time. Last updated: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
  },

  /* ------------------------------------------------------------------ cookies */
  cookies: {
    he: {
      title: "מדיניות עוגיות",
      body: (
        <>
          <p>
            עוגיות (Cookies) ואחסון מקומי הם קבצים קטנים שנשמרים בדפדפן. אנחנו משתמשים בעוגיות הכרחיות בלבד כברירת מחדל, ובשאר העוגיות רק לאחר
            שאישרתם זאת בבאנר העוגיות. אפשר לשנות את הבחירה בכל עת בקישור „הגדרות עוגיות” בתחתית העמוד.
          </p>
          <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>שם</th>
                <th>ספק</th>
                <th>קטגוריה</th>
                <th>מטרה</th>
                <th>תוקף</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>kolot-consent-v1</td>
                <td>קולות (אחסון מקומי)</td>
                <td>הכרחית</td>
                <td>שמירת בחירת העוגיות שלכם</td>
                <td>עד מחיקה</td>
              </tr>
              <tr>
                <td>kolot-a11y-v1</td>
                <td>קולות (אחסון מקומי)</td>
                <td>הכרחית</td>
                <td>שמירת הגדרות הנגישות</td>
                <td>עד מחיקה</td>
              </tr>
              <tr>
                <td>kolot-lead-draft-v1</td>
                <td>קולות (אחסון מקומי)</td>
                <td>הכרחית</td>
                <td>שמירת טופס יצירת קשר שמולא חלקית, עד לשליחה</td>
                <td>עד שליחה או מחיקה</td>
              </tr>
              <tr>
                <td>_ga, _ga_*</td>
                <td>Google Analytics (דרך Google Tag Manager)</td>
                <td>סטטיסטיקה</td>
                <td>מדידת שימוש אנונימית</td>
                <td>עד שנתיים</td>
              </tr>
              <tr>
                <td>עוגיות Instagram / Meta</td>
                <td>Meta</td>
                <td>שיווק ותוכן מוטמע</td>
                <td>הצגת סרטון אינסטגרם בעמוד הדיג׳ייז</td>
                <td>לפי מדיניות Meta</td>
              </tr>
              <tr>
                <td>עוגיות YouTube</td>
                <td>Google (youtube-nocookie.com)</td>
                <td>תוכן מוטמע</td>
                <td>נגן הווידאו – נטען רק כשלוחצים על „נגן”</td>
                <td>לפי מדיניות Google</td>
              </tr>
            </tbody>
          </table>
          </div>
          <h2>איך לחסום עוגיות</h2>
          <p>בנוסף לבאנר, ניתן לחסום או למחוק עוגיות בהגדרות הדפדפן. חסימת עוגיות הכרחיות עלולה לפגוע בתפקוד האתר.</p>
          <p>עדכון אחרון: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
    en: {
      title: "Cookie Policy",
      body: (
        <>
          <p>
            Cookies and local storage are small files saved in your browser. By default we only use necessary storage; everything else is used only after you
            agree in the cookie banner. You can change your choice at any time via “Cookie settings” at the bottom of every page.
          </p>
          <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Category</th>
                <th>Purpose</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>kolot-consent-v1</td>
                <td>KOLOT (local storage)</td>
                <td>Necessary</td>
                <td>Remembers your cookie choice</td>
                <td>Until deleted</td>
              </tr>
              <tr>
                <td>kolot-a11y-v1</td>
                <td>KOLOT (local storage)</td>
                <td>Necessary</td>
                <td>Remembers accessibility settings</td>
                <td>Until deleted</td>
              </tr>
              <tr>
                <td>kolot-lead-draft-v1</td>
                <td>KOLOT (local storage)</td>
                <td>Necessary</td>
                <td>Keeps a half-filled contact form until it is sent</td>
                <td>Until sent or deleted</td>
              </tr>
              <tr>
                <td>_ga, _ga_*</td>
                <td>Google Analytics (via Google Tag Manager)</td>
                <td>Statistics</td>
                <td>Anonymous usage measurement</td>
                <td>Up to 2 years</td>
              </tr>
              <tr>
                <td>Instagram / Meta cookies</td>
                <td>Meta</td>
                <td>Marketing & embedded content</td>
                <td>Shows the Instagram video on the DJs page</td>
                <td>Per Meta policy</td>
              </tr>
              <tr>
                <td>YouTube cookies</td>
                <td>Google (youtube-nocookie.com)</td>
                <td>Embedded content</td>
                <td>Video player – loaded only when you press play</td>
                <td>Per Google policy</td>
              </tr>
            </tbody>
          </table>
          </div>
          <h2>Blocking cookies</h2>
          <p>You can also block or delete cookies in your browser settings. Blocking necessary storage may affect how the site works.</p>
          <p>Last updated: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
  },

  /* ------------------------------------------------------------------ terms */
  terms: {
    he: {
      title: "תנאי שימוש",
      body: (
        <>
          <p>השימוש באתר kolotband.co.il כפוף לתנאים הבאים. השימוש באתר מהווה הסכמה להם. התנאים מנוסחים בלשון זכר מטעמי נוחות ומיועדים לכל המגדרים.</p>
          <h2>המידע באתר</h2>
          <p>
            המידע באתר, לרבות תיאורי החבילות והמחירים, נועד להתרשמות כללית בלבד ואינו מהווה הצעה מחייבת. המחירים המוצגים תקפים
            לאירועים באזור שבין חדרה לגדרה; מעבר לאזורים אלה ייתכנו תוספות נסיעה. הצעת מחיר מחייבת תינתן בכתב לאחר בירור פרטי האירוע. הרכבת תאורה בהתאם לאישור המקום.
          </p>
          <h2>קניין רוחני</h2>
          <p>
            כל התכנים באתר – לרבות הלוגו, התמונות, הסרטונים, העיצוב והטקסטים – שייכים לקולות או לבעלי זכויות שהתירו את השימוש בהם. אין להעתיק, להפיץ או
            לעשות בהם שימוש מסחרי ללא אישור בכתב.
          </p>
          <h2>תכנים של צדדים שלישיים</h2>
          <p>האתר כולל קישורים ותכנים מוטמעים (YouTube, Instagram). איננו אחראים לתכנים או למדיניות של אתרים אלה.</p>
          <h2>המלצות לקוחות</h2>
          <p>ההמלצות באתר נכתבו על ידי לקוחות אמיתיים ומובאות כפי שנשלחו אלינו.</p>
          <h2>הגבלת אחריות</h2>
          <p>אנו עושים מאמץ שהאתר יהיה זמין ומדויק, אך הוא ניתן כמות שהוא (AS IS) ואיננו אחראים לנזק שייגרם משימוש בו או מהסתמכות על המידע בו.</p>
          <h2>דין וסמכות שיפוט</h2>
          <p>על תנאים אלה יחולו דיני מדינת ישראל, וסמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז <P>[מחוז]</P>.</p>
          <p>
            יצירת קשר: {mail} | {phone}
          </p>
          <p>עדכון אחרון: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
    en: {
      title: "Terms of Use",
      body: (
        <>
          <p>Use of kolotband.co.il is subject to these terms. By using the site you agree to them.</p>
          <h2>Information on the site</h2>
          <p>
            Package descriptions and prices are for general information only and are not a binding offer. Prices apply to events between Hadera and Gedera;
            travel supplements may apply elsewhere. A binding quote is given in writing once the event details are known. Lighting rig subject to venue approval.
          </p>
          <h2>Intellectual property</h2>
          <p>
            All content – logo, photos, videos, design and text – belongs to KOLOT or to right holders who allowed its use. Do not copy, distribute or use it
            commercially without written permission.
          </p>
          <h2>Third-party content</h2>
          <p>The site contains links and embedded content (YouTube, Instagram). We are not responsible for their content or policies.</p>
          <h2>Testimonials</h2>
          <p>Testimonials were written by real customers and are shown as they were sent to us.</p>
          <h2>Limitation of liability</h2>
          <p>The site is provided “as is”. We are not liable for damage caused by using it or by relying on its content.</p>
          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the State of Israel; the competent courts of <P>[district]</P> have exclusive jurisdiction.
          </p>
          <p>
            Contact: {mail} | {phone}
          </p>
          <p>Last updated: {LEGAL.lastUpdated}</p>
        </>
      ),
    },
  },
};
