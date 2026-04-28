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
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            General Services Office · CARSU
          </div>
          <div class="info-tag">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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
              <div class="stat-header">
                <div class="stat-icon slate">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span class="stat-label">Total Records</span>
              </div>
              <div class="stat-value">{{ allRecords.length }}</div>
              <div class="stat-desc">All record series on file</div>
              <div class="stat-accent slate-accent"></div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-icon emerald">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span class="stat-label">Permanent</span>
              </div>
              <div class="stat-value">{{ permanentCount }}</div>
              <div class="stat-desc">Archival records (P)</div>
              <div class="stat-accent emerald-accent"></div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-icon amber">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <span class="stat-label">Temporary</span>
              </div>
              <div class="stat-value">{{ temporaryCount }}</div>
              <div class="stat-desc">With retention period (T)</div>
              <div class="stat-accent amber-accent"></div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-icon blue">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <span class="stat-label">Electronic</span>
              </div>
              <div class="stat-value">{{ electronicCount }}</div>
              <div class="stat-desc">Digital format records</div>
              <div class="stat-accent blue-accent"></div>
            </div>

          </div>

          <!-- Action Banner -->
          <div class="action-banner">
            <div class="banner-left">
              <div class="banner-badge">F-DRC-011</div>
              <div>
                <div class="banner-title">Records Inventory and Appraisal Form</div>
                <div class="banner-sub">Rev 01 · 06/24/2025 · General Services Office · Caraga State University</div>
              </div>
            </div>
            <div class="banner-actions">
              <router-link to="/add" class="btn-primary">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
                Add Record
              </router-link>
              <router-link to="/reports" class="btn-ghost">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Reports
              </router-link>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="allRecords.length === 0" class="empty-card">
            <div class="empty-ico">
              <svg width="32" height="32" fill="none" stroke="#94a3b8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <h3>No Records Yet</h3>
            <p>Start adding records using the Records Inventory &amp; Appraisal Form.</p>
            <router-link to="/add" class="btn-primary" style="display:inline-flex">Add First Record</router-link>
          </div>

          <!-- Recent Records Table -->
          <div v-else class="table-card">
            <div class="card-head">
              <div class="card-head-left">
                <div class="live-dot"></div>
                <h2>Recent Records Added</h2>
                <span class="record-count">{{ allRecords.length }} total</span>
              </div>
              <router-link to="/records" class="link-all">
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
                <tr v-for="(r, i) in recentRecords" :key="r.id">
                  <td class="td-n">{{ i + 1 }}</td>
                  <td>
                    <div class="rec-name">{{ r.title }}</div>
                    <div class="rec-section">{{ r.section || r.office || '' }}</div>
                  </td>
                  <td class="td-muted">{{ r.period || '—' }}</td>
                  <td><span class="chip-code">{{ r.code || '—' }}</span></td>
                  <td><span class="chip-medium">{{ r.medium || 'Paper' }}</span></td>
                  <td class="td-muted td-sm">{{ r.locationActive || r.location || '—' }}</td>
                  <td>
                    <span :class="r.tval === 'P' ? 'chip-val perm' : 'chip-val temp'">
                      {{ r.tval === 'P' ? 'Permanent' : 'Temporary' }}
                    </span>
                  </td>
                  <td class="td-ret">
                    {{ r.retActive ?? r.active ?? '—' }} / {{ r.retStorage ?? r.inactive ?? '—' }}
                    <span class="ret-unit">yrs</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="card-foot">
              <span>Showing {{ recentRecords.length }} of {{ allRecords.length }} records</span>
              <span class="foot-ref">F-DRC-011, Rev 01 · 06/24/2025</span>
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

.layout { display: flex; min-height: 100vh; background: #f8fafc; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
.main   { margin-left: 260px; flex: 1; display: flex; flex-direction: column; }

/* ── Top Bar ─────────────────────────────── */
.topbar {
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 24px 32px 0; flex-wrap: wrap; gap: 12px;
}
.breadcrumb { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
.bc-root { font-size: 12px; color: #94a3b8; }
.bc-sep  { color: #cbd5e1; font-size: 12px; }
.bc-cur  { font-size: 12px; color: #475569; font-weight: 500; }
.page-title {
  font-size: 24px; font-weight: 600; color: #0f172a;
  letter-spacing: -0.4px;
}
.topbar-right { display: flex; align-items: center; gap: 8px; padding-bottom: 2px; }
.info-tag {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #64748b;
  background: #fff; border: 1px solid #e2e8f0;
  padding: 6px 12px; border-radius: 6px;
}

/* ── Content ─────────────────────────────── */
.content { padding: 20px 32px 48px; }

/* ── Loading ─────────────────────────────── */
.center-state { text-align: center; padding: 80px; }
.spinner {
  width: 28px; height: 28px; margin: 0 auto 12px;
  border: 2.5px solid #e2e8f0; border-top-color: #475569;
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.center-state p { font-size: 13px; color: #94a3b8; }

/* ── Stat Cards ──────────────────────────── */
.stats-row {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 12px; margin-bottom: 16px;
}
.stat-card {
  background: #fff; border-radius: 10px;
  border: 1px solid #e8ecf0; padding: 18px 20px;
  position: relative; overflow: hidden;
  transition: box-shadow .15s;
}
.stat-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,.07); }
.stat-accent {
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
}
.slate-accent   { background: #64748b; }
.emerald-accent { background: #10b981; }
.amber-accent   { background: #f59e0b; }
.blue-accent    { background: #3b82f6; }

.stat-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
}
.stat-icon {
  width: 32px; height: 32px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
}
.stat-icon.slate   { background: #f1f5f9; color: #64748b; }
.stat-icon.emerald { background: #f0fdf4; color: #059669; }
.stat-icon.amber   { background: #fffbeb; color: #d97706; }
.stat-icon.blue    { background: #eff6ff; color: #3b82f6; }

.stat-label { font-size: 12px; font-weight: 500; color: #64748b; }
.stat-value {
  font-size: 34px; font-weight: 600; color: #0f172a;
  letter-spacing: -1.5px; line-height: 1; margin-bottom: 5px;
}
.stat-desc { font-size: 11.5px; color: #94a3b8; }

/* ── Action Banner ───────────────────────── */
.action-banner {
  background: #0f172a; border-radius: 10px;
  padding: 16px 20px; margin-bottom: 16px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}
.banner-left { display: flex; align-items: center; gap: 14px; }
.banner-badge {
  background: #c9a84c; color: #0f172a;
  font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 4px;
  letter-spacing: 1px; font-family: 'Consolas', monospace;
  white-space: nowrap;
}
.banner-title { font-size: 13.5px; font-weight: 500; color: #f1f5f9; }
.banner-sub   { font-size: 11px; color: #475569; margin-top: 2px; }
.banner-actions { display: flex; gap: 8px; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 7px;
  font-size: 12.5px; font-weight: 500;
  background: #c9a84c; color: #0f172a;
  border: none; cursor: pointer; text-decoration: none;
  transition: background .15s;
}
.btn-primary:hover { background: #d4b05a; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 7px;
  font-size: 12.5px; font-weight: 500;
  background: transparent; color: #94a3b8;
  border: 1px solid #1e293b; cursor: pointer; text-decoration: none;
  transition: all .15s;
}
.btn-ghost:hover { border-color: #334155; color: #cbd5e1; }

/* ── Empty State ─────────────────────────── */
.empty-card {
  background: #fff; border-radius: 10px;
  border: 1px solid #e8ecf0; text-align: center; padding: 60px 40px;
}
.empty-ico {
  width: 64px; height: 64px; border-radius: 50%;
  background: #f8fafc; border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.empty-card h3 { font-size: 17px; font-weight: 600; color: #1e293b; margin-bottom: 6px; }
.empty-card p  { font-size: 13.5px; color: #64748b; margin-bottom: 18px; }

/* ── Table Card ──────────────────────────── */
.table-card {
  background: #fff; border-radius: 10px;
  border: 1px solid #e8ecf0; overflow: hidden;
}
.card-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid #f1f5f9;
}
.card-head-left { display: flex; align-items: center; gap: 10px; }
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #10b981;
  box-shadow: 0 0 0 2px rgba(16,185,129,.15);
}
.card-head h2 { font-size: 14px; font-weight: 600; color: #0f172a; }
.record-count {
  font-size: 11px; color: #94a3b8;
  background: #f8fafc; border: 1px solid #e8ecf0;
  padding: 2px 9px; border-radius: 20px;
}
.link-all {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; color: #64748b; text-decoration: none;
  transition: color .15s;
}
.link-all:hover { color: #1e293b; }

/* ── Table ───────────────────────────────── */
table { width: 100%; border-collapse: collapse; }
thead tr { background: #f8fafc; border-bottom: 1px solid #e8ecf0; }
th {
  padding: 10px 16px; text-align: left;
  font-size: 10.5px; font-weight: 600;
  letter-spacing: .6px; text-transform: uppercase; color: #94a3b8;
}
.th-n { width: 40px; text-align: center; }
tbody tr { border-bottom: 1px solid #f8fafc; transition: background .08s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #fafbfc; }
td { padding: 11px 16px; vertical-align: middle; }

.td-n    { text-align: center; font-size: 11.5px; color: #cbd5e1; font-family: 'Consolas', monospace; }
.td-muted { font-size: 13px; color: #64748b; }
.td-sm   { font-size: 12px; }
.td-ret  { font-size: 12.5px; color: #64748b; white-space: nowrap; font-family: 'Consolas', monospace; }
.ret-unit { font-size: 10.5px; color: #94a3b8; margin-left: 3px; }

.rec-name    { font-size: 13px; font-weight: 500; color: #1e293b; }
.rec-section { font-size: 11px; color: #94a3b8; margin-top: 2px; letter-spacing: .2px; }

.chip-code {
  font-family: 'Consolas', monospace; font-size: 11.5px;
  color: #3b82f6; background: #eff6ff;
  padding: 2px 8px; border-radius: 4px;
}
.chip-medium {
  font-size: 11.5px; font-weight: 500; color: #059669;
  background: #f0fdf4; padding: 2px 8px; border-radius: 4px;
}
.chip-val {
  font-size: 11.5px; font-weight: 500;
  padding: 3px 10px; border-radius: 20px;
}
.chip-val.perm { background: #f0fdf4; color: #166534; }
.chip-val.temp { background: #fefce8; color: #854d0e; }

.card-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 20px; font-size: 11.5px; color: #94a3b8;
  background: #fafbfc; border-top: 1px solid #f1f5f9;
}
.foot-ref { font-family: 'Consolas', monospace; font-size: 10.5px; color: #c9a84c; }
</style>