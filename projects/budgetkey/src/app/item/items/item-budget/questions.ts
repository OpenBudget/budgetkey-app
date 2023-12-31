import { Question } from "../../model";

export default [
  {
    text: "היסטוריה תקציבית לסעיף זה",
    query: [
        "with q as (",
        "SELECT d.key::integer as \"שנה\", ",
        "((d.value::json)->>'net_allocated')::numeric as \"תקציב מקורי\", ",
        "((d.value::json)->>'net_revised')::numeric as \"תקציב אחרי שינויים\", ",
        "((d.value::json)->>'net_executed')::numeric as \"ביצוע בפועל\" ",
        "FROM (select * from budget where code=':code' and year=:year) as budget_",
        "join jsonb_each_text(budget_.history) d on true",
        "union ",
        "SELECT year as \"שנה\", ",
        "net_allocated as \"תקציב מקורי\", ",
        "net_revised as \"תקציב אחרי שינויים\", ",
        "net_executed as \"ביצוע בפועל\" ",
        "from budget where code=':code' and year=:year)",
        "select * from q order by 1 asc"
    ],
    parameters: {
    },
    headers: [
      "שנה",
      "תקציב מקורי:number",
      "תקציב אחרי שינויים:number",
      "ביצוע בפועל:number"
    ]
  }
] as Question[];
