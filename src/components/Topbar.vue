<template>
  <div class="topbar">
    <h2>{{ title }}</h2>
    <span class="badge">General Services Office</span>
  </div>
</template>

<script setup>
defineProps({ title: String })
</script>

<style scoped>
.topbar {
  background: #fff;
  border-bottom: 1px solid #e8e4dc;
  padding: 16px 32px;
  display: flex; align-items: center;
  justify-content: space-between;
  position: sticky; top: 0; z-index: 50;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.topbar h2 {
  font-family: 'DM Serif Display', serif;
  font-size: 20px; color: #0d1b2a;
}
.badge {
  background: #c9a84c; color: #0d1b2a;
  font-size: 10px; font-weight: 700;
  border-radius: 20px; padding: 3px 10px;
}
</style>