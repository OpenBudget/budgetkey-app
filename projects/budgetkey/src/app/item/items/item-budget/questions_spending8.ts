import { Question } from "../../model";

export default [
  {
    text: "פירוט כל ההוצאות מתקנה זו ששולמו ב <period>",
    query: ["with a as (",
    "select year_paid as \"שנה\", coalesce(entity_name, recipient) as \"מקבל הכספים\", amount_paid as \"סך כולל\", support_title as \"תיאור\", 'תמיכה' as \"סוג ההוצאה\"",
    "from  supports_by_payment_year where budget_code = ':code' and amount_paid>0 and year_paid :period union",
    "select min_year as \"שנה\", coalesce(entity_name, supplier_name->>0) as \"מקבל הכספים\", executed as \"סך כולל\", purpose as \"תיאור\", 'רכש' as \"סוג ההוצאה\"",
    "from contract_spending where budget_code = ':code' and executed > 0 and min_year :period)",
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
      "מקבל הכספים",
      "סך כולל:number",
      "תיאור",
      "סוג ההוצאה"
    ]
  },
  {
    text: " פירוט כל התמיכות מתקציב זה שאושרו ב <period>",
    query: ["SELECT year_requested AS \"שנה\",",
              "supporting_ministry AS \"משרד\",",
              "request_type AS \"סוג תמיכה\", ", 
              "support_title AS \"נושא\", ", 
              "budget_code,", 
              "budget_code AS \"מספר תקנה\", ", 
              "'supports/' || budget_code || '/' || year_requested || '/' || entity_id || '/' || request_type AS item_id, ", 
              "coalesce(entity_name, recipient) as \"מקבל התמיכה\", ",
              "entity_id as \"מספר תאגיד\", ",
              "'org/' || entity_kind || '/' || entity_id as entity_item_id, ",
              "sum(amount_approved) as \"סה״כ אושר\",",
              "sum(amount_paid) as \"סה״כ שולם\"",
              "FROM raw_supports WHERE year_requested :period AND budget_code = ':code' GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
              "order by year_requested desc, 11 desc"],
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
      "נושא:item_link(item_id)", 
      "מספר תקנה:budget_code:search_term(budget_code)",
      "משרד", 
      "סוג תמיכה", 
      "מקבל התמיכה:item_link(entity_item_id)",
      "מספר תאגיד",
      "שנה",
      "סה״כ אושר:number",
      "סה״כ שולם:number"
    ]
  },
  {
    text: "סיכום התמיכות מתקציב זה, לפי מקבל התמיכה עבור בקשות שאושרו ב <period>",
    query: ["SELECT support_title AS \"נושא\", ", 
              "budget_code,", 
              "budget_code AS \"מספר תקנה\", ", 
              "coalesce(entity_name, recipient) as \"מקבל התמיכה\", ",
              "entity_id as \"מספר תאגיד\", ",
              "'org/' || entity_kind || '/' || entity_id as item_id, ",
              "sum(amount_approved) as \"סה״כ אושר\",",
              "sum(amount_paid) as \"סה״כ שולם\",",
              "min(year_requested) || '-' || max(year_requested)  as \"תקופה\" ", 
              "FROM raw_supports WHERE year_requested :period AND  budget_code = ':code' GROUP BY 1, 2, 3, 4, 5, 6 ORDER BY 4 DESC nulls last"],
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
      "נושא",
      "מספר תקנה:budget_code:search_term(budget_code)",
      "מקבל התמיכה:item_link(item_id)",
      "תקופה",
      "סה״כ אושר:number",
      "סה״כ שולם:number"
    ]
  },
  {
    text: "נושאי תמיכה הקשורים לסעיף תקציבי זה, עבור בקשות שאושרו ב <period>",
    query: ["SELECT support_title AS \"נושא\", ", 
              "budget_code,", 
              "budget_code AS \"מספר תקנה\", ", 
              "sum(amount_approved) as \"סה״כ אושר\",",
              "sum(amount_paid) as \"סה״כ שולם\",",
              "min(year_requested) || '-' || max(year_requested)  as \"תקופה\" ", 
              "FROM raw_supports WHERE year_requested :period AND  budget_code = ':code' GROUP BY 1, 2, 3 ORDER BY 4 DESC nulls last"],
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
      "נושא",
      "מספר תקנה:budget_code:search_term(budget_code)",
      "סה״כ אושר:number",
      "סה״כ שולם:number",
      "תקופה"
    ]
  },
  {
    text: " סיכום ההתקשרויות מתקציב זה לפי ספק מ <period>",
    query: [
              "SELECT sum(volume) AS \"סה״כ היקף\",",
              "sum(executed) AS \"סה״כ בוצע\",",
              "currency AS \"מטבע\", ", 
              "((publisher->>0) || '/' || (purchasing_unit->>0)) AS \"היחידה הרוכשת\",",
              "purchase_method->>0 AS \"אופן הרכישה\", ", 
              "coalesce(entity_name, supplier_name->>0) as \"ספק\", ",
              "'org/' || entity_kind || '/' || entity_id as item_id, ",
              "min(min_year)||' - '||max(max_year) AS \"תקופה\"",
              "FROM contract_spending ", 
              "WHERE budget_code = ':code' AND ((:period <= min_year) OR (min_year IS NULL AND :period <= max_year)) ", 
              "GROUP BY 3,4,5,6,7 ORDER BY 1 DESC nulls LAST"
            ],
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
        "2025": "2025",
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
        "היחידה הרוכשת",
        "ספק:item_link(item_id)",
        "אופן הרכישה",
        "מטבע",
        "סה״כ היקף:number",
        "סה״כ בוצע:number",
        "תקופה"
    ]
  },
  {
    text: " פירוט כל ההתקשרויות מתקציב זה לפי ספק ב <period>",
    query: [
              "SELECT volume AS \"היקף\",",
              "executed AS \"ביצוע\",",
              "currency AS \"מטבע\",",
              "min_year||'-'||max_year AS \"תקופה\", ", 
              "purpose AS \"תיאור\", ", 
              "'contract-spending/' || publisher_key || '/' || order_id || '/' || budget_code AS cs_item_id, ", 
              "case when entity_name is null then supplier_name->>0 else entity_name end as \"ספק\", ",
              "case when entity_id is null then null else ('org/' || entity_kind || '/' || entity_id) end as e_item_id, ",
              "entity_id as \"מספר תאגיד\", ",
              "purchase_method->>0 AS \"אופן רכישה\",",
              "((publisher->>0) || '/' || (purchasing_unit->>0)) AS \"היחידה הרוכשת\", ", 
              "order_date AS \"תאריך הזמנה\",",
              "start_date AS \"תאריך התחלה\",",
              "end_date AS \"תאריך סיום\"",
              "FROM contract_spending ", 
              "WHERE budget_code = ':code' AND ((:period BETWEEN min_year AND max_year) or (min_year is null and :period <= max_year) or ", 
              "(max_year is null and :period >= min_year) or (:period is null))",
              // "ORDER BY order_date desc nulls last"
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
        "2025": "2025",
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
      "היחידה הרוכשת",
      "מספר תאגיד",
      "ספק:item_link(e_item_id)",        
      "תיאור:item_link(cs_item_id)",
      "אופן רכישה",
      "היקף:number",
      "ביצוע:number",
      "מטבע",
      "תאריך הזמנה",
      "תאריך התחלה",
      "תאריך סיום"
    ]
  }
] as Question[];