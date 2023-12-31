export default [
  {
    text: "כל ההתקשרויות הממשלתיות <filter> <activeness> מ<years>",
    query: [
      "select",
      "coalesce(entity_name, supplier_name->>0) as \"שם הספק\",", 
      "entity_id,",
      "'org/' || entity_kind || '/' || entity_id as entity_link, ",
      "purpose as \"כותרת התקשרות\",",
      "'contract-spending/' || publisher_key || '/' || order_id || '/' || budget_code  as contract_link, ",
      "publisher_name as \"הגורם המזמין\",",
      "purchase_method->>0 as \"סוג הרכש\",",
      "contract_is_active as \"התקשרות פעילה\",",
      "volume as \"סכום שאושר\",",
      "executed as \"סכום ששולם\",",
      "currency as \"מטבע\",",
      "order_date as \"תאריך הזמנה\",",
      "payments->-1->>'date' as \"תאריך עדכון\"",
      "from contract_spending",
      "where :filter and :activeness and min_year :years"      
    ],
    parameters: {
      activeness: {
        "הפעילות": "contract_is_active",
        "שהסתיימו": "(not contract_is_active)",
        "בכל מצב": "true"
      },
      filter: {
        "של אותו הגורם המזמין עם אותו הספק": "(entity_id = ':entity_id') and (publisher_name = ':publisher_name')",
        "עם אותו הספק": "(entity_id = ':entity_id')",
        "של אותו הגורם המזמין": "(publisher_name = ':publisher_name')",
        "מאותה תקנה תקציבית": "(budget_code = ':budget_code')"
      },
      years: {
        "2015": "= 2015",
        "2016": "= 2016",
        "2017": "= 2017",
        "2018": "= 2018",
        "כל השנים": "> 0"
      }
    },
    defaults: {
      activeness: "בכל מצב",
      filter: "של אותו הגורם המזמין עם אותו הספק",
      years: "כל השנים"
    },
    headers: [
      "שם הספק:item_link(entity_link)",
      "כותרת התקשרות:item_link(contract_link)",
      "הגורם המזמין",
      "סוג הרכש",
      "התקשרות פעילה:yesno",
      "סכום שאושר:number",
      "סכום ששולם:number",
      "מטבע",
      "תאריך הזמנה",
      "תאריך עדכון"
    ]
  }
]
