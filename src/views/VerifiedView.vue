<template>
  <div class="verified-screen">
    <div class="verified-card">

      <div class="check-circle">
        <svg viewBox="0 0 52 52" class="check-svg">
          <circle class="check-circle-bg" cx="26" cy="26" r="25" fill="none"/>
          <path class="check-mark" fill="none" d="M14 27 l8 8 l16-16"/>
        </svg>
      </div>

      <h1>Email Verified!</h1>
      <p class="sub">Your account has been successfully verified.<br/>You can now access the GSO Records Inventory System.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="info-icon">🏛️</span>
          <span>General Services Office · CARSU</span>
        </div>
        <div class="info-row">
          <span class="info-icon">📋</span>
          <span>Records Inventory & Appraisal System</span>
        </div>
        <div class="info-row">
          <span class="info-icon">✅</span>
          <span>Account status: <strong>Active</strong></span>
        </div>
      </div>

      <button @click="goToDashboard" class="btn-dashboard">
        Go to Dashboard →
      </button>

      <p class="footer-note">
        F-DRC-011, Rev 01 · 06/24/2025
      </p>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { reload } from 'firebase/auth'

const router = useRouter()

onMounted(async () => {
  // Reload user to get latest verification status
  if (auth.currentUser) {
    await reload(auth.currentUser)
  }
})

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<style scoped>
.verified-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #0d1b2a 0%, #1b2d42 60%, #0a3d62 100%);
  position: relative;
  overflow: hidden;
}
.verified-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.07) 0%, transparent 50%);
}
.verified-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 24px;
  padding: 52px 48px;
  width: 460px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.4);
  text-align: center;
}

/* Animated checkmark */
.check-circle {
  width: 90px;
  height: 90px;
  margin: 0 auto 28px;
}
.check-svg {
  width: 90px;
  height: 90px;
}
.check-circle-bg {
  stroke: #c9a84c;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke 0.6s cubic-bezier(0.65,0,0.45,1) forwards;
}
.check-mark {
  stroke: #c9a84c;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65,0,0.45,1) 0.6s forwards;
}
@keyframes stroke {
  100% { stroke-dashoffset: 0; }
}

h1 {
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  color: #c9a84c;
  margin-bottom: 12px;
}
.sub {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
  margin-bottom: 28px;
}

.info-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(201,168,76,0.15);
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 28px;
  text-align: left;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.info-row:last-child { border-bottom: none; }
.info-row strong { color: #86efac; }
.info-icon { font-size: 16px; }

.btn-dashboard {
  width: 100%;
  padding: 15px;
  background: #c9a84c;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0d1b2a;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  letter-spacing: 0.3px;
}
.btn-dashboard:hover {
  background: #f0c96b;
  transform: translateY(-2px);
}

.footer-note {
  font-size: 10px;
  color: rgba(255,255,255,0.2);
  margin-top: 20px;
  letter-spacing: 0.8px;
}
</style>