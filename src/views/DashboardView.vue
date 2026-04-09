<template>
  <div class="layout">
    <Sidebar />
    <div class="main">

      <!-- Top Bar -->
      <div class="topbar">
        <div class="topbar-left">
          <div class="breadcrumb">
            <span class="bc-root">GSO Records</span>
            <span class="bc-sep">/</span>
            <span class="bc-cur">Dashboard</span>
          </div>
          <h1 class="page-title">Overview</h1>
        </div>
        <div class="topbar-right">
          <div class="info-tag">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            General Services Office · CARSU
          </div>
          <div class="info-tag">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ today }}
          </div>
        </div>
      </div>

      <div class="content">

        <div v-if="loading" class="center-state">
          <div class="spinner"></div>
          <p>Loading records...</p>
        </div>

        <template v-else>

          <!-- Stat Cards -->
          <div class="stats-row">

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon" style="background:#fdf6e3">
                  <svg width="18" height="18" fill="none" stroke="#c9a84c" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <span class="stat-tag" style="color:#c9a84c;background:#fdf6e3">Total</span>
              </div>
              <div class="stat-value">{{ allRecords.length }}</div>
              <div class="stat-name">Record Series</div>
              <div class="stat-desc">All record series on file</div>
              <div class="stat-bar" style="background:#c9a84c"></div>
            </div>

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon" style="background:#ecfdf5">
                  <svg width="18" height="18" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span class="stat-tag" style="color:#059669;background:#ecfdf5">Permanent</span>
              </div>
              <div class="stat-value">{{ permanentCount }}</div>
              <div class="stat-name">Permanent Records</div>
              <div class="stat-desc">Archival records (P)</div>
              <div class="stat-bar" style="background:#10b981"></div>
            </div>

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon" style="background:#fffbeb">
                  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <span class="stat-tag" style="color:#d97706;background:#fffbeb">Temporary</span>
              </div>
              <div class="stat-value">{{ temporaryCount }}</div>
              <div class="stat-name">Temporary Records</div>
              <div class="stat-desc">With retention period (T)</div>
              <div class="stat-bar" style="background:#f59e0b"></div>
            </div>

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon" style="background:#eff6ff">
                  <svg width="18" height="18" fill="none" stroke="#1a56db" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <span class="stat-tag" style="color:#1a56db;background:#eff6ff">Electronic</span>
              </div>
              <div class="stat-value">{{ electronicCount }}</div>
              <div class="stat-name">Electronic Records</div>
              <div class="stat-desc">Digital format records</div>
              <div class="stat-bar" style="background:#1a56db"></div>
            </div>

          </div>

          <!-- Banner -->
          <div class="form-banner">
            <div class="banner-left">
              <div class="banner-badge">F-DRC-011</div>
              <div>
                <div class="banner-title">Records Inventory and Appraisal Form</div>
                <div class="banner-sub">Rev 01 · 06/24/2025 · General Services Office · Caraga State University</div>
              </div>
            </div>
            <div class="banner-btns">
              <router-link to="/add" class="bbtn gold">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
                Add Record
              </router-link>
              <router-link to="/reports" class="bbtn ghost">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Reports
              </router-link>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="allRecords.length === 0" class="empty-card">
            <div class="empty-ico">
              <svg width="36" height="36" fill="none" stroke="#c9a84c" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <h3>No Records Yet</h3>
            <p>Start adding records using the Records Inventory &amp; Appraisal Form.</p>
            <router-link to="/add" class="bbtn gold" style="display:inline-flex">Add First Record</router-link>
          </div>

          <!-- Recent Records -->
          <div v-else class="table-card">
            <div class="card-head">
              <div class="card-head-left">
                <span class="pulse-dot"></span>
                <h2>Recent Records Added</h2>
              </div>
              <router-link to="/records" class="view-all">
                View All Records
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </router-link>
            </div>

            <table>
              <thead>
                <tr>
                  <th class="th-n">#</th>
                  <th>Series Title</th>
                  <th>Period Covered</th>
                  <th>Reference Code</th>
                  <th>Medium</th>
                  <th>Location (Active)</th>
                  <th>Time Value</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in recentRecords" :key="r.id" :class="i%2===1?'alt':''">
                  <td class="td-n">{{ i + 1 }}</td>
                  <td>
                    <div class="rec-name">{{ r.title }}</div>
                    <div class="rec-sec">{{ r.section || r.office || '' }}</div>
                  </td>
                  <td class="td-gray">{{ r.period || '—' }}</td>
                  <td><span class="chip-ref">{{ r.code || '—' }}</span></td>
                  <td><span :class="r.medium==='Electronic'?'chip-med elec':'chip-med'">{{ r.medium || 'Paper' }}</span></td>
                  <td class="td-gray td-sm">{{ r.locationActive || r.location || '—' }}</td>
                  <td>
                    <span :class="r.tval==='P'?'chip-tp perm':'chip-tp temp'">
                      {{ r.tval === 'P' ? 'Permanent' : 'Temporary' }}
                    </span>
                  </td>
                  <td class="td-ret">
                    <span>{{ r.retActive ?? r.active ?? '—' }}</span>
                    <span class="ret-sep">/</span>
                    <span>{{ r.retStorage ?? r.inactive ?? '—' }}</span>
                    <span class="ret-u">yrs</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="card-foot">
              <span>Showing {{ recentRecords.length }} most recent of {{ allRecords.length }} records</span>
              <span class="form-ref">F-DRC-011, Rev 01 · 06/24/2025</span>
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/Sidebar.vue'

const store = useStore()
const loading    = computed(() => store.state.loading)
const allRecords = computed(() => store.getters.allRecords)

const permanentCount  = computed(() => allRecords.value.filter(r => r.tval === 'P').length)
const temporaryCount  = computed(() => allRecords.value.filter(r => r.tval === 'T' || !r.tval).length)
const electronicCount = computed(() => allRecords.value.filter(r => r.medium === 'Electronic').length)

const recentRecords = computed(() =>
  [...allRecords.value]
    .sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bt - at
    })
    .slice(0, 10)
)

const today = new Date().toLocaleDateString('en-PH', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

onMounted(() => {
  if (allRecords.value.length === 0) store.dispatch('fetchRecords')
})
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.layout { display: flex; min-height: 100vh; background: #f5f7fa; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
.main   { margin-left: 260px; flex: 1; display: flex; flex-direction: column; }

/* ── Top Bar ─────────────────────────────── */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 32px 0; flex-wrap: wrap; gap: 12px;
}
.breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.bc-root { font-size: 12px; color: #94a3b8; font-weight: 500; }
.bc-sep  { color: #cbd5e1; font-size: 12px; }
.bc-cur  { font-size: 12px; color: #c9a84c; font-weight: 600; }
.page-title { font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.info-tag {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 500; color: #475569;
  background: #fff; border: 1px solid #e2e8f0;
  padding: 7px 14px; border-radius: 8px;
}

/* ── Content ─────────────────────────────── */
.content { padding: 20px 32px 48px; flex: 1; }

/* ── Loading ─────────────────────────────── */
.center-state { text-align: center; padding: 80px; }
.spinner {
  width: 32px; height: 32px; margin: 0 auto 14px;
  border: 3px solid #e2e8f0; border-top-color: #c9a84c;
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.center-state p { font-size: 14px; color: #94a3b8; }

/* ── Stat Cards ──────────────────────────── */
.stats-row {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 14px; margin-bottom: 18px;
}
.stat-card {
  background: #fff; border-radius: 12px;
  border: 1px solid #e8ecf0; padding: 18px 20px;
  position: relative; overflow: hidden;
  transition: box-shadow .2s, transform .2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.08); transform: translateY(-2px); }
.stat-bar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
}
.stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.stat-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.stat-tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.stat-value { font-size: 32px; font-weight: 700; color: #0f172a; line-height: 1; margin-bottom: 4px; letter-spacing: -1px; }
.stat-name  { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 3px; }
.stat-desc  { font-size: 11.5px; color: #94a3b8; }

/* ── Form Banner ─────────────────────────── */
.form-banner {
  background: #0f172a; border-radius: 12px;
  padding: 16px 22px; margin-bottom: 18px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}
.banner-left { display: flex; align-items: center; gap: 14px; }
.banner-badge {
  background: #c9a84c; color: #0f172a;
  font-size: 10px; font-weight: 700;
  padding: 4px 11px; border-radius: 5px; letter-spacing: 1px;
  font-family: 'Consolas', monospace; white-space: nowrap;
}
.banner-title { font-size: 14px; font-weight: 600; color: #fff; }
.banner-sub   { font-size: 11px; color: rgba(255,255,255,.4); margin-top: 2px; }
.banner-btns  { display: flex; gap: 8px; }
.bbtn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px;
  font-size: 12.5px; font-weight: 600;
  cursor: pointer; text-decoration: none; border: none;
  transition: all .2s;
}
.bbtn.gold { background: #c9a84c; color: #0f172a; }
.bbtn.gold:hover { background: #f0c96b; }
.bbtn.ghost { background: rgba(255,255,255,.1); color: rgba(255,255,255,.75); border: 1px solid rgba(255,255,255,.15); }
.bbtn.ghost:hover { background: rgba(255,255,255,.18); color: #fff; }

/* ── Empty State ─────────────────────────── */
.empty-card {
  background: #fff; border-radius: 12px; border: 1px solid #e8ecf0;
  text-align: center; padding: 64px 40px;
}
.empty-ico {
  width: 80px; height: 80px; border-radius: 50%;
  background: #fdf6e3; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px;
}
.empty-card h3 { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.empty-card p  { font-size: 14px; color: #64748b; margin-bottom: 20px; }

/* ── Table Card ──────────────────────────── */
.table-card {
  background: #fff; border-radius: 12px;
  border: 1px solid #e8ecf0; overflow: hidden;
}
.card-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid #f1f5f9;
}
.card-head-left { display: flex; align-items: center; gap: 10px; }
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #c9a84c;
  box-shadow: 0 0 0 3px rgba(201,168,76,.2);
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(201,168,76,.2); }
  50%       { box-shadow: 0 0 0 6px rgba(201,168,76,.05); }
}
.card-head h2 { font-size: 14px; font-weight: 700; color: #0f172a; }
.view-all {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: #c9a84c;
  text-decoration: none; transition: gap .15s;
}
.view-all:hover { gap: 7px; }

/* ── Table ───────────────────────────────── */
table { width: 100%; border-collapse: collapse; }
thead tr { background: #f8fafc; border-bottom: 1px solid #e8ecf0; }
th {
  padding: 10px 14px; text-align: left;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: .8px; text-transform: uppercase; color: #94a3b8;
}
.th-n { width: 40px; text-align: center; }
tbody tr { border-bottom: 1px solid #f8fafc; transition: background .1s; }
tbody tr:last-child { border-bottom: none; }
tbody tr.alt { background: #fafbfc; }
tbody tr:hover { background: #fffbf0 !important; }
td { padding: 11px 14px; vertical-align: middle; }
.td-n  { text-align: center; font-size: 12px; color: #cbd5e1; font-weight: 600; font-family: 'Consolas', monospace; }
.td-gray { font-size: 12.5px; color: #64748b; }
.td-sm   { font-size: 12px; }
.td-ret  { font-size: 12px; color: #64748b; white-space: nowrap; font-family: 'Consolas', monospace; }
.ret-sep { margin: 0 4px; color: #cbd5e1; }
.ret-u   { font-size: 10px; color: #94a3b8; margin-left: 2px; }

.rec-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.rec-sec  { font-size: 11px; color: #94a3b8; margin-top: 2px; }

.chip-ref {
  font-family: 'Consolas', monospace; font-size: 11px;
  color: #1a56db; background: #eff6ff; padding: 2px 8px; border-radius: 5px;
}
.chip-med {
  font-size: 11px; font-weight: 600; color: #059669;
  background: #ecfdf5; padding: 2px 8px; border-radius: 5px;
}
.chip-med.elec { color: #1a56db; background: #eff6ff; }
.chip-tp {
  font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
}
.chip-tp.perm { background: #dcfce7; color: #14532d; }
.chip-tp.temp { background: #fef3c7; color: #78350f; }

.card-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 20px; font-size: 11.5px; color: #94a3b8;
  background: #fafbfc; border-top: 1px solid #f1f5f9;
}
.form-ref { font-family: 'Consolas', monospace; font-size: 10px; color: #c9a84c; }
</style>