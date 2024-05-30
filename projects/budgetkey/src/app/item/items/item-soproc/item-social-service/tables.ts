import { Format } from "../../../../format";

// function processOrgUnit(row) {
//   const orgUnit = row.org_unit;
//   const parts = orgUnit.split(' / ');
//   parts[0] = `<a target='_blank' href='/i/units/gov_social_service_unit/${parts[0]}?theme=soproc'>${parts[0]}</a>`;
//   return parts.join(' / ');
// }

const format = new Format();


export const tableDefs = {
  tenders: {
    name: 'הליכי רכש',
    query: `
    with t as (
      select case when subunit is null then office || ' / ' || unit else office || ' / ' || unit || ' / ' || subunit  end as org_unit,
              jsonb_array_elements(tenders) as tenders
              from activities where :where and tenders is not null and tenders::text != 'null'
    ), tt as (select tenders->>'tender_type_he' as tender_type_he,
              tenders->>'tender_id' as tender_id,
              tenders->>'sub_kind_he' as sub_kind_he,
              tenders->>'publication_id' as publication_id,
              tenders->>'tender_key' as tender_key,
              tenders->>'description' as description,
              tenders->>'page_url' as page_url,
              org_unit,
              tenders->>'end_date' as end_date,
              tenders->>'end_date_extended' as end_date_extended,
              tenders->>'suppliers' as suppliers,
              jsonb_array_length(tenders->'suppliers') as suppliers_count,
              case when tenders->>'active' = 'no' then FALSE else TRUE end as active
              from t)
    SELECT * from tt
    WHERE (NOT :only-active) OR active
    `,
    downloadHeaders: [
      'מכרז / פטור<tender_type_he',
      'סוג הליך רכש<sub_kind_he',
      'שם מכרז<description',
      'תוקף מכרז/פטור<end_date',
      'תוקף מכרז כולל אופציות<end_date_extended',
      'פעיל:yesno<active',
    ],
    fields: [
      'tender_type_he', 'sub_kind_he', 'description', 'org_unit', 'end_date', 'end_date_extended', 'active'
    ],
    uiHeaders: [
      ['מכרז / פטור'],
      ['סוג הליך רכש'],
      ['שם מכרז'],
      ['מספר הליך מכרזי'],
      ['תוקף מכרז/פטור', 'תוקף ההליך המכרזי אשר באמצעותו ניתן השירות'],
      ['תוקף מכרז כולל אופציות', 'תוקף ההליך המכרזי כולל כל האופציות שניתנו במסגרתו (מוערך- המשרד לא בהכרח יממש את האופציות שניתנו)'],
      ['פעיל'],
      ['מספר מפעילים'],
      ['מפעילים'],
    ],
    uiHtml: [
      (row: any) => row.tender_type_he,
      (row: any) => row.sub_kind_he,
      (row: any) => `<a href='${row.page_url}' target='_blank'>${row.description}</a>`,
      (row: any) => (row.tender_id === 'none' ? null : row.tender_id) || row.publication_id || row.tender_key.split(':')[0],
      (row: any) => row.end_date || '',
      (row: any) => row.end_date_extended || '',
      (row: any) => row.active ? 'כן' : 'לא',
      (row: any) => row.suppliers_count,
      (row: any) => row.suppliers ? JSON.parse(row.suppliers).map((s: any) => s.entity_name).slice(0, 3).join(', ') : ''
    ],
    sorting: [
      'tender_type_he', 'sub_kind_he', 'description', `coalesce(tenders->>'tender_id', tenders->>'tender_key')`, 
      'end_date', 'end_date_extended', 'active', 'suppliers_count', 'suppliers'
    ],
    sortField: 'active',
    sortDirectionDesc: true
  },
  suppliers: {
    name: 'מפעילים',
    query: `WITH s AS
      (SELECT jsonb_array_elements(suppliers) AS supplier
        FROM activities
        WHERE :where AND suppliers IS NOT NULL
          AND suppliers::text != 'null' ),
          e AS
      (SELECT supplier->>'entity_id' AS id,
              supplier->>'entity_name' AS name,
              supplier->>'entity_kind' as entity_kind,
              case supplier->>'entity_kind'
                  when 'company' then 'עסקי'
                  when 'municipality' then 'רשויות מקומיות'
                  when 'association' then 'מגזר שלישי'
                  when 'ottoman-association' then 'מגזר שלישי'
                  when 'cooperative' then 'מגזר שלישי'
                  else 'אחר (' || (supplier->>'entity_kind_he') || ')'
              end as kind,
              supplier->'geo' AS region,
              case when supplier->>'active' = 'yes' then TRUE else FALSE end as active,
              guidestar.association_yearly_turnover as association_yearly_turnover
        FROM s
        LEFT JOIN guidestar on (supplier->>'entity_id' = guidestar.id)
        )
    SELECT :fields
    FROM e
    WHERE (NOT :only-active) OR active
    `,
    downloadHeaders: [
        `מספר תאגיד<id`,
        `שם המפעיל<name`,
        `מגזר המפעיל<kind`,
        `איזורים גיאוגרפיים בהם פועל:comma-separated<region`,
        `מחזור שנתי (לעמותות)<association_yearly_turnover`,
        `פעיל:yesno<active`,
    ],
    fields: [
        'id', 'name', 'kind', 'region', 'entity_kind', 'association_yearly_turnover', 'active'
    ],
    uiHeaders: [
        ['מספר תאגיד'],
        ['שם המפעיל'],
        ['מגזר המפעיל'],
        ['איזורים גיאוגרפיים בהם פועל', 'האם המפעיל מספק את השירות באופן ארצי או שזכה בהפעלת השירות באיזור גיאוגרפי מסוים'],
        ['מחזור שנתי (לעמותות)', 'המחזור הכספי השנתי הכולל של העמותה (לא רק רכש חברתי)'],
        ['פעיל'],
    ],
    uiHtml: [
        (row: any) => row.id,
        (row: any) =>  row.id  ? `<a target='_blank' href='https://next.obudget.org/i/org/${row.entity_kind}/${row.id}?theme=soproc'>${row.name}</a>` : row.name,
        (row: any) => row.kind,
        (row: any) => row.region.join(', '),
        (row: any) => format.ils(row.association_yearly_turnover),
        (row: any) => row.active ? 'כן' : 'לא'
    ],
    sorting: [
        'id', 'name', 'kind', 'region', 'association_yearly_turnover', 'active'
    ],
    sortField: 'active',
    sortDirectionDesc: true
  },
};