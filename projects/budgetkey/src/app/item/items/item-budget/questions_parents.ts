import { Question } from "../../model";

export default [
  {
    text: "תת-הסעיפים של סעיף זה ב<period>",
    query: [
        "select year as \"שנה\", ",
        "code as \"מספר סעיף\", ",
        "title as \"שם סעיף\", ",
        "'budget/' || code || '/' || year as \"item_id\", ",
        "net_allocated as \"תקציב מקורי\", ",
        "net_revised as \"תקציב אחרי שינויים\", ",
        "net_executed as \"ביצוע בפועל\" ",
        "from raw_budget where code like ':code%%' and length(code)=:child_code_len and ",
        "(net_allocated != 0 or net_revised != 0 or net_executed != 0) and year:period",
        "order by \"שנה\" desc, \"מספר סעיף\" asc"
    ],
    parameters: {
      period: {
        "כל השנים": ">0",
        "2025": "=2025",
        "2024": "=2024",
        "2023": "=2023",
        "2022": "=2022",
        "2021": "=2021",
        "2020": "=2020",
        "2019": "=2019",
        "2018": "=2018",
        "2017": "=2017",
        "2016": "=2016",
        "2015": "=2015",
        "2014": "=2014",
        "2013": "=2013",
        "2012": "=2012",
        "2011": "=2011",
        "2010": "=2010",
        "2009": "=2009",
        "2008": "=2008",
        "2007": "=2007",
        "2006": "=2006",
        "2005": "=2005",
        "2004": "=2004",
        "2003": "=2003",
        "2002": "=2002",
        "2001": "=2001",
        "2000": "=2000",
        "1999": "=1999",
        "1998": "=1998",
        "1997": "=1997"
      }
    },
    defaults: {
      period: "כל השנים"
    },
    headers: [
      "שנה",
      "מספר סעיף:budget_code",
      "שם סעיף:item_link(item_id)",  
      "תקציב מקורי:number",
      "תקציב אחרי שינויים:number",
      "ביצוע בפועל:number"
    ]
  }
] as Question[];
