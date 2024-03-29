const TOOLTIPS = [
  [
    "הועדה להעסקת יועץ תקשורת חיצוני",
    "ועדה מיוחדת באגף החשב הכללי שבמשרד האוצר, אשר דנה בבקשות משרדים ממשלתיים להעסקת יועצי תקשורת ויחסי ציבור, ובוחנת האם מדובר בצורך ממש חיוני ובהיעדר חשש לניגודי עניינים."
  ],
  [
    "ועדת מכרזים בין משרדית",
    "ועדת מכרזים לנושאים המשותפת למספר משרדים, אשר מונתה על ידי החשב הכללי, לפי תקנה 8(ד) לתח\"ם.​"
  ],
  [
    "התקשרויות רלוונטיות",
    "התקשרות בין גורם ממשלתי לספק/ים שמקושרות, על פי המידע של הגורם הממשלתי הרלוונטי, להליך של מכרז או פטור ממכרז."
  ],
  [
    "ועדת הפטור המרכזית",
    "וועדת הפטור המרכזית באגף החשב הכללי דנה ברמה המהותית בבקשות המשרדים לפטור ממכרז. ועדת הפטור המרכזית לא דנה בכל בקשות המשרדים לפטור ממכרז, שכן חלקן מתנהלות בתוך המשרד, וזאת על פי הקבוע בתקנות חובת המכרזים"
  ],
  [
    "מינהל הרכש הממשלתי",
    "מינהל הרכש הממשלתי הינו גוף באגף החשב הכללי במשרד האוצר, האחראי על ביצוע רכש מרכזי, בגיבוש מדיניות לביצוע רכש במגזר הממשלתי ובסיוע לגופים ממשלתיים בביצוע ויישום מדיניות הרכש במשרדם."
  ],
  [
    "מנהל הרכש הממשלתי",
    "מינהל הרכש הממשלתי הינו גוף באגף החשב הכללי במשרד האוצר, האחראי על ביצוע רכש מרכזי, בגיבוש מדיניות לביצוע רכש במגזר הממשלתי ובסיוע לגופים ממשלתיים בביצוע ויישום מדיניות הרכש במשרדם."
  ],
  [
    "דיווחים רבעוניים",
    "כל משרדי הממשלה ויחידות הסמך מחוייבים לפרסם באופן יזום דו\"חות רבעוניים אודות התקשרויותיהם עם גורמים חיצוניים, למעט במקרים בעלי רגישות מיוחדת. הדו\"חות מפורסמים באתר המרכזי לחופש המידע (foi.gov.il)."
  ],
  [
    "התקשרויות פעילות",
    "התקשרות שעל פי הפרסום עוד לא הגיע תאריך הסיום שלה או שתועדה העברת כספים ב-6 החודשים האחרונים במידה ולא פורסם תאריך סיום משוער."
  ],
  [
    "התקשרות רלוונטית",
    "התקשרות בין גורם ממשלתי לספק/ים שמקושרות, על פי דוחות ממשלתיים, להליך המכרז או הפטור ממכרז (שימו לב שלעיתים נופלות טעויות בדוחות אלו)"
  ],
  [
    "סוג המכרז: מרכזי",
    "מכרז הנערך מטעם החשב הכללי בעבור המשרדים. ​"
  ],
  [
    "דו\"חות רבעוניים",
    "כל משרדי הממשלה ויחידות הסמך מחוייבים לפרסם באופן יזום דו\"חות רבעוניים אודות התקשרויותיהם עם גורמים חיצוניים, למעט במקרים בעלי רגישות מיוחדת. הדו\"חות מפורסמים באתר המרכזי לחופש המידע (foi.gov.il)."
  ],
  [
    "להירשם להתראות",
    "זה פשוט: הזינו מילות חיפוש בראש המסך ולחצו על הכוכב שנמצא בשורת החיפוש. (דורש התחברות באמצעות חשבון ג'ימייל)"
  ],
  [
    "התקשרות פעילה",
    "התקשרות שעל פי הפרסום עוד לא הגיע תאריך הסיום שלה או שתועדה העברת כספים ב-6 החודשים האחרונים במידה ולא פורסם תאריך סיום משוער."
  ],
  [
    "המכרז המרכזי",
    "מכרז הנערך מטעם החשב הכללי בעבור המשרדים. ​"
  ],
  [
    "המכרז המשרדי",
    "מכרזים המתפרסמים על ידי משרדי הממשלה ויחידות הסמך."
  ],
  [
    "התקשרות המשך",
    "התקשרות הנעשית להרחבת התקשרות ראשונה או להארכת התקשרות ראשונה, שלא מכוח זכות ברירה הנתונה למשרד הכלולה בהתקשרות הראשונה."
  ],
  [
    "בקשה למחיקה",
    "הגורם שפרסם את בקשת ההתקשרות במסגרת פטור מבקש לבטל את הבקשה להתקשר עם הספק/ים בצורה זו."
  ],
  [
    "תכ\"ם 7.12.1",
    "קיימות נסיבות שבהן משרדי הממשלה ויחידות הסמך מבצעות רכש מגופים ממשלתיים, מחברות ממשלתיות ומתאגידים. נוהל זה כולל הנחיות לרכישת טובין או שירותים מגופים ממשלתיים יבוצעו בהתאם לרשימת הגופים הממשלתיים המספקים טובין ושירותים, ובכפוף לתחומי הפעילות המפורטים בנוהל."
  ],
  [
    "זכות ברירה",
    "\"אופציה\", זכות המוקנית למשרד מכח ההסכם להאריך את ההתקשרות לתקופות נוספות ו/או להרחיב את ההתקשרות לנושאים נוספים כפי המוגדר בהסכם. בחלק מהמקרים בהם קיימת זכות ברירה – טרם מימושה, תשקול ועדת המכרזים האם לבצע הליך בחינת קיומם של ספקים, בהתאם לנסיבות העניין.\n"
  ],
  [
    "מינהל הרכש",
    "מינהל הרכש הממשלתי הינו גוף באגף החשב הכללי במשרד האוצר, האחראי על ביצוע רכש מרכזי, בגיבוש מדיניות לביצוע רכש במגזר הממשלתי ובסיוע לגופים ממשלתיים בביצוע ויישום מדיניות הרכש במשרדם."
  ],
  [
    "מכרז מרכזי",
    "מכרז הנערך מטעם החשב הכללי בעבור המשרדים. ​"
  ],
  [
    "מכרז משרדי",
    "מכרזים המתפרסמים על ידי משרדי הממשלה ויחידות הסמך."
  ],
  [
    "מכרז פומבי",
    "מכרז שבו הפנייה לקבלת הצעות נעשית בהודעה לציבור המתפרסמת לפי תקנה 15 לתקנות חובת המכרזים תשנ\"ג-1993."
  ],
  [
    "מצאנו מידע",
    "כל המידע המוצג כאן מתבסס על פרסומים של גופים ממשלתיים שונים ורבים. קראו עוד בעמוד ה\"אודות\"."
  ],
  [
    "הסכם מסגרת",
    "הסכם לרכישת טובין, עבודה או שירותים, שנכרת עם ספק מכרז מסגרת בנושא מסויים ולתקופה מוגדרת, כאשר המפרט (העבודה או השירותים, כמותם או היקפם), אינו ידוע במועד כריתת ההסכם, והוא נקבע בידי המזמין, בדרך של ביצוע הזמנות מפעם לפעם, בתקופת ההסכם."
  ],
  [
    "מבחן תמיכה",
    "מבחני תמיכה הם הוראות עקרוניות הקובעות קריטריונים אשר על פיהם ניתן להעניק תמיכה מתקציב המדינה למוסדות ציבור...סכום תמיכה הכולל יחולק על פי מבחני תמיכה שוויוניים, אותם קובע השר הממונה על סעיף התקציב, בהתייעצות עם היועץ המשפטי לממשלה ובאישורו.\n\nמקור: אתר משרד הבריאות."
  ],
  [
    "רלוונטיות",
    "התקשרות בין גורם ממשלתי לספק/ים שמקושרות, על פי דוחות ממשלתיים, להליך המכרז או הפטור ממכרז (שימו לב שלעיתים נופלות טעויות בדוחות אלו)"
  ],
  [
    "מנהל הרכש",
    "מינהל הרכש הממשלתי הינו גוף באגף החשב הכללי במשרד האוצר, האחראי על ביצוע רכש מרכזי, בגיבוש מדיניות לביצוע רכש במגזר הממשלתי ובסיוע לגופים ממשלתיים בביצוע ויישום מדיניות הרכש במשרדם."
  ],
  [
    "מכרז סגור",
    "מכרז שבו הפנייה לקבל הצעות מופנית לספקים מסוימים בלבד."
  ],
  [
    "בהתקשרות",
    "הסכם בין המשרד הממשלתי לגורם אחר, במסגרתו מתחייב הגורם הנוסף לספק למשרד הממשלתי שירותים או מוצרים תמורת תשלום."
  ],
  [
    "ספק יחיד",
    "הספק היחיד שמסוגל לבצע את נושא ההתקשרות לפי זכות מכוח הדין או בהתאם למצב הדברים בפועל, על פי תקנה 3(29) לתקנות חובת המכרזים תשנ\"ג-1993​\n"
  ],
  [
    "לא פעיל",
    "תאריך התפוגה שפורסם חלף, או שלא פורסם תאריך סיום וחלפו 6 חודשים מאז העדכון האחרון."
  ],
  [
    "תמיכה ",
    "תמיכה ממשלתית היא סיוע, בכסף ובשווה כסף, שממשלת ישראל מעבירה לגורמים חוץ ממשלתיים. במטרה לסייע במימון פעילות אשר היא מעוניינת לעודד את קיומה ואשר משרתת את אוכלוסייתה."
  ],
  [
    "תמיכות",
    "תמיכה ממשלתית היא סיוע, בכסף ובשווה כסף, שממשלת ישראל מעבירה לגורמים חוץ ממשלתיים. במטרה לסייע במימון פעילות אשר היא מעוניינת לעודד את קיומה ואשר משרתת את אוכלוסייתה."
  ],
  [
    "RFI",
    "קול קורא לקבלת מידע"
  ]
];

export function tooltip(content: string) {
  if (!content) {
    return '';
  }
  for (let i = 0 ; i < TOOLTIPS.length ; i++ ) {
    const k = TOOLTIPS[i][0];
    const repl = 'TTT' + i + 'PPP';
    if (content.indexOf(k) >= 0) {
      content = content.replace(k, repl);
    }
  }
  for (let i = 0 ; i < TOOLTIPS.length ; i++ ) {
    const k = 'TTT' + i + 'PPP';
    const repl = `${TOOLTIPS[i][0]} <span class='bk-tooltip-anchor'><img src='assets/common/img/help.svg'><span class='bk-tooltip'>` +
    TOOLTIPS[i][1] +
          ` <span class='mobile-tooltip-instruction'>(לסגירה לחצו מחוץ לתיבה זו)</span></span></span>`;
    if (content.indexOf(k) >= 0) {
      content = content.replace(k, repl);
    }
  }
  return content;
}
