import { Question } from "../../model";

export default [
  {
    "text": "פירוט כלל התמיכות בתוכנית זו שאושרו ב <period>",
    "query": [
      "SELECT year_requested AS \"שנה\", ",
      "coalesce(entity_name, recipient) as \"מקבל התמיכה\", ",
      "entity_id as \"מספר תאגיד\", ",
      "'org/' || entity_kind || '/' || entity_id as entity_doc_id, ",
      "'supports/' || budget_code || '/' || year_requested || '/' || entity_id || '/' || request_type AS support_doc_id, ",
      "support_title AS \"נושא\", ",
      "sum(amount_approved) as \"סכום שאושר\", ",
      "sum(amount_paid) as \"סכום ששולם\" ",
      "FROM raw_supports ",
      "WHERE program_key=':program_key' ",
      "AND year_requested :period ",
      "GROUP BY 1, 2, 3, 4, 5, 6 ",
      "ORDER BY 1 DESC, 7 DESC"
    ],
    "parameters": {
      "period": {
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
        "2026": "=2026"
      }
    },
    "defaults": {
      "period": "כל השנים"
    },
    "headers": [
      "שנה",
      "מספר תאגיד:item_link(entity_doc_id)",
      "מקבל התמיכה:item_link(support_doc_id)",
      "נושא",
      "סכום שאושר:number",
      "סכום ששולם:number"
    ]
  },
  {
    "text": "כל הארגונים שקיבלו תמיכה בתוכנית זו ב <period>",
    "query": [
      "SELECT coalesce(entity_name, recipient) as \"מקבל התמיכה\", ",
      "entity_id as \"מספר תאגיד\", ",
      "'org/' || entity_kind || '/' || entity_id as doc_id, ",
      "count(*) as \"מספר תמיכות\", ",
      "sum(amount_approved) as \"סה״כ אושר\", ",
      "sum(amount_paid) as \"סה״כ שולם\", ",
      "round(100.0 * sum(amount_paid) / nullif(sum(amount_approved), 0), 1) as \"אחוז ניצול\" ",
      "FROM raw_supports ",
      "WHERE program_key=':program_key' ",
      "AND year_requested :period ",
      "GROUP BY 1, 2, 3 ",
      "ORDER BY 5 DESC"
    ],
    "parameters": {
      "period": {
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
        "2026": "=2026"
      }
    },
    "defaults": {
      "period": "כל השנים"
    },
    "headers": [
      "מספר תאגיד",
      "מקבל התמיכה:item_link(doc_id)",
      "מספר תמיכות:number",
      "סה״כ אושר:number",
      "סה״כ שולם:number",
      "אחוז ניצול:number"
    ]
  },
  {
    "text": "סיכום תקציבי לפי שנה",
    "query": [
      "WITH org_utilization AS ( ",
      "  SELECT year_requested, ",
      "  entity_id, ",
      "  100.0 * sum(amount_paid) / nullif(sum(amount_approved), 0) as utilization ",
      "  FROM raw_supports ",
      "  WHERE program_key=':program_key' ",
      "  GROUP BY 1, 2 ",
      ") ",
      "SELECT rs.year_requested AS \"שנה\", ",
      "count(*) as \"מספר תמיכות\", ",
      "count(DISTINCT rs.entity_id) as \"מספר ארגונים\", ",
      "sum(amount_approved) as \"סה״כ אושר\", ",
      "sum(amount_paid) as \"סה״כ שולם\", ",
      "round(avg(ou.utilization), 1) as \"אחוז ניצול\" ",
      "FROM raw_supports rs ",
      "LEFT JOIN org_utilization ou ON rs.year_requested = ou.year_requested AND rs.entity_id = ou.entity_id ",
      "WHERE rs.program_key=':program_key' ",
      "GROUP BY 1 ",
      "ORDER BY 1 DESC"
    ],
    "headers": [
      "שנה",
      "מספר תמיכות:number",
      "מספר ארגונים:number",
      "סה״כ אושר:number",
      "סה״כ שולם:number",
      "אחוז ניצול:number"
    ]
  }
] as Question[];
