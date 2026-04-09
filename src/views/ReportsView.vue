<template>
  <div class="layout">
    <Sidebar />
    <div class="main">
      <Topbar title="Reports" />
      <div class="content">

        <!-- Actions -->
        <div class="top-bar">
          <div class="top-left">
            <span class="rec-count">
              <span class="pulse"></span>
              {{ allRecords.length }} total records
            </span>
          </div>
          <button @click="printReport" class="btn-print">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print / Export PDF
          </button>
          <button @click="exportExcelFile" class="btn-excel">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            Export to Excel
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="empty-state">
          <div class="loader"></div>
          <p>Loading records...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="allRecords.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" fill="none" stroke="#c9a84c" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h3>No Records to Report</h3>
          <p>Add records first to generate reports.</p>
          <router-link to="/add" class="btn-primary">Go to Add Record</router-link>
        </div>

        <div v-else id="printable-report">

          <!-- Report Header (shows in print) -->
          <div class="print-header">
            <h2>Records Inventory and Appraisal Report</h2>
            <p>General Services Office · Caraga State University · CARSU</p>
            <p>F-DRC-011, Rev 01 · 06/24/2025 · Prepared by: Esmeraldo C. Catipan, LPT</p>
            <p class="print-date">Generated: {{ today }}</p>
          </div>

          <!-- Summary Stats -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-num">{{ allRecords.length }}</div>
              <div class="stat-label">Total Records</div>
            </div>
            <div class="stat-card green">
              <div class="stat-num">{{ permanentRecords.length }}</div>
              <div class="stat-label">Permanent Records</div>
            </div>
            <div class="stat-card amber">
              <div class="stat-num">{{ temporaryRecords.length }}</div>
              <div class="stat-label">Temporary Records</div>
            </div>
            <div class="stat-card blue">
              <div class="stat-num">{{ electronicRecords.length }}</div>
              <div class="stat-label">Electronic Records</div>
            </div>
          </div>

          <!-- All Records Table -->
          <div class="card" style="margin-bottom: 24px">
            <div class="card-header">
              <div class="card-title">
                <span class="card-dot"></span>
                All Records Inventory
              </div>
              <span class="badge">{{ allRecords.length }} records</span>
            </div>
            <div v-if="allRecords.length">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Series Title</th>
                    <th>Period</th>
                    <th>Ref. Code</th>
                    <th>Volume</th>
                    <th>Medium</th>
                    <th>Location</th>
                    <th>Freq</th>
                    <th>T/P</th>
                    <th>Ret. Active</th>
                    <th>Ret. Storage</th>
                    <th>Disposition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in allRecords" :key="r.id">
                    <td class="td-num">{{ i + 1 }}</td>
                    <td>
                      <strong>{{ r.title }}</strong>
                      <span class="sub" v-if="r.section">{{ r.section }}</span>
                    </td>
                    <td class="muted">{{ r.period || '—' }}</td>
                    <td><span class="ref-code">{{ r.code || '—' }}</span></td>
                    <td class="muted">{{ r.volume || '—' }}</td>
                    <td>
                      <span class="med-chip">{{ r.medium || 'Paper' }}</span>
                    </td>
                    <td class="muted small">{{ r.locationActive || r.location || '—' }}</td>
                    <td class="muted">{{ r.freq || '—' }}</td>
                    <td>
                      <span :class="r.tval === 'P' ? 'tag tag-perm' : 'tag tag-temp'">
                        {{ r.tval === 'P' ? 'P' : 'T' }}
                      </span>
                    </td>
                    <td class="muted">{{ r.retActive ?? r.active ?? '—' }}</td>
                    <td class="muted">{{ r.retStorage ?? r.inactive ?? '—' }}</td>
                    <td class="muted small">{{ r.disp || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty">No records found.</div>
          </div>

          <!-- Permanent Records -->
          <div class="card" style="margin-bottom: 24px">
            <div class="card-header">
              <div class="card-title">
                <span class="card-dot green-dot"></span>
                Permanent Records (Archival)
              </div>
              <span class="badge green-badge">{{ permanentRecords.length }} records</span>
            </div>
            <div v-if="permanentRecords.length">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Series Title</th><th>Period</th>
                    <th>Ref. Code</th><th>Location</th><th>Medium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in permanentRecords" :key="r.id">
                    <td class="td-num">{{ i + 1 }}</td>
                    <td><strong>{{ r.title }}</strong><span class="sub" v-if="r.section">{{ r.section }}</span></td>
                    <td class="muted">{{ r.period || '—' }}</td>
                    <td><span class="ref-code">{{ r.code || '—' }}</span></td>
                    <td class="muted small">{{ r.locationActive || r.location || '—' }}</td>
                    <td><span class="med-chip">{{ r.medium || 'Paper' }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty">No permanent records found.</div>
          </div>

          <!-- Temporary Records -->
          <div class="card" style="margin-bottom: 24px">
            <div class="card-header">
              <div class="card-title">
                <span class="card-dot amber-dot"></span>
                Temporary Records
              </div>
              <span class="badge amber-badge">{{ temporaryRecords.length }} records</span>
            </div>
            <div v-if="temporaryRecords.length">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Series Title</th><th>Period</th>
                    <th>Ref. Code</th><th>Ret. Active</th><th>Ret. Storage</th><th>Disposition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in temporaryRecords" :key="r.id">
                    <td class="td-num">{{ i + 1 }}</td>
                    <td><strong>{{ r.title }}</strong><span class="sub" v-if="r.section">{{ r.section }}</span></td>
                    <td class="muted">{{ r.period || '—' }}</td>
                    <td><span class="ref-code">{{ r.code || '—' }}</span></td>
                    <td class="muted">{{ r.retActive ?? r.active ?? '—' }}</td>
                    <td class="muted">{{ r.retStorage ?? r.inactive ?? '—' }}</td>
                    <td class="muted small">{{ r.disp || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty">No temporary records found.</div>
          </div>

          <!-- Electronic Records -->
          <div class="card" v-if="electronicRecords.length">
            <div class="card-header">
              <div class="card-title">
                <span class="card-dot blue-dot"></span>
                Electronic Records
              </div>
              <span class="badge blue-badge">{{ electronicRecords.length }} records</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Series Title</th><th>Period</th>
                  <th>Ref. Code</th><th>Volume</th><th>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in electronicRecords" :key="r.id">
                  <td class="td-num">{{ i + 1 }}</td>
                  <td><strong>{{ r.title }}</strong></td>
                  <td class="muted">{{ r.period || '—' }}</td>
                  <td><span class="ref-code">{{ r.code || '—' }}</span></td>
                  <td class="muted">{{ r.volume || '—' }}</td>
                  <td class="muted small">{{ r.locationActive || r.location || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Print Footer -->
          <div class="print-footer">
            <div class="sig-row">
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-name">Esmeraldo C. Catipan, LPT</div>
                <div class="sig-role">Records Custodian · Prepared by</div>
              </div>
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-name">Engr. Mariel M. Delo</div>
                <div class="sig-role">Immediate Supervisor · Noted by</div>
              </div>
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-name">John Peter M. Mongaya</div>
                <div class="sig-role">Records Overseer · Reviewed by</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/Sidebar.vue'
import Topbar  from '@/components/Topbar.vue'
import { exportToExcel } from '@/utils/exportExcel'

const store = useStore()

const loading    = computed(() => store.state.loading)
const allRecords = computed(() => store.getters.allRecords)
const permanentRecords  = computed(() => allRecords.value.filter(r => r.tval === 'P'))
const temporaryRecords  = computed(() => allRecords.value.filter(r => r.tval === 'T' || !r.tval))
const electronicRecords = computed(() => allRecords.value.filter(r => r.medium === 'Electronic'))

const today = new Date().toLocaleDateString('en-PH', {
  year: 'numeric', month: 'long', day: 'numeric'
})

function printReport() {
  window.print()
}

function exportExcelFile() {
  const officeInfo = {
    office: allRecords.value[0]?.office || 'General Services Office',
    department: allRecords.value[0]?.department || 'Division of Campus Facility, Safety, and Security Services',
    contact: allRecords.value[0]?.contact || '9058123506',
    email: allRecords.value[0]?.email || 'csugeneralservices@carsu.edu.ph',
    personInCharge: allRecords.value[0]?.personInCharge || 'Esmeraldo C. Catipan',
    datePrepared: allRecords.value[0]?.datePrepared || new Date().toLocaleDateString('en-PH'),
  }
  exportToExcel(allRecords.value, officeInfo)
}

onMounted(() => {
  if (allRecords.value.length === 0) store.dispatch('fetchRecords')
})
</script>

<style scoped>
.layout { display: flex; }
.main   { margin-left: 260px; min-height: 100vh; flex: 1; background: #f0f4f9; }
.content { padding: 28px 32px; }

/* Top bar */
.top-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.rec-count {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600; color: #64748b;
}
.pulse {
  width: 8px; height: 8px; border-radius: 50%;
  background: #10b981;
  animation: pulse 1.8s ease infinite;
  box-shadow: 0 0 0 0 rgba(16,185,129,0.5);
}
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
  70%  { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
  100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
}
.btn-print {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px; background: #0d1b2a;
  color: #fff; border: none; border-radius: 9px;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 700; cursor: pointer; transition: all .2s;
}
.btn-print:hover { background: #c9a84c; color: #0d1b2a; }
.btn-excel {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px; background: #1e7e5a;
  color: #fff; border: none; border-radius: 9px;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 700; cursor: pointer; transition: all .2s;
}
.btn-excel:hover { background: #10b981; transform: translateY(-2px); }

/* Print header/footer — only visible when printing */
.print-header { display: none; }
.print-footer { display: none; }

/* Loader / Empty */
.loader {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0; border-top-color: #c9a84c;
  border-radius: 50%; animation: spin .8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state {
  text-align: center; padding: 60px;
  background: #fff; border-radius: 14px; border: 1px solid #e2e8f0;
}
.empty-icon {
  width: 80px; height: 80px;
  background: rgba(201,168,76,0.08);
  border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.empty-state h3 { font-family: 'DM Serif Display', serif; font-size: 20px; color: #1e293b; margin-bottom: 8px; }
.empty-state p  { font-size: 13px; color: #64748b; margin-bottom: 20px; }
.btn-primary {
  display: inline-block; background: #c9a84c; color: #0d1b2a;
  padding: 10px 24px; border-radius: 8px; font-weight: 700;
  font-size: 13px; text-decoration: none;
}

/* Stats */
.stats-grid {
  display: grid; grid-template-columns: repeat(4,1fr);
  gap: 16px; margin-bottom: 24px;
}
.stat-card {
  background: #fff; border-radius: 12px;
  padding: 18px 20px; border: 1px solid #e2e8f0;
  border-top: 3px solid #c9a84c;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.stat-card.green { border-top-color: #10b981; }
.stat-card.amber { border-top-color: #f59e0b; }
.stat-card.blue  { border-top-color: #1a56db; }
.stat-num { font-family: 'DM Serif Display', serif; font-size: 32px; color: #1e293b; }
.stat-label { font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 500; }

/* Card */
.card {
  background: #fff; border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05);
  overflow: hidden; margin-bottom: 20px;
}
.card-header {
  padding: 14px 20px; border-bottom: 1px solid #f1f5f9;
  display: flex; align-items: center; justify-content: space-between;
}
.card-title {
  display: flex; align-items: center; gap: 10px;
  font-family: 'DM Serif Display', serif; font-size: 14px; color: #1e293b;
}
.card-dot { width: 8px; height: 8px; border-radius: 50%; background: #c9a84c; }
.green-dot { background: #10b981; }
.amber-dot { background: #f59e0b; }
.blue-dot  { background: #1a56db; }

.badge {
  font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px;
  background: #0d1b2a; color: #fff;
}
.green-badge { background: #10b981; }
.amber-badge { background: #f59e0b; color: #0d1b2a; }
.blue-badge  { background: #1a56db; }

/* Table */
table { width: 100%; border-collapse: collapse; }
th {
  background: #f8fafc; font-size: 9.5px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; color: #94a3b8;
  padding: 9px 14px; text-align: left; border-bottom: 1px solid #f1f5f9;
}
td {
  padding: 9px 14px; font-size: 12px;
  border-bottom: 1px solid #f8fafc; vertical-align: middle;
}
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fffbf0; }
.td-num { color: #94a3b8; font-size: 10px; font-weight: 700; width: 36px; }
.sub { display: block; font-size: 10px; color: #94a3b8; margin-top: 2px; }
.muted { color: #64748b; font-size: 11.5px; }
.small { font-size: 11px; }
.ref-code {
  font-family: monospace; font-size: 10px; color: #1a56db;
  background: #eff6ff; padding: 2px 6px; border-radius: 4px;
}
.med-chip {
  font-size: 10px; color: #059669;
  background: #ecfdf5; padding: 2px 7px; border-radius: 4px; font-weight: 600;
}
.tag { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
.tag-perm { background: #dcfce7; color: #14532d; }
.tag-temp { background: #fef3c7; color: #78350f; }
.empty { text-align: center; padding: 32px; color: #94a3b8; font-size: 13px; }

/* ── PRINT STYLES ── */
@media print {
  .layout { display: block !important; }
  .main   { margin-left: 0 !important; background: white !important; }
  .content { padding: 0 !important; }
  .top-bar { display: none !important; }

  /* Show print-only elements */
  .print-header {
    display: block !important;
    text-align: center; padding: 20px 0 16px;
    border-bottom: 2px solid #0d1b2a; margin-bottom: 20px;
  }
  .print-header h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 18px; color: #0d1b2a; margin-bottom: 6px;
  }
  .print-header p { font-size: 11px; color: #555; margin-bottom: 2px; }
  .print-header .print-date { font-size: 10px; color: #888; margin-top: 6px; }

  .print-footer {
    display: block !important;
    margin-top: 40px; padding-top: 20px;
    border-top: 1px solid #ccc;
  }
  .sig-row {
    display: flex; justify-content: space-around;
    gap: 24px; margin-top: 40px;
  }
  .sig-block { text-align: center; flex: 1; }
  .sig-line {
    border-top: 1px solid #0d1b2a;
    margin-bottom: 8px;
  }
  .sig-name { font-size: 11px; font-weight: 700; color: #0d1b2a; }
  .sig-role { font-size: 10px; color: #555; margin-top: 3px; }

  /* Hide sidebar topbar in print */
  aside, .topbar { display: none !important; }

  .card { box-shadow: none !important; border: 1px solid #ddd !important; margin-bottom: 16px !important; page-break-inside: avoid; }
  .stats-grid { margin-bottom: 16px !important; }
  tr { page-break-inside: avoid; }
  thead { display: table-header-group; }
}
</style>