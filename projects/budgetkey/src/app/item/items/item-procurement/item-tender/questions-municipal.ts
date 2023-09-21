import { Question } from "../../../model";

export default [
  {
    text: "כל המכרזים <status> של :publisher",
    query: [
      "select",
      "'muni_tenders/' || tender_type || '/' || publication_id || '/' || tender_id as item_id, ",
      "description as \"תיאור\",",
      "status as \"מצב נוכחי\", ",
      "publication_date as \"מועד פרסום\", ",
      "claim_date as \"מועד סגירה\", ",
      "last_update_date as \"מועד עדכון אחרון\" ",
      "from muni_tenders",
      "where publisher=':publisher' and :status order by claim_date desc nulls last" 
    ],
    parameters: {
      status: {
        "בכל מצב": "true",
        "הפתוחים": "status like '%%פתוח%%'",
        "הסגורים": "status like '%%סגור%%'"
      }
    },
    defaults: {
      status: "בכל מצב"
    },
    headers: [
      "תיאור:item_link(item_id)",
      "מצב נוכחי",
      "מועד פרסום",
      "מועד סגירה",
      "מועד עדכון אחרון"      
    ]
  }
] as Question[];
