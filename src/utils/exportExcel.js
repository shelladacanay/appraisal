import * as XLSX from 'xlsx-js-style'

export function exportToExcel(records, officeInfo = {}) {
  const wb = XLSX.utils.book_new()
  const ws = {}
  const merges = []

  const office  = officeInfo.office         || 'General Services Office'
  const dept    = officeInfo.department     || 'Division of Campus Facility, Safety, and Security Services'
  const contact = officeInfo.contact        || '9058123506'
  const email   = officeInfo.email          || 'csugeneralservices@carsu.edu.ph'
  const pic     = officeInfo.personInCharge || 'Esmeraldo C. Catipan'
  const datePre = officeInfo.datePrepared   || new Date().toLocaleDateString('en-PH')

  // ── Helpers ──────────────────────────────────────
  const addr = (r, c) => XLSX.utils.encode_cell({ r, c })
  const M = (rs, re, cs, ce) => merges.push({ s: { r: rs, c: cs }, e: { r: re, c: ce } })

  const cell = (r, c, v, style = {}) => {
    ws[addr(r, c)] = {
      v,
      t: typeof v === 'number' ? 'n' : 's',
      s: style
    }
  }

  const COLS = 16 // total columns (A to P)

  // ── Border definitions ───────────────────────────
  const borderThin = {
    top:    { style: 'thin', color: { rgb: 'B0B8C4' } },
    bottom: { style: 'thin', color: { rgb: 'B0B8C4' } },
    left:   { style: 'thin', color: { rgb: 'B0B8C4' } },
    right:  { style: 'thin', color: { rgb: 'B0B8C4' } },
  }

  // ── TITLE ROW ── dark navy ───────────────────────
  const titleStyle = {
    font:      { bold: true, sz: 13, color: { rgb: 'FFFFFF' }, name: 'Arial' },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill:      { fgColor: { rgb: '1A3A5C' } },
    border:    borderThin,
  }

  // ── OFFICE INFO LABELS ── light gray ─────────────
  const labelStyle = {
    font:      { bold: true, sz: 9, color: { rgb: '444444' }, name: 'Arial' },
    fill:      { fgColor: { rgb: 'F2F2F2' } },
    border:    borderThin,
    alignment: { horizontal: 'left', vertical: 'center' },
  }

  const valueStyle = {
    font:      { sz: 10, color: { rgb: '000000' }, name: 'Arial' },
    fill:      { fgColor: { rgb: 'FFFFFF' } },
    border:    borderThin,
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  }

  // ── COLUMN HEADERS (row 7) ── dark navy ───────────
  const colHeaderStyle = {
    font:      { bold: true, sz: 9, color: { rgb: 'FFFFFF' }, name: 'Arial' },
    fill:      { fgColor: { rgb: '1A3A5C' } },
    border:    borderThin,
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  }

  // ── SUB-HEADERS (Active / Inactive / Total) ───────
  const subHeaderStyle = {
    font:      { bold: true, sz: 9, color: { rgb: 'FFFFFF' }, name: 'Arial' },
    fill:      { fgColor: { rgb: '2E6DA4' } },
    border:    borderThin,
    alignment: { horizontal: 'center', vertical: 'center' },
  }

  // ── GRDS ROW ── bright yellow, dark text ─────────
  const blueRowStyle = {
    font:      { bold: true, sz: 10, color: { rgb: '000000' }, name: 'Arial' },
    fill:      { fgColor: { rgb: 'FFFF00' } },   // bright yellow
    border:    borderThin,
    alignment: { horizontal: 'center', vertical: 'center' },
  }

  // ── CATEGORY ROW ── darker gold/amber ────────────
  const yellowRowStyle = {
    font:      { bold: true, sz: 10, color: { rgb: '000000' }, name: 'Arial' },
    fill:      { fgColor: { rgb: 'FFC000' } },   // darker amber gold
    border:    borderThin,
    alignment: { horizontal: 'center', vertical: 'center' },
  }

  // ── SECTION LABEL ── very light gray ─────────────
  const sectionStyle = {
    font:      { bold: true, sz: 10, color: { rgb: '333333' }, name: 'Arial' },
    fill:      { fgColor: { rgb: 'F2F2F2' } },
    border:    borderThin,
    alignment: { horizontal: 'left', vertical: 'center' },
  }

  // ── DATA ROWS ── plain white ──────────────────────
  const dataStyle = {
    font:      { sz: 10, color: { rgb: '000000' }, name: 'Arial' },
    fill:      { fgColor: { rgb: 'FFFFFF' } },
    border:    borderThin,
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  }

  const dataStyleAlt = { ...dataStyle }

  // ── TOTAL CELL ── subtle blue-gray ───────────────
  const goldStyle = {
    font:      { bold: true, sz: 10, color: { rgb: '1A3A5C' }, name: 'Arial' },
    fill:      { fgColor: { rgb: 'D9E1EC' } },
    border:    borderThin,
    alignment: { horizontal: 'center', vertical: 'center' },
  }

  // ── Row 0: Title ─────────────────────────────────
  cell(0, 0, 'RECORDS INVENTORY AND APPRAISAL FORM', titleStyle)
  for (let c = 1; c < COLS; c++) cell(0, c, '', titleStyle)
  M(0, 0, 0, COLS - 1)

  // ── Row 1: blank ─────────────────────────────────

  // ── Rows 2-3: Office info ─────────────────────────
  cell(2,  0, '1. NAME OF OFFICE:', labelStyle);         M(2, 2, 0, 5)
  cell(2,  6, '2. DEPARTMENT/DIVISION:', labelStyle);    M(2, 2, 6, 11)
  cell(2, 12, '3. CONTACT NO.:', labelStyle);            M(2, 2, 12, COLS-1)
  cell(3,  0, office, valueStyle);                       M(3, 3, 0, 5)
  cell(3,  6, dept, valueStyle);                         M(3, 3, 6, 11)
  cell(3, 12, contact, valueStyle);                      M(3, 3, 12, COLS-1)

  // ── Rows 4-5: Email info ──────────────────────────
  cell(4,  0, '4. EMAIL ADDRESS:', labelStyle);               M(4, 4, 0, 5)
  cell(4,  6, '5. PERSON-IN-CHARGE OF FILES:', labelStyle);   M(4, 4, 6, 11)
  cell(4, 12, '6. DATE PREPARED:', labelStyle);               M(4, 4, 12, COLS-1)
  cell(5,  0, email, valueStyle);                             M(5, 5, 0, 5)
  cell(5,  6, pic, valueStyle);                               M(5, 5, 6, 11)
  cell(5, 12, datePre, valueStyle);                           M(5, 5, 12, COLS-1)

  // ── Row 6: blank ──────────────────────────────────

  // ── Rows 7-8: Column headers ──────────────────────
  cell(7,  0, '7. RECORDS SERIES TITLE AND DESCRIPTION', colHeaderStyle); M(7, 8, 0, 0)
  cell(7,  1, '8. PERIOD COVERED',        colHeaderStyle); M(7, 8, 1, 1)
  cell(7,  2, '9. ITEM NO. (REF CODE)',    colHeaderStyle); M(7, 8, 2, 2)
  cell(7,  3, '10. VOLUME',               colHeaderStyle); M(7, 8, 3, 3)
  cell(7,  4, '11. RECORDS MEDIUM',       colHeaderStyle); M(7, 8, 4, 4)
  cell(7,  5, '12. RESTRICTIONS',         colHeaderStyle); M(7, 8, 5, 5)
  cell(7,  6, '13. LOCATION OF RECORDS',  colHeaderStyle); M(7, 7, 6, 7)
  cell(7,  8, '14. FREQ. OF USE',         colHeaderStyle); M(7, 8, 8, 8)
  cell(7,  9, '15. DUPLICATION',          colHeaderStyle); M(7, 8, 9, 9)
  cell(7, 10, '16. TIME VALUE (T/P)',     colHeaderStyle); M(7, 8, 10, 10)
  cell(7, 11, '17. UTILITY VALUE',        colHeaderStyle); M(7, 8, 11, 11)
  cell(7, 12, '18. RETENTION PERIOD',     colHeaderStyle); M(7, 7, 12, 14)
  cell(7, 15, '19. DISPOSITION',          colHeaderStyle); M(7, 8, 15, 15)

  // Row 8 sub-headers (Location & Retention splits)
  cell(8,  6, 'ACTIVE',        subHeaderStyle)
  cell(8,  7, 'INACTIVE',      subHeaderStyle)
  cell(8, 12, 'Active (yrs)',  subHeaderStyle)
  cell(8, 13, 'Storage (yrs)', subHeaderStyle)
  cell(8, 14, 'Total',         subHeaderStyle)

  // ── Data rows ─────────────────────────────────────
  let row = 9

  // GRDS indigo header
  cell(row, 0, 'RECORDS SERIES BASED ON GENERAL RECORDS DISPOSITION SCHEDULE (GRDS)', blueRowStyle)
  for (let c = 1; c < COLS; c++) cell(row, c, '', blueRowStyle)
  M(row, row, 0, COLS - 1)
  row++

  // Golden category sub-header
  cell(row, 0, 'ADMINISTRATIVE AND MANAGEMENT RECORDS', yellowRowStyle)
  for (let c = 1; c < COLS; c++) cell(row, c, '', yellowRowStyle)
  M(row, row, 0, COLS - 1)
  row++

  // Group by section — only group if section is explicitly provided
  const bySection = {}
  for (const r of records) {
    const sec = r.section ? r.section.toUpperCase() : ''
    if (!bySection[sec]) bySection[sec] = []
    bySection[sec].push(r)
  }

  let dataRowIndex = 0
  for (const [section, recs] of Object.entries(bySection)) {
    // Only render section label if it has a name
    if (section) {
      cell(row, 0, section, sectionStyle)
      for (let c = 1; c < COLS; c++) cell(row, c, '', sectionStyle)
      M(row, row, 0, COLS - 1)
      row++
    }

    for (const r of recs) {
      const retActive  = Number(r.retActive  ?? r.active   ?? 0) || 0
      const retStorage = Number(r.retStorage ?? r.inactive ?? 0) || 0
      const retTotal   = retActive + retStorage
      const ds = dataRowIndex % 2 === 0 ? dataStyle : dataStyleAlt
      dataRowIndex++

      cell(row,  0, r.title || '',                     ds)
      cell(row,  1, r.period || '',                    ds)
      cell(row,  2, r.code || '',                      ds)
      cell(row,  3, r.volume || '',                    ds)
      cell(row,  4, r.medium || 'Paper',               ds)
      cell(row,  5, r.restrict || 'Open',              ds)
      cell(row,  6, r.locationActive || r.location || '', ds)
      cell(row,  7, r.locationInactive || '',          ds)
      cell(row,  8, r.freq || 'ANA',                   ds)
      cell(row,  9, r.dup || 'N/A',                    ds)
      cell(row, 10, r.tval || 'T',                     ds)
      cell(row, 11, r.util || 'ADM/F/L',               ds)
      cell(row, 12, retActive,                         { ...ds, alignment: { horizontal: 'center' } })
      cell(row, 13, retStorage,                        { ...ds, alignment: { horizontal: 'center' } })
      cell(row, 14, retTotal,                          goldStyle)
      cell(row, 15, r.disp || '',                      ds)
      row++
    }
  }

  // ── Column widths ─────────────────────────────────
  ws['!cols'] = [
    { wch: 36 }, // A - Title
    { wch: 14 }, // B - Period
    { wch: 18 }, // C - Ref Code
    { wch: 12 }, // D - Volume
    { wch: 12 }, // E - Medium
    { wch: 12 }, // F - Restrictions
    { wch: 20 }, // G - Location Active
    { wch: 14 }, // H - Location Inactive
    { wch: 14 }, // I - Frequency
    { wch: 12 }, // J - Duplication
    { wch: 14 }, // K - T/P
    { wch: 18 }, // L - Utility
    { wch: 12 }, // M - Ret Active
    { wch: 13 }, // N - Ret Storage
    { wch: 8  }, // O - Total
    { wch: 32 }, // P - Disposition
  ]

  // Row heights
  ws['!rows'] = [
    { hpt: 30 }, // row 0 - title
    { hpt: 6  }, // row 1 - blank
    { hpt: 16 }, // row 2 - labels
    { hpt: 24 }, // row 3 - values
    { hpt: 16 }, // row 4 - labels
    { hpt: 24 }, // row 5 - values
    { hpt: 6  }, // row 6 - blank
    { hpt: 38 }, // row 7 - col headers
    { hpt: 20 }, // row 8 - sub headers
  ]

  ws['!merges'] = merges
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row, c: COLS - 1 } })

  XLSX.utils.book_append_sheet(wb, ws, 'Records Inventory')

  const filename = `GSO-Records-Inventory-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}