import { Question } from "../../../model";

export default [
  {
    text: "כל הארגונים <status> העוסקים ב<field_of_activity> במחוז <strong>:details.district</strong>",
    query: [
      "with a as (",
      "select association_title as \"שם הארגון\", ",
      "id as \"מספר ארגון\",",
      "'org/association/' || id as item_id,",
      "association_field_of_activity as \"תחום פעילות\",",
      "association_objective as \"מטרות הארגון\",",
      "association_yearly_turnover as \"מחזור כספי שנתי\",",
      "association_num_of_employees as \"מספר עובדים\",",
      "association_num_of_volunteers as \"מספר מתנדבים\",",
      "association_activity_region_districts as \"מחוזות פעילות\",",
      "jsonb_array_elements_text(association_activity_region_districts) as district,",
      "association_activity_region as \"ישובי פעילות\",",
      "association_last_report_year as \"דוח שנתי אחרון\",",
      "__last_updated_at as \"תאריך בדיקה אחרונה\"",
      "from guidestar_processed",
      "where :field_of_activity and :status)",
      "select * from a",
      "where district = ':details.district'"
    ],
    parameters: {
      status: {
        "הפעילים": "association_status_active",
        "הרשומים": "TRUE"
      },
      field_of_activity: {
        "כל התחומים": "true",
        "דת יהודית": "association_field_of_activity='דת יהודית'"
      }
    },
    defaults: {
      status: "הפעילים",
      field_of_activity: "כל התחומים"
    },
    headers: [
      "שם הארגון:item_link(item_id)",
      "מספר ארגון",
      "מטרות הארגון",
      "מחזור כספי שנתי:number",
      "מספר עובדים",
      "מספר מתנדבים",
      "מחוזות פעילות",
      "ישובי פעילות",
      "דוח שנתי אחרון",
      "תאריך בדיקה אחרונה"
    ]
  }
] as Question[];
