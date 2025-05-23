export default [
  {
    text: "פירוט כל הכספים שהארגון קיבל ב <period>",
    query: ["with a as (",
    "select year_paid as \"שנה\", budget_code as \"תקנה תקציבית\", budget_code, supporting_ministry->>0 as \"משרד\", amount_paid as \"סך כולל\", support_title as \"תיאור\", 'תמיכה' as \"סוג ההוצאה\"",
    "from  supports_by_payment_year where entity_id = ':id' and amount_paid>0 and year_paid :period union",
    "select min_year as \"שנה\", budget_code as \"תקנה תקציבית\", budget_code, publisher_name as \"משרד\", executed as \"סך כולל\", purpose as \"תיאור\", 'רכש' as \"סוג ההוצאה\"",
    "from contract_spending where entity_id = ':id' and executed > 0 and min_year :period)",
    "select * from a order by \"שנה\" desc, \"סך כולל\" desc"
    ],
    parameters: {
      period: {
        "כל השנים": ">0",
        "2008": "=2008",
        "2009": "=2009",
        "2010": "=2010",
        "2011": "=2011",
        "2012": "=2012",
        "2013": "=2013",
        "2014": "=2014",
        "2015": "=2015",
        "2016": "=2016",
        "2017": "=2017",
        "2018": "=2018",
        "2019": "=2019",
        "2020": "=2020",
        "2021": "=2021",
        "2022": "=2022",
        "2023": "=2023",
        "2024": "=2024",
        "2025": "=2025",
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
      "שנה",
      "תקנה תקציבית:budget_code:search_term(budget_code)",
      "משרד", 
      "סך כולל:number",
      "תיאור",
      "סוג ההוצאה"
    ]
  },
  {
    text: "התקנות מהן הארגון קיבל תמיכות, לפי סה״כ כספים עבור בקשות שאושרו ב <period>",
    query: ["SELECT SUPPORT_TITLE AS \"נושא\", ", 
              "budget_code, ", 
              "budget_code \"מספר תקנה\", ", 
              "sum(amount_approved) as \"סה״כ אושר\", ",
              "sum(amount_paid) as \"סה״כ שולם\", ",
              "min(year_requested) || '-' || max(year_requested)  as \"תקופה\" ",
              "FROM raw_supports WHERE year_requested :period AND  entity_id=':id' GROUP BY 1, 2, 3 ORDER BY 3 DESC nulls last"],
    parameters: {
      period: {
        "כל השנים": ">0",
        "2008": "=2008",
        "2009": "=2009",
        "2010": "=2010",
        "2011": "=2011",
        "2012": "=2012",
        "2013": "=2013",
        "2014": "=2014",
        "2015": "=2015",
        "2016": "=2016",
        "2017": "=2017",
        "2018": "=2018",
        "2019": "=2019",
        "2020": "=2020",
        "2021": "=2021",
        "2022": "=2022",
        "2023": "=2023",
        "2024": "=2024",
        "2025": "=2025"
      }
    },
    headers: [
      "נושא",
      "מספר תקנה:budget_code:search_term(budget_code)",
      "סה״כ אושר:number",
      "סה״כ שולם:number",
      "תקופה"
    ],
    defaults: {
      period: "כל השנים"
    }
  },
  {
    text: " פירוט כלל התמיכות לארגון שאושרו ב <period>",
    query: ["SELECT year_requested AS \"שנה\",",
              "supporting_ministry AS \"משרד\",",
              "request_type AS \"סוג תמיכה\",",
              "support_title AS \"נושא\", ",
              "'supports/' || budget_code || '/' || year_requested || '/' || coalesce(entity_id, recipient) || '/' || request_type AS item_id, ",
              "sum(amount_approved) as \"סה״כ אושר\",",
              "sum(amount_paid) as \"סה״כ שולם\"",
              "FROM raw_supports WHERE year_requested :period AND entity_id=':id' GROUP BY 1, 2, 3, 4, 5"],
    parameters: {
      period: {
        "כל השנים": ">0",
        "2008": "=2008",
        "2009": "=2009",
        "2010": "=2010",
        "2011": "=2011",
        "2012": "=2012",
        "2013": "=2013",
        "2014": "=2014",
        "2015": "=2015",
        "2016": "=2016",
        "2017": "=2017",
        "2018": "=2018",
        "2019": "=2019",
        "2020": "=2020",
        "2021": "=2021",
        "2022": "=2022",
        "2023": "=2023",
        "2024": "=2024",
        "2025": "=2025"
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
      "נושא:item_link(item_id)", 
      "משרד", 
      "סוג תמיכה",
      "שנה",
      "סה״כ אושר:number",
      "סה״כ שולם:number"
    ]
  },
  {
    text: "המכרזים והפטורים ממכרז עם הארגון - <scope>",
    query: ["select tender_type_he as \"סוג הליך הרכש\",",
              "coalesce(page_title, description) as \"כותרת\",",
              "regulation as \"תקנהֿ\",",
              "publisher as \"מפרסם\",",
              "volume as \"היקף\",", 
              "description as \"תיאור\", ", 
              "'tenders/' || tender_type || '/' || publication_id || '/' || tender_id as item_id, ", 
              "date(claim_date) as \"מועד סיום התהליך\",",
              "start_date as \"תחילת ההתקשרות\",",
              "end_date as \"סיום ההתקשרות\",",
              "soproc_tender as \"רכש חברתי\"",
              "from procurement_tenders_processed",
              "where (entity_id=':id' or",
              "awardees::text like '%%:id%%') and :scope"],
    headers: [
      "סוג הליך הרכש",
      "כותרת:item_link(item_id)",
      "תקנהֿ",
      "מפרסם",
      "תיאור",
      "היקף:number",
      "מועד סיום התהליך",
      "תחילת ההתקשרות",
      "סיום ההתקשרות",
      "רכש חברתי:yesno"
    ],
    parameters: {
      scope: {
        "הכל": "true",
        "רכש חברתי": "soproc_tender is true"
      }
    },
    defaults: {
      scope: "הכל"
    }
  },
  {
    text: "הנושאים בהם קיבל הארגון תמיכה, עבור בקשות שאושרו ב <period>",
    query: ["SELECT supporting_ministry as \"משרד\",",
              "support_title AS \"נושא\", ", 
              "budget_code,", 
              "budget_code AS \"מספר תקנה\", ", 
              "sum(amount_approved) as \"סה״כ אושר\",",
              "sum(amount_paid) as \"סה״כ שולם\",",
              "min(year_requested) || '-' || max(year_requested)  as \"תקופה\" ", 
              "FROM raw_supports WHERE year_requested :period AND entity_id = ':id' GROUP BY 1, 2, 3 ORDER BY 5 DESC nulls last"],
    parameters: {
      period: {
        "כל השנים": ">0",
        "2008": "=2008",
        "2009": "=2009",
        "2010": "=2010",
        "2011": "=2011",
        "2012": "=2012",
        "2013": "=2013",
        "2014": "=2014",
        "2015": "=2015",
        "2016": "=2016",
        "2017": "=2017",
        "2018": "=2018",
        "2019": "=2019",
        "2020": "=2020",
        "2021": "=2021",
        "2022": "=2022",
        "2023": "=2023",
        "2024": "=2024",
        "2025": "=2025"
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
      "משרד",
      "נושא",
      "מספר תקנה:budget_code:search_term(budget_code)",
      "סה״כ אושר:number",
      "סה״כ שולם:number",
      "תקופה"
    ]
  },


  {
    text: " סיכום ההתקשרויות עם הארגון מ <period>",
    query: ["SELECT sum(volume) AS \"סה״כ היקף\", ",
              "sum(executed) AS \"סה״כ בוצע\",",
              "currency AS \"מטבע\",",
              "((publisher->>0) || '/' || (purchasing_unit->>0)) AS \"היחידה הרוכשת\",",
              "purchase_method->>0 AS \"אופן הרכישה\",",
              "min(min_year)||' - '||max(max_year) AS \"תקופה\"",
              "FROM contract_spending WHERE entity_id=':id' AND ((:period <= min_year) OR (min_year IS NULL AND :period <= max_year)) GROUP BY 3,4,5 ORDER BY 1 DESC nulls LAST"],
    parameters: {
      period: {
        "כל השנים": "0",
        "2008": "2008",
        "2009": "2009",
        "2010": "2010",
        "2011": "2011",
        "2012": "2012",
        "2013": "2013",
        "2014": "2014",
        "2015": "2015",
        "2016": "2016",
        "2017": "2017",
        "2018": "2018",
        "2019": "2019",
        "2020": "2020",
        "2021": "2021",
        "2022": "2022",
        "2023": "2023",
        "2024": "2024",
        "2025": "2025"
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
      "היחידה הרוכשת",
      "אופן הרכישה",
      "תקופה",
      "מטבע",
      "סה״כ היקף:number",
      "סה״כ בוצע:number"
    ]
  },
  {
    text: " פירוט כל ההתקשרויות עם הארגון ב <period>",
    query: ["SELECT volume AS \"היקף\",",
              "executed AS \"ביצוע\",",
              "currency AS \"מטבע\", min_year||'-'||max_year AS \"תקופה\", ",
              "purpose AS \"תיאור\", ",
              "'contract-spending/' || publisher_key || '/' || order_id || '/' || budget_code AS item_id, ",
              "purchase_method->>0 AS \"אופן רכישה\",",
              "((publisher->>0) || '/' || (purchasing_unit->>0)) AS \"היחידה הרוכשת\",",
              "order_date AS \"תאריך הזמנה\",",
              "start_date AS \"תאריך התחלה\",",
              "end_date AS \"תאריך סיום\",",
              "case when manof_excerpts is not null and jsonb_array_length(manof_excerpts) > 0 then ((manof_excerpts->0)::jsonb)->>'soproc_name' else null end as \"שירות חברתי\",",
              "case when manof_excerpts is not null and jsonb_array_length(manof_excerpts) > 0 then 'activities/gov_social_service/' || (((manof_excerpts->0)::jsonb)->>'soproc_id')::text else null end as soproc_id",
              "FROM contract_spending WHERE entity_id=':id' AND ((:period BETWEEN min_year AND max_year) or (min_year is null and :period <= max_year) or (max_year is null and :period >= min_year) or (:period is null))",
              "ORDER BY volume DESC NULLS LAST"
            ],
    parameters: {
      period: {
        "כל השנים": "null",
        "2014": "2014",
        "2015": "2015",
        "2016": "2016",
        "2017": "2017",
        "2018": "2018",
        "2019": "2019",
        "2020": "2020",
        "2021": "2021",
        "2022": "2022",
        "2023": "2023",
        "2024": "2024",
        "2025": "2025"
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
      "היחידה הרוכשת",
      "תיאור:item_link(item_id)",
      "אופן רכישה",
      "היקף:number",
      "ביצוע:number",
      "מטבע",
      "תאריך הזמנה",
      "תאריך התחלה",
      "תאריך סיום",
      "תקופה",
      "שירות חברתי:item_link(soproc_id)"
    ]
  },
  {
    text: "פירוט כל שירותי הרכש החברתי אשר הארגון מפעיל",
    query: [
      "WITH s AS (SELECT office, id, name, jsonb_array_elements(suppliers) AS supplier from activities",
      "where suppliers IS NOT NULL AND suppliers::text != 'null'",
      ") SELECT office as \"משרד\", name as \"שם השירות\", supplier->'geo' as \"איזורי הפעלה\",",
      "'activities/gov_social_service/' || id as svc_id,",
      "'units/gov_social_service_unit/' || office as unit_id",
      "from s where supplier->>'entity_id' = ':id'"
    ],
    parameters: {},
    defaults: {},
    headers: [
      "שם השירות:item_link(svc_id)",
      "משרד:item_link(unit_id)",
      "איזורי הפעלה:comma-separated"
    ]
  }
]
