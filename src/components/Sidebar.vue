<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand">GSO Records</div>
      <div class="sub">Inventory & Appraisal</div>
    </div>
    <div class="sidebar-user">
      <span class="avatar">{{ userInitial }}</span>
      <span class="uname">{{ userEmail }}</span>
    </div>
    <nav>
      <router-link to="/dashboard" class="nav-item">📊 Dashboard</router-link>
      <router-link to="/records"   class="nav-item">📁 Records Inventory</router-link>
      <router-link to="/add"       class="nav-item">➕ Add Record</router-link>
      <router-link to="/reports"   class="nav-item">📋 Reports</router-link>
      <router-link to="/about"     class="nav-item">ℹ️ Office Info</router-link>
    </nav>
    <div class="sidebar-footer">
      <button @click="logout" class="btn-logout">⬅ Sign Out</button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

const router      = useRouter()
const userEmail   = computed(() => auth.currentUser?.email || '')
const userInitial = computed(() => userEmail.value[0]?.toUpperCase() || 'U')

async function logout() {
  await signOut(auth)
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed; top: 0; left: 0;
  width: 260px; height: 100vh;
  background: #0d1b2a;
  display: flex; flex-direction: column;
  border-right: 1px solid rgba(201,168,76,0.15);
  z-index: 100;
}
.sidebar-header {
  padding: 28px 24px 20px;
  border-bottom: 1px solid rgba(201,168,76,0.1);
}
.brand {
  font-family: 'DM Serif Display', serif;
  font-size: 15px; color: #c9a84c;
}
.sub {
  font-size: 10px; color: rgba(255,255,255,0.35);
  letter-spacing: 1.5px; text-transform: uppercase; margin-top: 3px;
}
.sidebar-user {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; gap: 10px;
}
.avatar {
  width: 36px; height: 36px; background: #c9a84c;
  border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-weight: 700;
  color: #0d1b2a; font-size: 13px; flex-shrink: 0;
}
.uname { font-size: 12px; color: #fff; word-break: break-all; }
nav { flex: 1; padding: 12px 0; overflow-y: auto; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 24px; font-size: 13px;
  color: rgba(255,255,255,0.55); text-decoration: none;
  border-left: 3px solid transparent; transition: all .15s;
}
.nav-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
.nav-item.router-link-active {
  color: #c9a84c; border-left-color: #c9a84c;
  background: rgba(201,168,76,0.07);
}
.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.btn-logout {
  background: none; border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px; color: rgba(255,255,255,0.4);
  font-size: 12px; padding: 8px 16px; cursor: pointer;
  width: 100%; font-family: 'DM Sans', sans-serif;
  transition: all .2s;
}
.btn-logout:hover { border-color: #c0392b; color: #f87171; }
</style>