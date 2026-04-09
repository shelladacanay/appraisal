<template>
  <div class="layout">
    <Sidebar />
    <div class="page-wrap">

      <!-- Page Header -->
      <div class="page-head">
        <div class="head-left">
          <div class="form-badge">F-DRC-011</div>
          <div>
            <h1 class="page-title">Records Inventory &amp; Appraisal</h1>
            <p class="page-sub">General Services Office &nbsp;·&nbsp; CARSU &nbsp;·&nbsp; Rev 01 &nbsp;·&nbsp; 06/24/2025</p>
          </div>
        </div>
        <div class="head-right">
          <button v-if="isEditing" @click="cancelEdit" class="btn-cancel">✕ Cancel</button>
          <button @click="saveAll" class="btn-save" :disabled="saving">
            {{ saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save All' }}
          </button>
        </div>
      </div>

      <!-- Edit Notice -->
      <div v-if="isEditing" class="edit-notice">
        <svg width="14" height="14" fill="none" stroke="#c9a84c" stroke-width="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <span>Editing: <strong>{{ editingRecord?.title }}</strong></span>
        <span class="notice-hint">— Edit the row below, then click Save Changes.</span>
      </div>

      <!-- Office Info -->
      <div class="office-card">
        <div class="section-label">Office Information</div>
        <div class="office-grid">
          <div class="ofield" v-for="(f, key) in officeFields" :key="key">
            <label>{{ f.label }}</label>
            <input v-model="officeInfo[key]" :type="f.type||'text'" :placeholder="f.ph" />
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="legends">
          <span class="leg"><i class="ldot blue"></i>GRDS/URDS Header</span>
          <span class="leg"><i class="ldot gold"></i>Sub-Header</span>
          <span class="leg"><i class="ldot gray"></i>Section Label</span>
          <span class="leg"><i class="ldot green"></i>Data Row</span>
        </div>
        <div class="live-badge">
          <span class="live-dot"></span>
          <strong>{{ dataRowCount }}</strong>
          <span>record{{ dataRowCount !== 1 ? 's' : '' }} ready</span>
        </div>
      </div>

      <!-- Toasts -->
      <transition name="toast">
        <div v-if="successMsg" class="toast success">{{ successMsg }}</div>
      </transition>
      <transition name="toast">
        <div v-if="errorMsg" class="toast error">{{ errorMsg }}</div>
      </transition>

      <!-- Spreadsheet -->
      <div class="sheet-card">
        <div class="scroll-x">
          <table class="sheet">
            <thead>
              <tr class="thead-top">
                <th rowspan="2" class="col-num">#</th>
                <th rowspan="2" class="col-title">7. Records Series Title &amp; Description</th>
                <th rowspan="2" class="col-md">8. Period Covered</th>
                <th rowspan="2" class="col-md">9. Item No. (Ref Code)</th>
                <th rowspan="2" class="col-md">10. Volume</th>
                <th rowspan="2" class="col-md">11. Records Medium</th>
                <th rowspan="2" class="col-md">12. Restrictions</th>
                <th colspan="2" class="col-grp">13. Location of Records</th>
                <th rowspan="2" class="col-md">14. Frequency of Use</th>
                <th rowspan="2" class="col-sm">15. Duplication</th>
                <th rowspan="2" class="col-sm">16. Time Value (T/P)</th>
                <th rowspan="2" class="col-md">17. Utility Value</th>
                <th colspan="3" class="col-grp">18. Retention Period</th>
                <th rowspan="2" class="col-md">19. Disposition</th>
                <th rowspan="2" class="col-x">✕</th>
              </tr>
              <tr class="thead-sub">
                <th class="col-md">Active</th>
                <th class="col-md">Inactive</th>
                <th class="col-sm">Active</th>
                <th class="col-sm">Storage</th>
                <th class="col-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, idx) in rows" :key="row.id">

                <tr v-if="row.type==='blue'" class="tr-blue">
                  <td class="td-side"></td>
                  <td colspan="16" class="td-hdr">
                    <input v-model="row.label" class="hdr-in blue-in" placeholder="e.g. RECORDS SERIES BASED ON GENERAL RECORDS DISPOSITION SCHEDULE (GRDS)" />
                  </td>
                  <td class="td-x"><button @click="removeRow(idx)" class="xbtn">✕</button></td>
                </tr>

                <tr v-else-if="row.type==='yellow'" class="tr-yellow">
                  <td class="td-side"></td>
                  <td colspan="16" class="td-hdr">
                    <input v-model="row.label" class="hdr-in yellow-in" placeholder="e.g. ADMINISTRATIVE AND MANAGEMENT RECORDS" />
                  </td>
                  <td class="td-x"><button @click="removeRow(idx)" class="xbtn">✕</button></td>
                </tr>

                <tr v-else-if="row.type==='group'" class="tr-group">
                  <td class="td-side"></td>
                  <td colspan="16" class="td-hdr">
                    <input v-model="row.label" class="hdr-in group-in" placeholder="e.g. CORRESPONDENCE" />
                  </td>
                  <td class="td-x"><button @click="removeRow(idx)" class="xbtn">✕</button></td>
                </tr>

                <tr v-else class="tr-data" :class="[dataRowNumber(idx)%2===0?'':'alt-row', isEditing?'edit-row':'']">
                  <td class="td-rn">{{ dataRowNumber(idx) }}</td>
                  <td class="td-in"><input v-model="row.title"            class="ci ci-lg" placeholder="e.g. Outgoing Communication (Internal)" /></td>
                  <td class="td-in"><input v-model="row.period"           class="ci ci-md" placeholder="2023-2024" /></td>
                  <td class="td-in"><input v-model="row.code"             class="ci ci-md" placeholder="GSO-ADM-8.2" /></td>
                  <td class="td-in"><input v-model="row.volume"           class="ci ci-md" placeholder="0.00107 m³" /></td>
                  <td class="td-in">
                    <select v-model="row.medium" class="cs">
                      <option>Paper</option><option>Electronic</option><option>Both</option>
                    </select>
                  </td>
                  <td class="td-in">
                    <select v-model="row.restrict" class="cs">
                      <option>Open</option><option>Restricted</option><option>Confidential</option>
                    </select>
                  </td>
                  <td class="td-in"><input v-model="row.locationActive"   class="ci ci-md" placeholder="GSO-CSC1-L.1-AF 1" /></td>
                  <td class="td-in"><input v-model="row.locationInactive" class="ci ci-md" placeholder="GSO-SACK 1" /></td>
                  <td class="td-in">
                    <select v-model="row.freq" class="cs">
                      <option>ANA</option><option>D</option><option>W</option><option>M</option><option>Q</option><option>Y</option>
                    </select>
                  </td>
                  <td class="td-in">
                    <select v-model="row.dup" class="cs cs-sm">
                      <option>N/A</option><option>Yes</option><option>No</option>
                    </select>
                  </td>
                  <td class="td-in">
                    <select v-model="row.tval" class="cs cs-sm">
                      <option>T</option><option>P</option>
                    </select>
                  </td>
                  <td class="td-in">
                    <select v-model="row.util" class="cs">
                      <option>ADM/F/L</option><option>ADM/F</option><option>ADM</option><option>F/L</option><option>L</option>
                    </select>
                  </td>
                  <td class="td-in"><input v-model.number="row.retActive"  type="number" min="0" class="ci ci-sm num-in" placeholder="0" /></td>
                  <td class="td-in"><input v-model.number="row.retStorage" type="number" min="0" class="ci ci-sm num-in" placeholder="0" /></td>
                  <td class="td-total">{{ (Number(row.retActive)||0)+(Number(row.retStorage)||0)||'—' }}</td>
                  <td class="td-in td-last">
                    <input v-model="row.disp" class="ci ci-md" placeholder="e.g. After acted upon" />
                    <button @click="removeRow(idx)" class="xbtn xbtn-row">✕</button>
                  </td>
                  <td style="display:none"></td>
                </tr>

              </template>
              <tr v-if="rows.length===0">
                <td colspan="18" class="empty-row">No rows yet — use the buttons below to add headers and data rows.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bottom-bar">
        <div class="bb-left">
          <button @click="addSection('blue')"   class="btn-add-row blue">
            <span class="btn-dot blue-dot"></span> GRDS/URDS
          </button>
          <button @click="addSection('yellow')" class="btn-add-row gold">
            <span class="btn-dot gold-dot"></span> Sub-Header
          </button>
          <button @click="addSection('group')"  class="btn-add-row gray">
            <span class="btn-dot gray-dot"></span> Section Label
          </button>
          <button @click="addRow"               class="btn-add-row green">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
            Add Row
          </button>
          <div class="live-badge small">
            <span class="live-dot"></span>
            <strong>{{ dataRowCount }}</strong>
            <span>row{{ dataRowCount!==1?'s':'' }}</span>
          </div>
        </div>
        <div class="bb-right">
          <button v-if="isEditing" @click="cancelEdit" class="btn-cancel">✕ Cancel</button>
          <button @click="saveAll" class="btn-save" :disabled="saving">
            {{ saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save All' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const store  = useStore()
const router = useRouter()

const saving     = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

const editingRecord  = computed(() => store.getters.editingRecord)
const isEditing      = computed(() => !!editingRecord.value)
const firestoreDocId = ref(null)

const officeFields = {
  office:         { label: '1. Name of Office',            ph: 'General Services Office' },
  department:     { label: '2. Department / Division',     ph: 'Division of Campus Facility...' },
  contact:        { label: '3. Contact No.',               ph: '9058123506' },
  email:          { label: '4. Email Address',             ph: 'csugeneralservices@carsu.edu.ph', type: 'email' },
  personInCharge: { label: '5. Person-in-Charge of Files', ph: 'Esmeraldo C. Catipan' },
  datePrepared:   { label: '6. Date Prepared',             ph: '', type: 'date' },
}
const officeInfo = ref({
  office: 'General Services Office',
  department: 'Division of Campus Facility, Safety, and Security Services',
  contact: '9058123506',
  email: 'csugeneralservices@carsu.edu.ph',
  personInCharge: 'Esmeraldo C. Catipan',
  datePrepared: new Date().toISOString().split('T')[0],
})

let nid = 1
const mkRow = (data = {}) => ({
  id: nid++, type: 'data',
  title: data.title || '', period: data.period || '',
  code: data.code || '', volume: data.volume || '',
  medium: data.medium || 'Paper', restrict: data.restrict || 'Open',
  locationActive: data.locationActive || data.location || '',
  locationInactive: data.locationInactive || '',
  freq: data.freq || 'ANA', dup: data.dup || 'N/A',
  tval: data.tval || 'T', util: data.util || 'ADM/F/L',
  retActive: data.retActive ?? data.active ?? '',
  retStorage: data.retStorage ?? data.inactive ?? '',
  disp: data.disp || '', section: data.section || '',
  _firestoreId: data.id || null,
})
const mkSec = t => ({ id: nid++, type: t, label: '' })

const defaultRows = () => [
  { id: nid++, type:'blue',   label:'RECORDS SERIES BASED ON GENERAL RECORDS DISPOSITION SCHEDULE (GRDS)' },
  { id: nid++, type:'yellow', label:'ADMINISTRATIVE AND MANAGEMENT RECORDS' },
  { id: nid++, type:'group',  label:'CORRESPONDENCE' },
  mkRow(),
]
const rows = ref(defaultRows())

function getSectionFor(rowIndex) {
  for (let i = rowIndex - 1; i >= 0; i--) {
    if (rows.value[i].type === 'group') return rows.value[i].label || ''
  }
  return ''
}

function fillOffice(r) {
  if (r.office)         officeInfo.value.office         = r.office
  if (r.department)     officeInfo.value.department     = r.department
  if (r.contact)        officeInfo.value.contact        = r.contact
  if (r.email)          officeInfo.value.email          = r.email
  if (r.personInCharge) officeInfo.value.personInCharge = r.personInCharge
  if (r.datePrepared)   officeInfo.value.datePrepared   = r.datePrepared
}

function loadEditRecord(r) {
  if (!r) return
  firestoreDocId.value = String(r.id || '')
  fillOffice(r)
  rows.value = [
    { id: nid++, type:'blue',   label:'RECORDS SERIES BASED ON GENERAL RECORDS DISPOSITION SCHEDULE (GRDS)' },
    { id: nid++, type:'yellow', label:'ADMINISTRATIVE AND MANAGEMENT RECORDS' },
    { id: nid++, type:'group',  label: r.section || 'CORRESPONDENCE' },
    mkRow(r),
  ]
}

function loadEditBatch(firstRecord, batchRecords) {
  if (!firstRecord) return
  fillOffice(firstRecord)
  const builtRows = [
    { id: nid++, type:'blue',   label:'RECORDS SERIES BASED ON GENERAL RECORDS DISPOSITION SCHEDULE (GRDS)' },
    { id: nid++, type:'yellow', label:'ADMINISTRATIVE AND MANAGEMENT RECORDS' },
  ]
  let lastSection = null
  for (const r of batchRecords) {
    const section = r.section || ''
    if (section !== lastSection) {
      lastSection = section
      builtRows.push({ id: nid++, type: 'group', label: section })
    }
    builtRows.push(mkRow(r))
  }
  rows.value = builtRows
}

onMounted(() => {
  const storedId    = sessionStorage.getItem('gso_editing_id')
  const savedBatch  = sessionStorage.getItem('gso_editing_batch')
  const savedRecord = sessionStorage.getItem('gso_editing_record')
  if (storedId) firestoreDocId.value = storedId
  if (savedBatch) {
    try {
      const batchRecords = JSON.parse(savedBatch)
      const firstRecord  = savedRecord ? JSON.parse(savedRecord) : batchRecords[0]
      if (storedId) firstRecord.id = storedId
      store.dispatch('setEditing', firstRecord)
      loadEditBatch(firstRecord, batchRecords)
      return
    } catch(e) { sessionStorage.removeItem('gso_editing_batch') }
  }
  if (savedRecord) {
    try {
      const r = JSON.parse(savedRecord)
      if (storedId) r.id = storedId
      store.dispatch('setEditing', r)
      loadEditRecord(r)
      return
    } catch(e) {
      sessionStorage.removeItem('gso_editing_record')
      sessionStorage.removeItem('gso_editing_id')
    }
  }
  if (editingRecord.value) {
    firestoreDocId.value = String(editingRecord.value.id || '')
    loadEditRecord(editingRecord.value)
  }
})

watch(editingRecord, (r) => {
  if (r && rows.value.filter(x => x.type === 'data').every(x => !x.title)) loadEditRecord(r)
}, { immediate: false })

const dataRowCount = computed(() => rows.value.filter(r => r.type === 'data').length)

function dataRowNumber(idx) {
  let n = 0
  for (let i = 0; i <= idx; i++) if (rows.value[i].type === 'data') n++
  return n
}
function addRow() {
  rows.value.push(mkRow())
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior:'smooth' }), 60)
}
function addSection(t) {
  rows.value.push(mkSec(t))
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior:'smooth' }), 60)
}
function removeRow(i) { rows.value.splice(i, 1) }
function cancelEdit() {
  sessionStorage.removeItem('gso_editing_record')
  sessionStorage.removeItem('gso_editing_id')
  sessionStorage.removeItem('gso_editing_batch')
  firestoreDocId.value = null
  store.dispatch('clearEditing')
  router.push('/records')
}

async function saveAll() {
  errorMsg.value = ''
  successMsg.value = ''
  saving.value = true
  try {
    if (isEditing.value) {
      const dataRows = rows.value.filter(r => r.type === 'data')
      if (!dataRows.length || !dataRows[0].title.trim()) {
        errorMsg.value = 'Title is required.'
        saving.value = false
        return
      }
      const firestoreId =
        sessionStorage.getItem('gso_editing_id') ||
        firestoreDocId.value ||
        editingRecord.value?.id
      if (!firestoreId || firestoreId === 'null' || firestoreId === '') {
        errorMsg.value = 'Record ID not found. Please cancel and try again.'
        saving.value = false
        return
      }
      const buildPayload = (row) => {
        const rowIndex = rows.value.indexOf(row)
        return {
          title: String(row.title||''), period: String(row.period||''),
          code: String(row.code||''), volume: String(row.volume||''),
          medium: String(row.medium||'Paper'), restrict: String(row.restrict||'Open'),
          locationActive: String(row.locationActive||''), locationInactive: String(row.locationInactive||''),
          freq: String(row.freq||'ANA'), dup: String(row.dup||'N/A'),
          tval: String(row.tval||'T'), util: String(row.util||'ADM/F/L'),
          retActive: Number(row.retActive)||0, retStorage: Number(row.retStorage)||0,
          retTotal: (Number(row.retActive)||0)+(Number(row.retStorage)||0),
          disp: String(row.disp||''), section: getSectionFor(rowIndex),
          office: String(officeInfo.value.office||''), department: String(officeInfo.value.department||''),
          contact: String(officeInfo.value.contact||''), email: String(officeInfo.value.email||''),
          personInCharge: String(officeInfo.value.personInCharge||''), datePrepared: String(officeInfo.value.datePrepared||''),
        }
      }
      let originalBatch = []
      try { const b = sessionStorage.getItem('gso_editing_batch'); originalBatch = b ? JSON.parse(b) : [] } catch(e) {}
      const batchId = originalBatch[0]?.batchId || (Date.now().toString(36)+Math.random().toString(36).slice(2,7))
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i]
        if (!row.title.trim()) continue
        const payload = { ...buildPayload(row), batchId }
        if (i===0) await store.dispatch('updateRecord', { id: String(firestoreId), ...payload })
        else if (originalBatch[i]) await store.dispatch('updateRecord', { id: String(originalBatch[i].id), ...payload })
        else await store.dispatch('addRecord', payload)
      }
      for (let i = dataRows.length; i < originalBatch.length; i++) {
        if (originalBatch[i]?.id) await store.dispatch('deleteRecord', originalBatch[i].id)
      }
      successMsg.value = 'Records saved successfully!'
      sessionStorage.removeItem('gso_editing_record')
      sessionStorage.removeItem('gso_editing_id')
      sessionStorage.removeItem('gso_editing_batch')
      firestoreDocId.value = null
      setTimeout(() => { store.dispatch('clearEditing'); router.push('/records') }, 1200)
    } else {
      const valid = rows.value.filter(r => r.type==='data' && r.title.trim() && r.period.trim() && r.code.trim())
      if (!valid.length) {
        errorMsg.value = 'Fill in Title, Period, and Ref Code for at least one row.'
        saving.value = false
        return
      }
      const batchId = Date.now().toString(36)+Math.random().toString(36).slice(2,7)
      for (const r of valid) {
        const rowIndex = rows.value.indexOf(r)
        await store.dispatch('addRecord', {
          batchId, section: getSectionFor(rowIndex),
          title: String(r.title||''), period: String(r.period||''),
          code: String(r.code||''), volume: String(r.volume||''),
          medium: String(r.medium||'Paper'), restrict: String(r.restrict||'Open'),
          locationActive: String(r.locationActive||''), locationInactive: String(r.locationInactive||''),
          freq: String(r.freq||'ANA'), dup: String(r.dup||'N/A'),
          tval: String(r.tval||'T'), util: String(r.util||'ADM/F/L'),
          retActive: Number(r.retActive)||0, retStorage: Number(r.retStorage)||0,
          retTotal: (Number(r.retActive)||0)+(Number(r.retStorage)||0),
          disp: String(r.disp||''),
          office: String(officeInfo.value.office||''), department: String(officeInfo.value.department||''),
          contact: String(officeInfo.value.contact||''), email: String(officeInfo.value.email||''),
          personInCharge: String(officeInfo.value.personInCharge||''), datePrepared: String(officeInfo.value.datePrepared||''),
        })
      }
      successMsg.value = `${valid.length} record(s) saved successfully!`
      rows.value = defaultRows()
      window.scrollTo({ top:0, behavior:'smooth' })
      setTimeout(() => { successMsg.value = '' }, 4000)
    }
  } catch(e) {
    errorMsg.value = 'Save failed: ' + (e?.message || e?.code || String(e))
    console.error('SAVE ERROR:', e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.layout   { display: flex; min-height: 100vh; background: #f5f7fa; }
.page-wrap {
  margin-left: 260px; flex: 1;
  padding: 24px 28px 56px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #1e293b;
}

/* ── Page Header ─────────────────────────── */
.page-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px; flex-wrap: wrap; gap: 12px;
}
.head-left { display: flex; align-items: center; gap: 14px; }
.form-badge {
  background: #0f172a; color: #c9a84c;
  font-family: 'Consolas', monospace; font-size: 11px; font-weight: 700;
  padding: 7px 14px; border-radius: 20px; letter-spacing: 1.2px;
}
.page-title {
  font-size: 22px; font-weight: 700; color: #0f172a;
  letter-spacing: -0.3px; line-height: 1.2;
}
.page-sub { font-size: 12px; color: #94a3b8; margin-top: 3px; }
.head-right { display: flex; gap: 8px; }

/* ── Edit Notice ─────────────────────────── */
.edit-notice {
  display: flex; align-items: center; gap: 8px;
  background: #fffbeb; border: 1px solid #fde68a;
  border-radius: 8px; padding: 10px 16px; margin-bottom: 12px;
  font-size: 13px; color: #92400e;
}
.notice-hint { color: #94a3b8; font-size: 12px; margin-left: 2px; }

/* ── Office Card ─────────────────────────── */
.office-card {
  background: #fff; border: 1px solid #e8ecf0;
  border-radius: 12px; padding: 16px 20px; margin-bottom: 12px;
}
.section-label {
  font-size: 10px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: #94a3b8; margin-bottom: 12px;
}
.office-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px 16px; }
.ofield { display: flex; flex-direction: column; gap: 4px; }
.ofield label {
  font-size: 10.5px; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.8px;
}
.ofield input {
  border: 1px solid #e2e8f0; border-radius: 7px;
  padding: 8px 12px; font-size: 13px; font-weight: 400;
  color: #1e293b; background: #fff; outline: none; transition: all .18s;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.ofield input:focus {
  border-color: #c9a84c;
  box-shadow: 0 0 0 3px rgba(201,168,76,.12);
}

/* ── Status Bar ──────────────────────────── */
.status-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px; flex-wrap: wrap; gap: 8px;
}
.legends { display: flex; gap: 16px; flex-wrap: wrap; }
.leg { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
.ldot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.ldot.blue  { background: #1a56db; }
.ldot.gold  { background: #f59e0b; }
.ldot.gray  { background: #94a3b8; }
.ldot.green { background: #10b981; }
.live-badge {
  display: flex; align-items: center; gap: 7px;
  background: #ecfdf5; border: 1px solid #a7f3d0;
  padding: 5px 14px; border-radius: 20px;
  font-size: 12.5px; color: #065f46;
}
.live-badge strong { font-size: 14px; font-weight: 700; }
.live-badge.small  { padding: 4px 12px; font-size: 12px; }
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #10b981;
  animation: blink 2s ease infinite;
}
@keyframes blink {
  0%,100% { opacity: 1; } 50% { opacity: .4; }
}

/* ── Toasts ──────────────────────────────── */
.toast {
  padding: 11px 16px; border-radius: 8px; font-size: 13px;
  font-weight: 500; margin-bottom: 10px; border-left: 3px solid;
}
.toast.success { background: #ecfdf5; border-color: #10b981; color: #065f46; }
.toast.success::before { content: '✓  '; font-weight: 700; }
.toast.error   { background: #fef2f2; border-color: #ef4444; color: #991b1b; }
.toast.error::before   { content: '! '; font-weight: 700; }
.toast-enter-active { animation: slideDown .25s ease; }
.toast-leave-active { animation: slideDown .2s ease reverse; }
@keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

/* ── Sheet Card ──────────────────────────── */
.sheet-card {
  background: #fff; border: 1px solid #e8ecf0; border-radius: 12px;
  overflow: hidden; margin-bottom: 12px;
}
.scroll-x { overflow-x: auto; }

/* ── Spreadsheet Table ───────────────────── */
.sheet { width: 100%; border-collapse: collapse; min-width: 1700px; }

.thead-top th, .thead-sub th {
  background: #0f172a; color: rgba(255,255,255,.8);
  padding: 9px 8px; text-align: center;
  font-size: 10px; font-weight: 600; letter-spacing: .3px;
  border: 1px solid #1e293b; white-space: nowrap; line-height: 1.4;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.col-grp {
  background: #c9a84c !important; color: #0f172a !important;
  font-weight: 700 !important;
}
.thead-sub th {
  background: #1e293b !important; font-size: 9px;
  color: rgba(255,255,255,.5) !important;
}
.col-num   { width: 36px; }
.col-title { min-width: 220px; text-align: left !important; }
.col-md    { min-width: 90px; }
.col-sm    { min-width: 60px; }
.col-x     { width: 36px; }

/* Header rows */
.tr-blue   { background: #1a56db; }
.tr-yellow { background: #fef3c7; }
.tr-group  { background: #f1f5f9; }

.td-side { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.08); width: 36px; }
.td-hdr  { border: 1px solid rgba(255,255,255,.12); padding: 0 10px; }
.td-x    { text-align: center; border: 1px solid rgba(226,232,240,.5); padding: 2px; }

.hdr-in { width: 100%; border: none; outline: none; background: transparent; padding: 8px 4px; font-size: 12px; font-weight: 600; text-align: center; font-family: 'Segoe UI', system-ui, sans-serif; }
.blue-in   { color: #fff; letter-spacing: .6px; }
.yellow-in { color: #78350f; }
.group-in  { color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }

/* Data rows */
.tr-data { background: #fff; transition: background .1s; }
.tr-data:hover { background: #fffbf0; }
.alt-row { background: #fafbfc; }
.edit-row { background: #fffbeb !important; }
.edit-row td:first-child { border-left: 3px solid #c9a84c !important; }

.td-rn {
  text-align: center; font-size: 11px; color: #94a3b8; font-weight: 600;
  border: 1px solid #e8ecf0; padding: 4px; background: #f8fafc; min-width: 36px;
  font-family: 'Consolas', monospace;
}
.td-in { border: 1px solid #e8ecf0; padding: 2px 3px; }
.td-in:focus-within {
  background: #fffbf0;
  box-shadow: inset 0 0 0 1.5px #c9a84c;
  position: relative; z-index: 2;
}
.td-total {
  text-align: center; font-weight: 700; font-size: 12px; color: #c9a84c;
  border: 1px solid #e8ecf0; padding: 4px; background: #fffbeb;
  min-width: 48px; font-family: 'Consolas', monospace;
}
.td-last { display: flex; align-items: center; gap: 2px; }

.ci {
  border: none; outline: none; background: transparent;
  font-size: 12.5px; font-weight: 400; color: #1e293b; padding: 5px 5px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.ci-lg { width: 100%; min-width: 200px; }
.ci-md { width: 100%; min-width: 72px; }
.ci-sm { width: 48px; text-align: center; font-family: 'Consolas', monospace; }
.num-in { color: #334155; }
.cs {
  width: 100%; border: none; outline: none; background: transparent;
  font-size: 12.5px; font-weight: 400; color: #1e293b; padding: 5px 2px;
  cursor: pointer; font-family: 'Segoe UI', system-ui, sans-serif;
}
.cs-sm { max-width: 58px; }
input::placeholder { color: #c8d0dc; }

.empty-row {
  text-align: center; padding: 48px; color: #94a3b8;
  font-size: 13px; font-style: italic;
}
.xbtn {
  background: none; border: none; color: #cbd5e1; font-size: 11px;
  cursor: pointer; padding: 4px 7px; border-radius: 5px; transition: all .15s;
}
.xbtn:hover { background: #fee2e2; color: #ef4444; }
.xbtn-row { flex-shrink: 0; opacity: 0; transition: opacity .15s; }
tr:hover .xbtn-row { opacity: 1; }

/* ── Bottom Bar ──────────────────────────── */
.bottom-bar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 8px;
}
.bb-left  { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.bb-right { display: flex; align-items: center; gap: 8px; }

.btn-add-row {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 13px; border-radius: 8px;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s;
  border: 1px solid; font-family: 'Segoe UI', system-ui, sans-serif;
}
.btn-dot { width: 7px; height: 7px; border-radius: 2px; flex-shrink: 0; }
.btn-add-row.blue  { background: rgba(26,86,219,.07);   border-color: rgba(26,86,219,.25);   color: #1a56db; }
.btn-add-row.blue .blue-dot { background: #1a56db; }
.btn-add-row.blue:hover  { background: #1a56db; color: #fff; }
.btn-add-row.gold  { background: rgba(245,158,11,.08);  border-color: rgba(245,158,11,.3);   color: #b45309; }
.btn-add-row.gold .gold-dot { background: #f59e0b; }
.btn-add-row.gold:hover  { background: #c9a84c; color: #0f172a; }
.btn-add-row.gray  { background: rgba(148,163,184,.08); border-color: rgba(148,163,184,.3);  color: #475569; }
.btn-add-row.gray .gray-dot { background: #94a3b8; }
.btn-add-row.gray:hover  { background: #64748b; color: #fff; }
.btn-add-row.green { background: rgba(16,185,129,.08);  border-color: rgba(16,185,129,.3);   color: #059669; }
.btn-add-row.green:hover { background: #059669; color: #fff; }

.btn-cancel {
  display: flex; align-items: center; gap: 5px;
  padding: 9px 18px; border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  background: rgba(239,68,68,.07); color: #dc2626;
  border: 1px solid rgba(239,68,68,.2);
  font-family: 'Segoe UI', system-ui, sans-serif;
  transition: all .15s;
}
.btn-cancel:hover { background: #dc2626; color: #fff; }
.btn-save {
  display: inline-flex; align-items: center;
  padding: 9px 28px; border-radius: 8px; border: none;
  background: #c9a84c; color: #0f172a;
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all .2s; min-width: 120px; justify-content: center;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.btn-save:hover:not(:disabled) { background: #f0c96b; transform: translateY(-1px); }
.btn-save:disabled { opacity: .65; cursor: not-allowed; }
</style>