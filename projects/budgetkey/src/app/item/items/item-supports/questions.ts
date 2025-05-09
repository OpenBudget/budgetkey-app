import { Question } from "../../model";

export default [
  {
    "text": " פירוט כלל התמיכות שאותו הארגון קיבל שאושרו ב <period>",
    "query": [
      "SELECT year_requested AS \"שנה\", ",
      "supporting_ministry AS \"משרד\", ",
      "request_type AS \"סוג תמיכה\", ",
      "support_title AS \"נושא\", ",
      "sum(amount_approved) as \"סה״כ אושר\", ",
      "sum(amount_paid) as \"סה״כ שולם\" ",
      "FROM raw_supports ",
      "WHERE year_requested :period ",
      "AND entity_id=':entity_id' ",
      "GROUP BY 1, 2, 3, 4"
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
      }
    },
    "defaults": {
      "period": "כל השנים"
    },
    "headers": [
      "שנה",
      "משרד",
      "נושא",
      "סה״כ אושר:number",
      "סה״כ שולם:number"
    ]
  },
  {
    "text": "ארגונים נוספים שקיבלו תמיכה בנושא זה",
    "query": [
      "SELECT coalesce(entity_name, recipient) as \"מקבל התמיכה\", ",
      "entity_id as \"מספר תאגיד\", ",
      "'org/' || entity_kind || '/' || entity_id as doc_id, ",
      "min(year_requested) || '-' || max(year_requested) as \"תקופה\", ",
      "sum(amount_approved) as \"סה״כ אושר\", ",
      "sum(amount_paid) as \"סה״כ שולם\" ",
      "FROM raw_supports ",
      "WHERE support_title=':support_title' ",
      "AND request_type=':request_type' ",
      "AND budget_code=':budget_code' ",
      "GROUP BY 1, 2, 3 ",
      "ORDER BY 5 DESC"
    ],
    "headers": [
      "מספר תאגיד",
      "מקבל התמיכה:item_link(doc_id)",
      "סה״כ אושר:number",
      "סה״כ שולם:number",
      "תקופה"
    ]
  }
] as Question[];
