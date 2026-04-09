<template>
  <div class="layout">
    <Sidebar />
    <div class="main">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h1>Records Inventory</h1>
            <p class="page-sub">General Services Office · CARSU</p>
          </div>
        </div>
        <div class="page-header-right">
          <div class="stat-pill">
            <span class="stat-num">{{ groupedEntries.length }}</span>
            <span class="stat-lbl">File{{ groupedEntries.length !== 1 ? 's' : '' }}</span>
          </div>
          <div class="stat-pill green">
            <span class="stat-num">{{ allRecords.length }}</span>
            <span class="stat-lbl">Records</span>
          </div>
          <router-link to="/add" class="btn-add">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
            Add Record
          </router-link>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="toolbar">
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="search" class="search-input" placeholder="Search title, code, section, location..." />
          <button v-if="search" @click="search=''" class="search-clear">✕</button>
        </div>
        <div class="filter-group">
          <button v-for="f in filterOptions" :key="f.value"
            :class="['filter-pill', activeFilter === f.value ? 'active' : '']"
            @click="activeFilter = f.value">
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading records...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="groupedEntries.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="40" height="40" fill="none" stroke="#c9a84c" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <h3>No Records Found</h3>
        <p>{{ allRecords.length === 0 ? 'Start by adding your first record.' : 'No records match your search.' }}</p>
        <router-link v-if="allRecords.length === 0" to="/add" class="btn-add">Add First Record</router-link>
      </div>

      <!-- Records Table -->
      <div v-else class="table-card">
        <table>
          <thead>
            <tr>
              <th class="th-num">#</th>
              <th>Title &amp; Section</th>
              <th>Period</th>
              <th>Ref. Code</th>
              <th>Medium</th>
              <th>Location</th>
              <th>Time Value</th>
              <th>Retention</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, idx) in groupedEntries" :key="entry.batchId || entry.id"
                class="record-row">
              <td class="td-num">{{ idx + 1 }}</td>
              <td class="td-title">
                <div class="title-wrap">
                  <span class="rec-title">{{ entry.title }}</span>
                  <span v-if="entry.count > 1" class="more-tag">(+{{ entry.count - 1 }} more)</span>
                </div>
                <span class="rec-section">{{ entry.section || entry.office || '—' }}</span>
              </td>
              <td class="td-period">{{ entry.period || '—' }}</td>
              <td><span class="ref-chip">{{ entry.code || '—' }}</span></td>
              <td><span class="med-chip">{{ entry.medium || 'Paper' }}</span></td>
              <td class="td-loc">{{ entry.locationActive || '—' }}</td>
              <td>
                <span :class="entry.tval === 'P' ? 'tval-chip perm' : 'tval-chip temp'">
                  {{ entry.tval === 'P' ? '● Permanent' : '● Temporary' }}
                </span>
              </td>
              <td class="td-ret">
                {{ entry.records[0]?.retActive ?? entry.records[0]?.active ?? '—' }}y /
                {{ entry.records[0]?.retStorage ?? entry.records[0]?.inactive ?? '—' }}y
              </td>
              <td class="td-actions">
                <button class="act-btn view" @click="openModal(entry.records[0])" title="View">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  View
                </button>
                <button class="act-btn edit" @click="editRecord(entry)" title="Edit">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button class="act-btn delete" @click="confirmDelete(entry)" title="Delete">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6m5 0V4h4v2"/></svg>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-foot">
          Showing <strong>{{ groupedEntries.length }}</strong> file{{ groupedEntries.length !== 1 ? 's' : '' }}
          &nbsp;·&nbsp;
          <strong>{{ allRecords.length }}</strong> total record{{ allRecords.length !== 1 ? 's' : '' }}
        </div>
      </div>

    </div>

    <!-- View Modal -->
    <RecordModal v-if="selectedRecord" :record="selectedRecord" @close="selectedRecord = null" />

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="overlay" @click.self="deleteTarget = null">
      <div class="confirm-box">
        <div class="confirm-head">
          <div class="confirm-icon-wrap">
            <svg width="24" height="24" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <h3>Delete Record{{ deleteTarget.count > 1 ? 's' : '' }}?</h3>
            <p class="confirm-sub">This cannot be undone.</p>
          </div>
        </div>
        <div class="confirm-body">
          <p class="confirm-title">{{ deleteTarget.title }}</p>
          <p v-if="deleteTarget.count > 1" class="confirm-note">
            All {{ deleteTarget.count }} records in this file will be deleted.
          </p>
        </div>
        <div class="confirm-foot">
          <button class="btn-cancel" @click="deleteTarget = null">Cancel</button>
          <button class="btn-del-confirm" @click="doDelete" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Topbar  from '@/components/Topbar.vue'
import RecordModal from '@/components/RecordModal.vue'

const store  = useStore()
const router = useRouter()

const search       = ref('')
const activeFilter = ref('ALL')
const selectedRecord = ref(null)
const deleteTarget   = ref(null)
const deleting       = ref(false)

const loading    = computed(() => store.state.loading)
const allRecords = computed(() => store.getters.allRecords)

const filterOptions = [
  { label: 'All',       value: 'ALL' },
  { label: 'GRDS',      value: 'GRDS' },
  { label: 'URDS',      value: 'URDS' },
  { label: 'Permanent', value: 'P' },
  { label: 'Temporary', value: 'T' },
]

const s = v => (v || '').toString().toLowerCase()

const groupedEntries = computed(() => {
  let data = [...allRecords.value]

  if (activeFilter.value === 'GRDS')      data = data.filter(r => s(r.sched) === 'grds' || s(r.category) === 'grds')
  else if (activeFilter.value === 'URDS') data = data.filter(r => s(r.sched) === 'urds' || s(r.category) === 'urds')
  else if (activeFilter.value === 'P')    data = data.filter(r => r.tval === 'P')
  else if (activeFilter.value === 'T')    data = data.filter(r => r.tval === 'T' || !r.tval)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    data = data.filter(r =>
      s(r.title).includes(q) || s(r.code).includes(q) ||
      s(r.section).includes(q) || s(r.period).includes(q) ||
      s(r.locationActive).includes(q) || s(r.medium).includes(q)
    )
  }

  const groups = {}
  const noBatch = []
  for (const r of data) {
    if (r.batchId) {
      if (!groups[r.batchId]) groups[r.batchId] = []
      groups[r.batchId].push(r)
    } else {
      noBatch.push(r)
    }
  }

  const entries = []
  for (const [batchId, records] of Object.entries(groups)) {
    const f = records[0]
    entries.push({
      batchId, id: f.id,
      title: f.title, period: f.period, code: f.code,
      medium: f.medium, section: f.section, office: f.office,
      locationActive: f.locationActive || f.location,
      tval: f.tval, count: records.length, records,
    })
  }
  for (const r of noBatch) {
    entries.push({
      batchId: null, id: r.id,
      title: r.title, period: r.period, code: r.code,
      medium: r.medium, section: r.section, office: r.office,
      locationActive: r.locationActive || r.location,
      tval: r.tval, count: 1, records: [r],
    })
  }

  return entries.sort((a, b) => {
    const at = a.records[0]?.createdAt ? new Date(a.records[0].createdAt).getTime() : 0
    const bt = b.records[0]?.createdAt ? new Date(b.records[0].createdAt).getTime() : 0
    return bt - at
  })
})

function openModal(record) { selectedRecord.value = record }

function editRecord(entry) {
  const record = entry.records?.[0] || entry
  const allBatch = entry.records || [record]
  sessionStorage.setItem('gso_editing_record', JSON.stringify(record))
  sessionStorage.setItem('gso_editing_id',     String(record.id))
  sessionStorage.setItem('gso_editing_batch',  JSON.stringify(allBatch))
  store.dispatch('setEditing', record)
  router.push('/add')
}

function confirmDelete(entry) { deleteTarget.value = entry }

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    for (const r of deleteTarget.value.records) {
      await store.dispatch('deleteRecord', r.id)
    }
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  if (allRecords.value.length === 0) store.dispatch('fetchRecords')
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.layout { display: flex; min-height: 100vh; background: #f0f4f9; }
.main   { margin-left: 260px; flex: 1; padding: 32px 36px 48px; }

/* ── Page Header ──────────────────────────── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
}
.page-header-left { display: flex; align-items: center; gap: 14px; }
.page-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: #0d1b2a; color: #c9a84c;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(13,27,42,.25);
}
h1 {
  font-family: 'Syne', sans-serif; font-size: 22px;
  font-weight: 800; color: #0d1b2a; margin: 0;
}
.page-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; font-weight: 600; }

.page-header-right { display: flex; align-items: center; gap: 10px; }
.stat-pill {
  display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1px solid #e2e8f0;
  padding: 7px 14px; border-radius: 30px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.stat-pill.green { border-color: rgba(16,185,129,.25); background: rgba(16,185,129,.06); }
.stat-num { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: #0d1b2a; }
.stat-lbl { font-size: 11px; font-weight: 700; color: #64748b; }
.stat-pill.green .stat-num { color: #059669; }

.btn-add {
  display: flex; align-items: center; gap: 7px;
  background: #c9a84c; color: #0d1b2a;
  padding: 9px 18px; border-radius: 10px;
  font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
  text-decoration: none; border: none; cursor: pointer;
  transition: all .2s; box-shadow: 0 4px 12px rgba(201,168,76,.35);
}
.btn-add:hover { background: #f0c96b; transform: translateY(-1px); }

/* ── Toolbar ──────────────────────────────── */
.toolbar {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 20px; flex-wrap: wrap;
}
.search-wrap {
  position: relative; flex: 1; min-width: 260px; max-width: 420px;
}
.search-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; pointer-events: none;
}
.search-input {
  width: 100%; padding: 10px 36px 10px 38px;
  border: 1.5px solid #e2e8f0; border-radius: 12px;
  font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600;
  color: #1e293b; background: #fff; outline: none;
  transition: all .2s; box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.search-input:focus { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,.12); }
.search-input::placeholder { color: #cbd5e1; font-weight: 400; }
.search-clear {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #94a3b8; cursor: pointer;
  font-size: 12px; padding: 2px 4px;
}

.filter-group { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-pill {
  padding: 7px 16px; border-radius: 30px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
  color: #64748b; cursor: pointer; transition: all .15s;
}
.filter-pill:hover { border-color: #0d1b2a; color: #0d1b2a; }
.filter-pill.active { background: #0d1b2a; color: #fff; border-color: #0d1b2a; }

/* ── Loading & Empty ──────────────────────── */
.loading-state {
  text-align: center; padding: 80px 40px;
  background: #fff; border-radius: 16px; border: 1px solid #e2e8f0;
}
.spinner {
  width: 36px; height: 36px; margin: 0 auto 16px;
  border: 3px solid #e2e8f0; border-top-color: #c9a84c;
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { font-size: 13px; color: #94a3b8; font-weight: 600; }

.empty-state {
  text-align: center; padding: 80px 40px;
  background: #fff; border-radius: 16px; border: 1px solid #e2e8f0;
}
.empty-icon {
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(201,168,76,.08);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.empty-state h3 { font-family: 'Syne', sans-serif; font-size: 20px; color: #1e293b; margin-bottom: 8px; }
.empty-state p  { font-size: 13px; color: #64748b; margin-bottom: 20px; }

/* ── Table Card ───────────────────────────── */
.table-card {
  background: #fff; border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,.03), 0 8px 24px rgba(0,0,0,.06);
  overflow: hidden;
}

table { width: 100%; border-collapse: collapse; font-family: 'Nunito', sans-serif; }

thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}
th {
  padding: 13px 16px; text-align: left;
  font-size: 10.5px; font-weight: 800;
  letter-spacing: 1px; text-transform: uppercase;
  color: #94a3b8; white-space: nowrap;
}
.th-num     { width: 44px; text-align: center; }
.th-actions { text-align: right; padding-right: 20px; }

.record-row { border-bottom: 1px solid #f1f5f9; transition: background .12s; }
.record-row:last-child { border-bottom: none; }
.record-row:hover { background: #fffbf0; }

td { padding: 14px 16px; vertical-align: middle; }
.td-num { text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #cbd5e1; font-weight: 700; }

.td-title { max-width: 260px; }
.title-wrap { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rec-title  { font-size: 13.5px; font-weight: 800; color: #1e293b; }
.more-tag {
  font-size: 10px; font-weight: 700; color: #c9a84c;
  background: rgba(201,168,76,.1); border: 1px solid rgba(201,168,76,.3);
  padding: 1px 8px; border-radius: 20px;
}
.rec-section { display: block; font-size: 11px; color: #94a3b8; margin-top: 3px; font-weight: 600; }

.td-period { font-size: 12.5px; color: #64748b; font-weight: 600; white-space: nowrap; }
.td-loc    { font-size: 12px; color: #64748b; max-width: 140px; }
.td-ret    { font-size: 12px; color: #94a3b8; white-space: nowrap; font-family: 'JetBrains Mono', monospace; }

.ref-chip {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: #1a56db; background: #eff6ff;
  padding: 3px 9px; border-radius: 6px; font-weight: 500;
}
.med-chip {
  display: inline-block; font-size: 11px; font-weight: 700;
  color: #059669; background: #ecfdf5;
  padding: 3px 9px; border-radius: 6px;
}
.tval-chip {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 20px;
}
.tval-chip.perm { background: #dcfce7; color: #14532d; }
.tval-chip.temp { background: #fef3c7; color: #78350f; }

/* ── Action Buttons ───────────────────────── */
.td-actions { text-align: right; padding-right: 16px; white-space: nowrap; }
.act-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 8px;
  font-family: 'Nunito', sans-serif; font-size: 11.5px; font-weight: 700;
  border: 1.5px solid transparent; cursor: pointer;
  transition: all .15s; margin-left: 4px;
}
.act-btn.view   { background: #0d1b2a; color: #fff; border-color: #0d1b2a; }
.act-btn.view:hover { background: #1b2d42; }
.act-btn.edit   { background: rgba(201,168,76,.1); color: #8a6a00; border-color: rgba(201,168,76,.4); }
.act-btn.edit:hover { background: #c9a84c; color: #0d1b2a; }
.act-btn.delete { background: rgba(239,68,68,.07); color: #dc2626; border-color: rgba(239,68,68,.25); }
.act-btn.delete:hover { background: #dc2626; color: #fff; }

/* ── Table Footer ─────────────────────────── */
.table-foot {
  padding: 13px 20px; font-size: 12px; color: #94a3b8;
  background: #fafbfc; border-top: 1px solid #f1f5f9;
  font-weight: 600;
}
.table-foot strong { color: #475569; }

/* ── Delete Confirm ───────────────────────── */
.overlay {
  position: fixed; inset: 0; background: rgba(13,27,42,.55);
  z-index: 300; display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.confirm-box {
  background: #fff; border-radius: 18px; width: 420px;
  box-shadow: 0 24px 60px rgba(0,0,0,.25); overflow: hidden;
}
.confirm-head {
  display: flex; align-items: center; gap: 16px;
  padding: 24px 24px 0;
}
.confirm-icon-wrap {
  width: 48px; height: 48px; border-radius: 12px;
  background: #fef2f2; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
}
.confirm-head h3 { font-family: 'Syne', sans-serif; font-size: 18px; color: #1e293b; margin: 0; }
.confirm-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.confirm-body { padding: 16px 24px; }
.confirm-title { font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
.confirm-note  { font-size: 12px; color: #f59e0b; font-weight: 700; }
.confirm-foot {
  display: flex; gap: 10px; justify-content: flex-end;
  padding: 16px 24px; border-top: 1px solid #f1f5f9; background: #fafbfc;
}
.btn-cancel {
  padding: 10px 20px; background: #f1f5f9;
  border: 1px solid #e2e8f0; border-radius: 9px;
  font-family: 'Nunito', sans-serif; font-size: 13px;
  font-weight: 700; cursor: pointer; color: #64748b;
}
.btn-cancel:hover { background: #e2e8f0; }
.btn-del-confirm {
  padding: 10px 22px; background: #dc2626;
  border: none; border-radius: 9px; color: #fff;
  font-family: 'Nunito', sans-serif; font-size: 13px;
  font-weight: 800; cursor: pointer; transition: background .2s;
}
.btn-del-confirm:hover:not(:disabled) { background: #b91c1c; }
.btn-del-confirm:disabled { opacity: .6; cursor: not-allowed; }
</style>