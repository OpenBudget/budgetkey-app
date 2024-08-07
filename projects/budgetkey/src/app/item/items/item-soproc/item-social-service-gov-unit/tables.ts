import { Format } from "../../../../format";

const format = new Format();


function beneficiariesTitle(row: any) {
    if (row.current_beneficiaries) {
        return row.current_beneficiaries.toLocaleString() + ' ' + row.beneficiary_kind_name;
    }
    return '';
}

function suppliersTitle(row: any) {
    const parts = [];
    let count_other = row.supplier_count;
    if (row.supplier_count_association) {
        parts.push(`מגזר שלישי: ${row.supplier_count_association}`);
        count_other -= row.supplier_count_association;
    }
    if (row.supplier_count_company) {
        parts.push(`מגזר עסקי: ${row.supplier_count_company}`);
        count_other -= row.supplier_count_company;
    }
    if (row.supplier_count_municipality) {
        parts.push(`רשויות מקומיות: ${row.supplier_count_municipality}`);
        count_other -= row.supplier_count_municipality;
    }
    if (count_other > 0) {
      parts.push(`אחר: ${count_other}`);
  }
  return parts.join('<br/>');
}

function fixTextQuotes(t: string) {
  if (t) {
    t = t.replace(/'/g, '״');
  }
  return t;
}

export const tableDefs = {
    services: {
      name: 'שירותים',
      query: `select :fields from activities where :where`,
      downloadHeaders: [
        'משרד<office',
        'מנהל/אגף<unit',
        'יחידה<subunit',
        'יחידת משנה<subsubunit',
        'שם השירות<name',
        'תקציב מאושר (₪):number<current_budget',
        'ניצול תקציב (%):number<budget_utilization',
        'מספר מוטבים:number<current_beneficiaries',
        'סוג מוטבים<beneficiary_kind_name',
        'מספר מפעילים<supplier_count',
        'מספר מפעילים מגזר עסקי<supplier_count_company',
        'מספר מפעילים מגזר שלישי<supplier_count_association',
        'מספר מפעילים רשויות מקומיות<supplier_count_municipality',
        'ארצי / אזורי<geo_coverage'
      ],
      fields: [
        'office', 'unit', 'subunit', 'subsubunit', 'name', 'description', 'current_budget', 'current_beneficiaries', 'beneficiary_kind_name',
        'supplier_count', 'supplier_count_company', 'supplier_count_association', 'supplier_count_municipality', 'geo_coverage', 'id', 'kind',
        'budget_utilization'
      ],
      uiHeaders: [
        ['משרד'],
        ['מנהל'],
        ['יחידה'],
        ['שם שירות'],
        ['תקציב מאושר', 'התקציב המאושר לשירות בשנה הנוכחית'],
        ['מספר מוטבים', 'מספר מקבלי השירות בשנה הנוכחית. בשירותים קהילתיים או שירותים שבהם קשה להעריך את מספר מקבלי השירות עצמם, מדובר במספר הרשויות המקומיות שבהן מופעל השירות.'],
        ['ניצול תקציב', 'אחוז ביצוע התקציב בשנה האחרונה עבורה קיימים נתוני ביצוע'],
        ['מספר מפעילים', 'מספר הגופים המפעילים את השירות'],
        ['ארצי / אזורי', 'הגדרת אופן ההפעלה של השירות במכרז ככלל ארצית או כהפעלה בחלוקה לאזורים. למשל, מוקד שירות טלפוני יכול לפעול פיזית מירושלים, אך לספק את שירותיו לכלל הארץ ולכן מודל ההפעלה שלו הוא ארצי. במכרז עם מודל הפעלה אזורי, עשויים להיות מפעילים שונים הפעילים באזורים שונים.'],
      ],
      uiHtml: [
        (row: any) => row.office,
        (row: any) => row.unit,
        (row: any) => row.subunit,
        (row: any) => `
          <a class='bk-tooltip-anchor' target='_blank' href='/i/activities/${row.kind}/${row.id}?theme=soproc'>${row.name}&nbsp;
              <i class="fa fa-plus-circle"></i>
              <span class="bk-tooltip">${fixTextQuotes(row.description)}</span>
            </a>`,
        (row: any) => format.ils(row.current_budget),
        (row: any) => beneficiariesTitle(row),
        (row: any) => Number.isFinite(row.budget_utilization) ? row.budget_utilization.toFixed(1) + '%' : '',
        (row: any) => `<span class='bk-tooltip-anchor'>${row.supplier_count}&nbsp;<i class="fa fa-plus-circle"></i>
                  <span class='bk-tooltip'>${suppliersTitle(row)}</span></span>`,
        (row: any) => row.geo_coverage
      ],
      sorting: [
        'office', 'unit', 'subunit', 'name', 'current_budget', 'current_beneficiaries', 'budget_utilization', 'supplier_count', 'geo_coverage'
      ]
    },
    suppliers: {
        name: 'מפעילים',
        query: `WITH s AS
        (SELECT office,
                jsonb_array_elements(suppliers) AS supplier,
                CASE
                    WHEN (:where) THEN TRUE
                    ELSE FALSE
                END AS relevant
         FROM activities
         WHERE suppliers IS NOT NULL
           AND suppliers::text != 'null' ),
           e AS
        (SELECT supplier->>'entity_id' AS id,
                max(supplier->>'entity_name') AS name,
                supplier->>'entity_kind' AS entity_kind,
                case supplier->>'entity_kind'
                    when 'company' then 'עסקי'
                    when 'municipality' then 'רשויות מקומיות'
                    when 'association' then 'מגזר שלישי'
                    when 'ottoman-association' then 'מגזר שלישי'
                    when 'cooperative' then 'מגזר שלישי'
                    else 'אחר (' || (supplier->>'entity_kind_he') || ')'
                end as kind,
                guidestar.association_yearly_turnover as association_yearly_turnover,
                array_to_string(array_agg(DISTINCT office), ', ') AS offices,
                count(1) AS services,
                bool_or(case when supplier->>'active' = 'yes' then TRUE else FALSE end) as active,
                bool_or(relevant) AS relevant
         FROM s
         LEFT JOIN guidestar on (supplier->>'entity_id' = guidestar.id)
         GROUP BY 1,
                  3,
                  4,
                  5)
      SELECT :fields
      FROM e
      WHERE relevant AND
            (NOT :only-active) OR active`,
        downloadHeaders: [
            `מספר תאגיד<id`,
            `שם המפעיל<name`,
            `מגזר המפעיל<kind`,
            `משרדים להם מספק שירותי רכש חברתי<offices`,
            `מספר שירותים חברתיים כולל שנותן<services`,
            `פעיל:yesno<active`,
            `מחזור שנתי (לעמותות)<association_yearly_turnover`,
        ],
        fields: [
            'id', 'name', 'kind', 'offices', 'services', 'entity_kind', 'association_yearly_turnover', 'active'
        ],
        uiHeaders: [
            ['שם המפעיל'],
            ['מגזר המפעיל'],
            ['משרדים להם מספק שירותי רכש חברתי', 'המשרדים שלהם התקשרות פעילה עם המפעיל לאספקת שירותים חברתיים'],
            ['מספר שירותים חברתיים כולל שנותן', 'מספר השירותים ברכש חברתי אשר מפעיל הגוף'],
            ['פעיל'],
            ['מחזור שנתי (לעמותות)', 'המחזור הכספי השנתי הכולל של העמותה (לא רק רכש חברתי)'],
        ],
        uiHtml: [
            (row: any) =>  row.id  ? `<a target='_blank' href='https://next.obudget.org/i/org/${row.entity_kind}/${row.id}?theme=soproc'>${row.name}</a>` : row.name,
            (row: any) => row.kind,
            (row: any) => row.offices,
            (row: any) => row.services,
            (row: any) => row.active ? 'כן' : 'לא',
            (row: any) => format.ils(row.association_yearly_turnover),
        ],
        sorting: [
            'name', 'kind', 'offices', 'services', 'active', 'association_yearly_turnover'
        ],
        sortField: 'active',
        sortDirectionDesc: true
    },
    tenders: {
      name: 'הליכי רכש',
      query: `
      with t as (
        select case when subunit is null then office || ' / ' || unit else office || ' / ' || unit || ' / ' || subunit  end as org_unit,
               id, kind, name,
               jsonb_array_elements(tenders) as tenders
               from activities where :where and tenders is not null and tenders::text != 'null'
      ), s as (select tenders->>'tender_type_he' as tender_type_he,
               tenders->>'tender_id' as tender_id,
               tenders->>'sub_kind_he' as sub_kind_he,
               tenders->>'publication_id' as publication_id,
               tenders->>'tender_key' as tender_key,
               tenders->>'description' as description,
               tenders->>'page_url' as page_url,
               org_unit,
               id, kind, name,
               tenders->>'end_date' as end_date,
               tenders->>'end_date_extended' as end_date_extended,
               tenders->>'suppliers' as suppliers,
               case when tenders->>'active' = 'no' then FALSE else TRUE end as active,
               jsonb_array_length(tenders->'suppliers') as suppliers_count
               from t
               where :tender-type and :pricing-model)
      select *, coalesce(tender_id, tender_key) as identifier, 
                coalesce(end_date_extended, end_date) as u_end_date from s
      WHERE (NOT :only-active) OR active
      `,
      downloadHeaders: [
        'מכרז / פטור<tender_type_he',
        'סוג הליך רכש<sub_kind_he',
        'שם מכרז<description',
        'שם השירות<name',
        'יחידה ארגונית<org_unit',
        'תוקף מכרז/פטור<end_date',
        'תוקף מכרז כולל אופציות<end_date_extended',
        'פעיל:yesno<active',
      ],
      fields: [
        'tender_type_he', 'sub_kind_he', 'description', 'identifier', 'name', 'org_unit', 'end_date', 'end_date_extended', 'active'
      ],
      uiHeaders: [
        ['מכרז / פטור'],
        ['סוג הליך רכש'],
        ['שם מכרז'],
        ['מספר הליך מכרזי'],
        ['שם השירות'],
        ['יחידה ארגונית'],
        ['תוקף מכרז/פטור', 'תוקף ההליך המכרזי אשר באמצעותו ניתן השירות'],
        ['תוקף מכרז כולל אופציות', 'תוקף ההליך המכרזי כולל כל האופציות שניתנו במסגרתו (מוערך- המשרד לא בהכרח יממש את האופציות שניתנו)'],
        [''],
        ['פעיל'],
        ['מספר מפעילים'],
        ['מפעילים']
      ],
      uiHtml: [
        (row: any) => row.tender_type_he,
        (row: any) => row.sub_kind_he,
        (row: any) => `<a href='${row.page_url}' target='_blank'>${row.description}</a>`,
        (row: any) => (row.tender_id === 'none' ? null : row.tender_id) || row.publication_id || row.tender_key.split(':')[0],
        (row: any) => `<a target='_blank' href='/i/activities/${row.kind}/${row.id}?theme=soproc'>${row.name}</a>`,
        (row: any) => row.org_unit,
        (row: any) => row.end_date || '',
        (row: any) => row.end_date_extended || '',
        (row: any) => {
          const year = row.u_end_date? row.u_end_date.split('-')[0] : null;
          if (year === new Date().getFullYear().toString()) {
            return `<i class='fa fa-exclamation-triangle' title='מכרז זה עומד לפוג תוקף בשנה הקרובה'></i>`
          }
          return '';
        },
        (row: any) => row.active ? 'כן' : 'לא',
        (row: any) => row.suppliers && JSON.parse(row.suppliers).length ? JSON.parse(row.suppliers).length : 'לא ידוע',
        (row: any) => {
          if (row.suppliers) {
            const suppliers = JSON.parse(row.suppliers).map((s: any) => s.entity_name);
            const ret = suppliers.slice(0, 2).join(', ');
            if (suppliers.length > 2) {
              return `${ret} + ${suppliers.length - 2}`;
            } else {
              return ret;
            }
          } else {
            return '';
          }
        }
      ],
      sorting: [
        'tender_type_he',
        'sub_kind_he',
        'description',
        'identifier',
        'name',
        'org_unit',
        'end_date',
        'u_end_date',
        '',
        'active',
        'suppliers_count',
        'suppliers'
      ],
      sortField: 'active',
      sortDirectionDesc: true,
    },
  };