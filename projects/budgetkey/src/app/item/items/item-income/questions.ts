import { Question } from "../../model";

export default [
  {
    text: "היסטוריית הכנסות לסעיף זה",
    query: [
        "with q as (",
        "SELECT d.key::integer as \"שנה\", ",
        "((d.value::json)->>'net_allocated')::numeric as \"הכנסה מקורית\", ",
        "((d.value::json)->>'net_revised')::numeric as \"הכנסה אחרי שינויים\", ",
        "((d.value::json)->>'net_executed')::numeric as \"ביצוע בפועל\" ",
        "FROM (select * from budget where code=':code' and year=:year) as budget_",
        "join jsonb_each_text(budget_.history) d on true",
        "union ",
        "SELECT year as \"שנה\", ",
        "net_allocated as \"הכנסה מקורית\", ",
        "net_revised as \"הכנסה אחרי שינויים\", ",
        "net_executed as \"ביצוע בפועל\" ",
        "from budget where code=':code' and year=:year)",
        "select * from q order by 1 asc"
    ],
    parameters: {
    },
    headers: [
      "שנה",
      "הכנסה מקורית:number",
      "הכנסה אחרי שינויים:number",
      "ביצוע בפועל:number"
    ]
  }
] as Question[];
