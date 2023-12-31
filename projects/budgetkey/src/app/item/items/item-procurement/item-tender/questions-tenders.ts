import { Question } from "../../../model";

export default [
  {
    text: "כל ההתקשרויות הממשלתיות <activeness> במסגרת המכרז הזה",
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
      "budget_code as \"תקנה תקציבית\",",
      "volume as \"סכום שאושר\",",
      "executed as \"סכום ששולם\",",
      "currency as \"מטבע\",",
      "order_date as \"תאריך הזמנה\",",
      "payments->-1->>'date' as \"תאריך עדכון\"",
      "from contract_spending",
      "where :activeness and tender_key->>0 like '[\":publication_id\"%%'"
    ],
    parameters: {
      activeness: {
        "הפעילות": "contract_is_active",
        "שהסתיימו": "(not contract_is_active)",
        "בכל מצב": "true"
      }
    },
    defaults: {
      activeness: "בכל מצב"
    },
    headers: [
      "שם הספק:item_link(entity_link)",
      "כותרת התקשרות:item_link(contract_link)",
      "הגורם המזמין",
      "סוג הרכש",
      "התקשרות פעילה:yesno",
      "תקנה תקציבית:budget_code:search_term(budget_code)",
      "סכום שאושר:number",
      "סכום ששולם:number",
      "מטבע",
      "תאריך הזמנה",
      "תאריך עדכון"
    ]
  },
  {
    text: "כל המכרזים <status> מטעם :publisher",
    query: [
      "select",
      "'tenders/' || tender_type || '/' || publication_id || '/' || tender_id as item_id, ",
      "publication_id as \"מזהה במערכת מנוף\",", 
      "description as \"תיאור\",",
      "simple_decision as \"מצב נוכחי\", ",
      "regulation as \"תקנת רכש\",",
      "volume as \"היקף\",",
      "contract_volume as \"סך התחייבויות עד כה\", ",
      "contract_executed as \"סך ששולם עד כה\", ",
      "jsonb_array_length(awardees) as \"מספר ספקים זוכים\", ",
      "start_date as \"מועד התחלה\", ",
      "end_date as \"מועד סיום\", ",
      "claim_date as \"מועד סגירה/פרסום צפוי\", ",
      "last_update_date as \"מועד עדכון אחרון\" ",
      "from procurement_tenders_processed",
      "where tender_type in ('office', 'central') and publisher=':publisher' and :status order by claim_date desc" 
    ],
    parameters: {
      status: {
        "בכל מצב": "true",
        "הפתוחים": "simple_decision='פתוח'",
        "העתידיים": "simple_decision='עתידי'",
        "הפעילים": "simple_decision='הסתיים'",
        "הסגורים": "simple_decision='סגור'",
        "שבוטלו": "simple_decision='בוטל'"
      }
    },
    defaults: {
      status: "בכל מצב"
    },
    headers: [
      "מזהה במערכת מנוף:item_link(item_id)",
      "תיאור",
      "מצב נוכחי",
      "תקנת רכש",
      "סך התחייבויות עד כה:number",
      "סך ששולם עד כה:number",
      "מספר ספקים זוכים",
      "מועד התחלה",
      "מועד סיום",
      "מועד סגירה/פרסום צפוי",
      "מועד עדכון אחרון"      
    ]
  },
  {
    text: "כל בקשות הפטור ממכרז <status> מטעם :publisher",
    query: [
      "select",
      "'tenders/' || tender_type || '/' || publication_id || '/' || tender_id as item_id, ",
      "publication_id as \"מזהה במערכת מנוף\",", 
      "description as \"תיאור\",",
      "simple_decision as \"מצב נוכחי\", ",
      "regulation as \"תקנת רכש\",",
      "volume as \"היקף\",",
      "contract_volume as \"סך התחייבויות עד כה\", ",
      "contract_executed as \"סך ששולם עד כה\", ",
      "jsonb_array_length(awardees) as \"מספר ספקים זוכים\", ",
      "start_date as \"מועד התחלה\", ",
      "end_date as \"מועד סיום\", ",
      "last_update_date as \"מועד עדכון אחרון\" ",
      "from procurement_tenders_processed",
      "where tender_type in ('exemptions') and publisher=':publisher' and :status order by claim_date desc" 
    ],
    parameters: {
      status: {
        "בכל מצב": "true",
        "המאושרות": "simple_decision like 'אושר %%'",
        "שלא אושרו": "simple_decision='לא אושר'",
        "שעדיין בתהליך": "simple_decision='בתהליך'"
      }
    },
    defaults: {
      status: "בכל מצב"
    },
    headers: [
      "מזהה במערכת מנוף:item_link(item_id)",
      "תיאור",
      "מצב נוכחי",
      "תקנת רכש",
      "היקף:number",
      "סך התחייבויות עד כה:number",
      "סך ששולם עד כה:number",
      "מספר ספקים זוכים",
      "מועד התחלה",
      "מועד סיום",
      "מועד עדכון אחרון"      
    ]
  }
] as Question[];
