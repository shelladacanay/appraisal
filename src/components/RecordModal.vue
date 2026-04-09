<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">

      <!-- Header -->
      <div class="modal-header">
        <div class="header-left">
          <div class="form-badge">F-DRC-011</div>
          <div>
            <h3>Records Inventory and Appraisal Form</h3>
            <p class="header-sub">General Services Office · CARSU · Rev 01 · 06/24/2025</p>
          </div>
        </div>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">

        <!-- Office Info -->
        <div class="office-section">
          <div class="office-grid">
            <div class="office-cell span-2">
              <div class="cell-label">1. Name of Office</div>
              <div class="cell-value">{{ record.office || 'General Services Office' }}</div>
            </div>
            <div class="office-cell span-2">
              <div class="cell-label">2. Department / Division</div>
              <div class="cell-value">{{ record.department || 'Division of Campus Facility, Safety, and Security Services' }}</div>
            </div>
            <div class="office-cell">
              <div class="cell-label">3. Contact No.</div>
              <div class="cell-value">{{ record.contact || '9058123506' }}</div>
            </div>
          </div>
          <div class="office-grid">
            <div class="office-cell span-2">
              <div class="cell-label">4. Email Address</div>
              <div class="cell-value">{{ record.email || 'csugeneralservices@carsu.edu.ph' }}</div>
            </div>
            <div class="office-cell span-2">
              <div class="cell-label">5. Person-in-Charge of Files</div>
              <div class="cell-value">{{ record.personInCharge || 'Esmeraldo C. Catipan' }}</div>
            </div>
            <div class="office-cell">
              <div class="cell-label">6. Date Prepared</div>
              <div class="cell-value">{{ formatDate(record.datePrepared) || '—' }}</div>
            </div>
          </div>
        </div>

        <!-- Full Spreadsheet Table -->
        <div class="sheet-wrap">
          <table class="sheet">
            <thead>
              <tr class="th-top">
                <th rowspan="2" class="c-num">#</th>
                <th rowspan="2" class="c-title">7. Records Series Title and Description</th>
                <th rowspan="2" class="c-sm">8. Period Covered</th>
                <th rowspan="2" class="c-sm">9. Item No. (Ref Code)</th>
                <th rowspan="2" class="c-sm">10. Volume</th>
                <th rowspan="2" class="c-sm">11. Medium</th>
                <th rowspan="2" class="c-sm">12. Restrictions</th>
                <th colspan="2" class="c-grp">13. Location of Records</th>
                <th rowspan="2" class="c-sm">14. Freq</th>
                <th rowspan="2" class="c-xs">15. Dup</th>
                <th rowspan="2" class="c-xs">16. T/P</th>
                <th rowspan="2" class="c-sm">17. Utility</th>
                <th colspan="3" class="c-grp">18. Retention Period</th>
                <th rowspan="2" class="c-disp">19. Disposition</th>
              </tr>
              <tr class="th-sub">
                <th>Active</th>
                <th>Inactive</th>
                <th>Active</th>
                <th>Storage</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, i) in displayRows" :key="i">

                <!-- BLUE GRDS Header Row -->
                <tr v-if="row._type === 'blue'" class="tr-blue">
                  <td class="td-side"></td>
                  <td colspan="16" class="td-hdr-cell td-blue-lbl">{{ row.label }}</td>
                </tr>

                <!-- YELLOW Sub-Header Row -->
                <tr v-else-if="row._type === 'yellow'" class="tr-yellow">
                  <td class="td-side"></td>
                  <td colspan="16" class="td-hdr-cell td-yellow-lbl">{{ row.label }}</td>
                </tr>

                <!-- GRAY Group / Section Label Row -->
                <tr v-else-if="row._type === 'group'" class="tr-section">
                  <td class="td-side"></td>
                  <td colspan="16" class="td-section-cell">{{ row.label }}</td>
                </tr>

                <!-- DATA Row -->
                <tr v-else class="tr-data"
                    :class="[i % 2 === 0 ? 'stripe' : '', row.id === record.id ? 'highlight' : '']">
                  <td class="td-num">{{ dataRowNumber(i) }}</td>
                  <td class="td-title"><strong>{{ row.title }}</strong></td>
                  <td class="td-val">{{ row.period || '—' }}</td>
                  <td class="td-val"><span class="ref-code">{{ row.code || '—' }}</span></td>
                  <td class="td-val">{{ row.volume || '—' }}</td>
                  <td class="td-val"><span class="med-chip">{{ row.medium || 'Paper' }}</span></td>
                  <td class="td-val">{{ row.restrict || 'Open' }}</td>
                  <td class="td-val">{{ row.locationActive || row.location || '—' }}</td>
                  <td class="td-val">{{ row.locationInactive || '—' }}</td>
                  <td class="td-val center">{{ row.freq || '—' }}</td>
                  <td class="td-val center">{{ row.dup || 'N/A' }}</td>
                  <td class="td-val center">
                    <span :class="row.tval === 'P' ? 'tag tag-perm' : 'tag tag-temp'">{{ row.tval || 'T' }}</span>
                  </td>
                  <td class="td-val">{{ row.util || '—' }}</td>
                  <td class="td-val center">{{ row.retActive ?? row.active ?? '—' }}</td>
                  <td class="td-val center">{{ row.retStorage ?? row.inactive ?? '—' }}</td>
                  <td class="td-val center gold-val">{{ calcTotal(row) }}</td>
                  <td class="td-val small">{{ row.disp || '—' }}</td>
                </tr>

              </template>

              <tr v-if="groupedRecords.length === 0">
                <td colspan="17" class="empty-row">No records found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary bar -->
        <div class="summary-bar">
          <span class="sum-item">
            <span class="sum-dot gold"></span>
            Total: <strong>{{ groupedRecords.length }}</strong> records
          </span>
          <span class="sum-item">
            <span class="sum-dot green"></span>
            Permanent: <strong>{{ groupedRecords.filter(r => r.tval === 'P').length }}</strong>
          </span>
          <span class="sum-item">
            <span class="sum-dot amber"></span>
            Temporary: <strong>{{ groupedRecords.filter(r => r.tval !== 'P').length }}</strong>
          </span>
        </div>

      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="footer-ref">F-DRC-011, Rev 01 · 06/24/2025</div>
        <div class="footer-actions">
          <button class="btn-print" @click="doPrint">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print
          </button>
          <button class="btn-excel" @click="doExport">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            Export to Excel
          </button>
          <button class="btn-close-footer" @click="$emit('close')">Close</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { exportToExcel } from '@/utils/exportExcel'

const props = defineProps({ record: Object })
defineEmits(['close'])

const store = useStore()

// ── Only the actual data records from Firestore (same batch) ──────────────────
const groupedRecords = computed(() => {
  const all = store.getters.allRecords
  const batchId = props.record.batchId

  const records = all
    .filter(r => batchId ? r.batchId === batchId : r.id === props.record.id)
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return aTime - bTime
    })

  return records
})

// ── Full display rows including reconstructed header rows ─────────────────────
const displayRows = computed(() => {
  const rows = []

  // Always prepend the blue GRDS header
  rows.push({
    _type: 'blue',
    label: 'RECORDS SERIES BASED ON GENERAL RECORDS DISPOSITION SCHEDULE (GRDS)'
  })

  // Always prepend the yellow sub-header
  rows.push({
    _type: 'yellow',
    label: 'ADMINISTRATIVE AND MANAGEMENT RECORDS'
  })

  // Group label rows are rebuilt from each record's saved `section` field
  let lastSection = null
  for (const r of groupedRecords.value) {
    if (r.section && r.section !== lastSection) {
      lastSection = r.section
      rows.push({ _type: 'group', label: r.section })
    }
    rows.push({ _type: 'data', ...r })
  }

  return rows
})

// ── Numbering: only count data rows ──────────────────────────────────────────
function dataRowNumber(currentIdx) {
  let n = 0
  for (let i = 0; i <= currentIdx; i++) {
    if (displayRows.value[i]?._type === 'data') n++
  }
  return n
}

function calcTotal(r) {
  const a = Number(r.retActive ?? r.active ?? 0)
  const s = Number(r.retStorage ?? r.inactive ?? 0)
  const t = a + s
  return t || '—'
}

function doPrint() {
  document.body.classList.add('printing-modal')
  window.print()
  document.body.classList.remove('printing-modal')
}

function doExport() {
  const officeInfo = {
    office:         props.record.office         || 'General Services Office',
    department:     props.record.department     || 'Division of Campus Facility, Safety, and Security Services',
    contact:        props.record.contact        || '9058123506',
    email:          props.record.email          || 'csugeneralservices@carsu.edu.ph',
    personInCharge: props.record.personInCharge || 'Esmeraldo C. Catipan',
    datePrepared:   props.record.datePrepared   || new Date().toLocaleDateString('en-PH'),
  }
  exportToExcel(groupedRecords.value, officeInfo)
}

function formatDate(val) {
  if (!val) return null
  if (val?.seconds) return new Date(val.seconds * 1000).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  if (typeof val === 'string') {
    const d = new Date(val)
    if (!isNaN(d)) return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return val
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(13,27,42,0.65);
  z-index: 200; display: flex;
  align-items: center; justify-content: center;
  padding: 16px; backdrop-filter: blur(4px);
}
.modal {
  background: #fff; border-radius: 16px;
  width: 98vw; max-width: 1300px;
  max-height: 92vh; overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.35);
  font-family: 'DM Sans', sans-serif;
}

/* ── Modal Header ─────────────────────────────────────── */
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; background: #0d1b2a;
  border-bottom: 2px solid #c9a84c; flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 14px; }
.form-badge {
  background: #c9a84c; color: #0d1b2a;
  font-size: 11px; font-weight: 800;
  padding: 5px 12px; border-radius: 6px; letter-spacing: 1px;
}
.modal-header h3 { font-family: 'DM Serif Display', serif; font-size: 15px; color: #fff; }
.header-sub { font-size: 10px; color: rgba(255,255,255,.45); margin-top: 2px; }
.btn-close {
  background: rgba(255,255,255,.1); border: none;
  color: rgba(255,255,255,.6); font-size: 16px;
  cursor: pointer; padding: 6px 10px; border-radius: 6px;
}
.btn-close:hover { background: rgba(255,255,255,.2); color: #fff; }

/* ── Modal Body ───────────────────────────────────────── */
.modal-body { flex: 1; overflow-y: auto; }

/* ── Office Section ───────────────────────────────────── */
.office-section {
  background: #f8f9fb; border-bottom: 2px solid #e2e8f0;
  padding: 12px 18px; display: flex; flex-direction: column; gap: 6px;
}
.office-grid { display: flex; border: 1px solid #d1d9e6; border-radius: 6px; overflow: hidden; }
.office-cell { flex: 1; padding: 7px 12px; border-right: 1px solid #d1d9e6; }
.office-cell:last-child { border-right: none; }
.office-cell.span-2 { flex: 2; }
.cell-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: #94a3b8; margin-bottom: 3px; }
.cell-value { font-size: 12px; color: #1e293b; font-weight: 600; }

/* ── Sheet ────────────────────────────────────────────── */
.sheet-wrap { overflow-x: auto; }
.sheet { width: 100%; min-width: 1400px; border-collapse: collapse; font-size: 12px; }

.th-top th, .th-sub th {
  background: #0d1b2a; color: rgba(255,255,255,.85);
  padding: 8px 7px; text-align: center;
  font-size: 9.5px; font-weight: 700;
  border: 1px solid #1e3050; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
}
.c-grp {
  background: linear-gradient(135deg,#b8922a,#e8c33a,#c9a84c) !important;
  color: #0d1b2a !important; font-weight: 800 !important;
}
.th-sub th { background: #162032 !important; font-size: 8.5px; color: rgba(255,255,255,.5) !important; }
.c-num   { width: 32px; }
.c-title { width: 200px; text-align: left !important; }
.c-sm    { width: 90px; }
.c-xs    { width: 55px; }
.c-disp  { width: 120px; }

/* ── Blue GRDS Header Row ─────────────────────────────── */
.tr-blue { background: linear-gradient(90deg, #1a56db, #2563eb) !important; }
.td-blue-lbl {
  color: #fff !important; text-align: center;
  font-family: 'Syne', sans-serif;
  font-size: 11px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  padding: 9px 10px;
}

/* ── Yellow Sub-Header Row ────────────────────────────── */
.tr-yellow { background: linear-gradient(90deg, #fef3c7, #fde68a, #fef3c7) !important; }
.td-yellow-lbl {
  color: #78350f !important; text-align: center;
  font-family: 'Syne', sans-serif;
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; padding: 9px 10px;
}

/* ── Shared header cell style ─────────────────────────── */
.td-hdr-cell { border: 1px solid rgba(255,255,255,.15); }

/* ── Gray Group / Section Label Row ──────────────────── */
.tr-section { background: #f1f5f9 !important; }
.td-side { background: #f8fafc; border: 1px solid #e2e8f0; width: 32px; }
.td-section-cell {
  padding: 6px 12px; font-weight: 900; font-size: 12px;
  color: #1e293b; text-transform: uppercase;
  border: 1px solid #e2e8f0; letter-spacing: .5px;
}

/* ── Data Rows ────────────────────────────────────────── */
.tr-data { background: #fff; }
.tr-data:hover td { background: #fffbf0 !important; }
.stripe { background: #f8fafc !important; }
.highlight td { background: #fffbf0 !important; border-left: 3px solid #c9a84c !important; }

.td-num {
  text-align: center; font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: #94a3b8;
  border: 1px solid #e8edf3; padding: 6px 4px;
  background: #f8fafc; min-width: 32px;
}
.td-title { padding: 8px 10px; border: 1px solid #e8edf3; vertical-align: middle; }
.td-title strong { font-size: 12px; color: #1e293b; }
.td-val { padding: 7px 8px; border: 1px solid #e8edf3; text-align: left; vertical-align: middle; color: #334155; }
.td-val.center { text-align: center; }
.td-val.small { font-size: 11px; }
.gold-val { color: #c9a84c !important; font-weight: 800 !important; text-align: center; }

.ref-code { font-family: monospace; font-size: 10px; color: #1a56db; background: #eff6ff; padding: 2px 6px; border-radius: 4px; }
.med-chip { font-size: 10px; color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.tag { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
.tag-perm { background: #dcfce7; color: #14532d; }
.tag-temp { background: #fef3c7; color: #78350f; }
.empty-row { text-align: center; padding: 32px; color: #94a3b8; font-size: 13px; }

/* ── Summary Bar ──────────────────────────────────────── */
.summary-bar {
  display: flex; gap: 24px; align-items: center;
  padding: 10px 20px; background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  font-size: 12px; color: #64748b; font-weight: 600;
  flex-shrink: 0;
}
.sum-item { display: flex; align-items: center; gap: 7px; }
.sum-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sum-dot.gold  { background: #c9a84c; }
.sum-dot.green { background: #10b981; }
.sum-dot.amber { background: #f59e0b; }

/* ── Modal Footer ─────────────────────────────────────── */
.modal-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 22px; border-top: 1px solid #e2e8f0;
  background: #f8fafc; flex-shrink: 0;
}
.footer-ref { font-size: 10px; color: #94a3b8; font-style: italic; }
.footer-actions { display: flex; align-items: center; gap: 10px; }

.btn-print {
  display: flex; align-items: center; gap: 7px;
  background: #1a56db; color: #fff; border: none;
  border-radius: 8px; padding: 8px 18px;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 700; cursor: pointer; transition: all .2s;
}
.btn-print:hover { background: #1e40af; transform: translateY(-1px); }

.btn-excel {
  display: flex; align-items: center; gap: 7px;
  background: #1e7e5a; color: #fff; border: none;
  border-radius: 8px; padding: 8px 18px;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 700; cursor: pointer; transition: all .2s;
}
.btn-excel:hover { background: #10b981; transform: translateY(-1px); }

.btn-close-footer {
  background: #0d1b2a; color: #fff; border: none;
  border-radius: 8px; padding: 8px 22px;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 700; cursor: pointer; transition: background .2s;
}
.btn-close-footer:hover { background: #c9a84c; color: #0d1b2a; }

/* ── Print Styles ─────────────────────────────────────── */
@media print {
  body.printing-modal * { visibility: hidden !important; }
  body.printing-modal .modal { visibility: visible !important; }
  body.printing-modal .modal * { visibility: visible !important; }

  body.printing-modal .modal {
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100% !important; max-width: 100% !important;
    max-height: none !important; box-shadow: none !important;
    border-radius: 0 !important; overflow: visible !important;
    z-index: 9999 !important; background: #fff !important;
  }
  body.printing-modal .modal-body { overflow: visible !important; }
  body.printing-modal .modal-header { display: none !important; }
  body.printing-modal .btn-close,
  body.printing-modal .btn-print,
  body.printing-modal .btn-excel,
  body.printing-modal .btn-close-footer,
  body.printing-modal .footer-actions { visibility: hidden !important; }

  body.printing-modal .sheet-wrap { overflow: visible !important; }
  body.printing-modal .sheet {
    min-width: 100% !important; width: 100% !important;
    font-size: 7.5px !important; border-collapse: collapse !important;
    table-layout: fixed !important;
  }
  body.printing-modal .th-top th,
  body.printing-modal .th-sub th {
    font-size: 7px !important; padding: 3px 2px !important;
    white-space: normal !important; word-wrap: break-word !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body.printing-modal .td-val,
  body.printing-modal .td-title,
  body.printing-modal .td-num {
    padding: 3px 4px !important; font-size: 7.5px !important;
    word-wrap: break-word !important; white-space: normal !important;
  }
  body.printing-modal .tr-blue,
  body.printing-modal .tr-yellow,
  body.printing-modal .tr-section {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body.printing-modal .c-num   { width: 20px !important; }
  body.printing-modal .c-title { width: 14% !important; }
  body.printing-modal .c-sm    { width: 7% !important; }
  body.printing-modal .c-xs    { width: 4% !important; }
  body.printing-modal .c-disp  { width: 7% !important; }
  body.printing-modal .summary-bar { font-size: 8px !important; }
  body.printing-modal .modal-footer { padding: 4px 8px !important; }
  body.printing-modal .footer-ref   { font-size: 8px !important; }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  @page { size: A4 landscape; margin: 8mm 10mm; }
}
</style>