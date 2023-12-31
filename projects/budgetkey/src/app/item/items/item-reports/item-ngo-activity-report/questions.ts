import { Question } from "../../../model";

export default [
  {
    "text": "כל הארגונים <status> בתחום <strong>:details.field_of_activity</strong> ב<district>",
    "query": [
      "WITH ad AS (SELECT id, jsonb_array_elements_text(association_activity_region_districts) AS district FROM guidestar_processed),",
      "ids AS (SELECT distinct(id) AS id FROM guidestar_processed FULL JOIN ad USING (id) WHERE :district)",
      "SELECT association_title AS \"שם הארגון\",",
      "id AS \"מספר ארגון\",",
      "'org/association/' || id AS item_id,",
      "association_yearly_turnover AS \"מחזור כספי שנתי\",",
      "association_num_of_employees AS \"מספר עובדים\",",
      "association_num_of_volunteers AS \"מספר מתנדבים\",",
      "string_agg(district, ', ') AS \"מחוזות פעילות\",",
      "association_activity_region AS \"ישובי פעילות\",",
      "association_last_report_year AS \"שנת דיווח אחרונה\",",
      "__last_updated_at AS \"תאריך בדיקה אחרונה\"",
      "FROM guidestar_processed JOIN ids USING (id) FULL JOIN ad USING (id)",
      "WHERE :status AND association_field_of_activity=':details.field_of_activity'",
      "GROUP BY 1,2,3,4,5,6,8,9,10"
    ],
    "parameters": {
      "status": {
        "הפעילים": "association_status_active",
        "הרשומים": "TRUE"
      },
      "district": {
        "כל הארץ": "true",
        "הצפון": "district='הצפון'",
        "חיפה": "district='חיפה'",
        "מרכז": "district='מרכז'",
        "תל אביב": "district='תל אביב'",
        "ירושלים": "district='ירושלים'",
        "הדרום": "district='הדרום'",
        "אזור יהודה והשומרון": "district='אזור יהודה והשומרון'"
      }
    },
    "defaults": {
      "status": "הפעילים",
      "district": "כל הארץ"
    },
    "headers": [
      "שם הארגון:item_link(item_id)",
      "מספר ארגון",
      "מחזור כספי שנתי:number",
      "מספר עובדים",
      "מספר מתנדבים",
      "מחוזות פעילות",
      "ישובי פעילות",
      "שנת דיווח אחרונה",
      "תאריך בדיקה אחרונה"
    ]
  }
] as Question[];
