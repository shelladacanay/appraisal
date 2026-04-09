<template>
  <div class="layout">
    <Sidebar />
    <div class="main">
      <Topbar title="Office Information" />
      <div class="content">

        <div class="card">
          <div class="card-header">
            <h3>General Services Office</h3>
            <span class="badge">F-DRC-011, Rev 01</span>
          </div>
          <div class="info-body">

            <div class="info-section">
              <div class="section-label">Office Details</div>
              <div class="info-row">
                <span class="info-key">Name of Office</span>
                <span class="info-val">General Services Office</span>
              </div>
              <div class="info-row">
                <span class="info-key">Department / Division</span>
                <span class="info-val">Division of Campus Facility, Safety, and Security Services</span>
              </div>
              <div class="info-row">
                <span class="info-key">Contact No.</span>
                <span class="info-val">9058123506</span>
              </div>
              <div class="info-row">
                <span class="info-key">Email Address</span>
                <span class="info-val">csugeneralservices@carsu.edu.ph</span>
              </div>
              <div class="info-row">
                <span class="info-key">Person-in-Charge</span>
                <span class="info-val">Esmeraldo C. Catipan, LPT</span>
              </div>
              <div class="info-row">
                <span class="info-key">Date Prepared</span>
                <span class="info-val">March 2, 2026</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="info-section">
              <div class="section-label">Signatories</div>
              <div class="signatories">
                <div class="signatory-card">
                  <div class="sig-avatar">EC</div>
                  <div class="sig-name">Esmeraldo C. Catipan, LPT</div>
                  <div class="sig-role">Records Custodian</div>
                  <div class="sig-label">Prepared by</div>
                </div>
                <div class="signatory-card">
                  <div class="sig-avatar">MD</div>
                  <div class="sig-name">Engr. Mariel M. Delo</div>
                  <div class="sig-role">Immediate Supervisor</div>
                  <div class="sig-label">Noted by</div>
                </div>
                <div class="signatory-card">
                  <div class="sig-avatar">JM</div>
                  <div class="sig-name">John Peter M. Mongaya</div>
                  <div class="sig-role">Assigned Records Overseer</div>
                  <div class="sig-label">Reviewed by</div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="info-section">
              <div class="section-label">Legend</div>
              <div class="legend-grid">
                <div class="legend-group">
                  <div class="legend-title">Frequency of Use</div>
                  <div class="legend-item"><span class="legend-code">D</span> Daily</div>
                  <div class="legend-item"><span class="legend-code">W</span> Weekly</div>
                  <div class="legend-item"><span class="legend-code">M</span> Monthly</div>
                  <div class="legend-item"><span class="legend-code">Q</span> Quarterly</div>
                  <div class="legend-item"><span class="legend-code">Y</span> Yearly</div>
                  <div class="legend-item"><span class="legend-code">ANA</span> As the Need Arises</div>
                </div>
                <div class="legend-group">
                  <div class="legend-title">Time Value</div>
                  <div class="legend-item"><span class="legend-code">T</span> Temporary</div>
                  <div class="legend-item"><span class="legend-code">P</span> Permanent</div>
                </div>
                <div class="legend-group">
                  <div class="legend-title">Utility Value</div>
                  <div class="legend-item"><span class="legend-code">Acad</span> Academic</div>
                  <div class="legend-item"><span class="legend-code">Adm</span> Administrative</div>
                  <div class="legend-item"><span class="legend-code">F</span> Fiscal</div>
                  <div class="legend-item"><span class="legend-code">L</span> Legal</div>
                  <div class="legend-item"><span class="legend-code">Arc</span> Archival</div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="info-section">
              <div class="section-label">Form Reference</div>
              <div class="info-row">
                <span class="info-key">Form Number</span>
                <span class="info-val">F-DRC-011, Rev 01</span>
              </div>
              <div class="info-row">
                <span class="info-key">Effectivity Date</span>
                <span class="info-val">June 24, 2025</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
</script>

<style scoped>
.layout { display: flex; }
.main   { margin-left: 260px; min-height: 100vh; flex: 1; background: #f5f0e8; }
.content { padding: 28px 32px; }

.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8e4dc;
  box-shadow: 0 4px 24px rgba(13,27,42,0.08);
  overflow: hidden;
}
.card-header {
  padding: 18px 24px;
  border-bottom: 1px solid #e8e4dc;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-header h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 16px;
  color: #0d1b2a;
}
.badge {
  background: #c9a84c;
  color: #0d1b2a;
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  padding: 3px 10px;
}
.info-body { padding: 28px; }

.info-section { margin-bottom: 8px; }
.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #c9a84c;
  margin-bottom: 16px;
}
.info-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  align-items: flex-start;
}
.info-key {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #8a8070;
  min-width: 180px;
  padding-top: 2px;
}
.info-val { font-size: 13px; color: #1a1612; }

.divider {
  height: 1px;
  background: #f0ece4;
  margin: 24px 0;
}

.signatories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.signatory-card {
  background: #f8f6f0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e8e4dc;
}
.sig-avatar {
  width: 48px;
  height: 48px;
  background: #0d1b2a;
  color: #c9a84c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  margin: 0 auto 12px;
}
.sig-name  { font-size: 13px; font-weight: 600; color: #0d1b2a; }
.sig-role  { font-size: 11px; color: #8a8070; margin-top: 4px; }
.sig-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #c9a84c;
  margin-top: 10px;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.legend-title {
  font-size: 11px;
  font-weight: 700;
  color: #0d1b2a;
  margin-bottom: 10px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #555;
  margin-bottom: 6px;
}
.legend-code {
  font-family: monospace;
  font-size: 10px;
  background: #eff6ff;
  color: #1a5f9e;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  min-width: 36px;
  text-align: center;
}
</style>