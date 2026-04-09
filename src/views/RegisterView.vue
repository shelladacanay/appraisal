<template>
  <div class="login-screen">
    <div class="login-card">
      <div class="login-logo">
        <div class="seal">GSO</div>
        <h1>Create an Account</h1>
        <p>Caraga State University · CARSU</p>
      </div>

      <!-- Success state -->
      <div v-if="registered" class="alert-success">
        <div class="success-icon">📧</div>
        <h3>Verify your Email</h3>
        <p>
          A verification link has been sent to<br/>
          <strong>{{ sentTo }}</strong>
        </p>
        <p class="hint">Check your inbox (and spam folder). Click the link to activate your account.</p>
        <router-link to="/login" class="btn-login" style="display:block;text-align:center;margin-top:16px;text-decoration:none">
          Back to Sign In
        </router-link>
      </div>

      <!-- Register form -->
      <template v-else>
        <div class="form-group">
          <label>Full Name <span class="req">*</span></label>
          <input v-model="name" type="text" placeholder="e.g. Juan Dela Cruz" />
        </div>
        <div class="form-group">
          <label>Email Address <span class="req">*</span></label>
          <input v-model="email" type="email" placeholder="e.g. juan@carsu.edu.ph" />
        </div>
        <div class="form-group">
          <label>Password <span class="req">*</span></label>
          <input v-model="password" type="password" placeholder="At least 6 characters" />
        </div>
        <div class="form-group">
          <label>Confirm Password <span class="req">*</span></label>
          <input v-model="confirmPassword" type="password"
            placeholder="Re-enter your password" @keyup.enter="register" />
        </div>

        <!-- Password strength -->
        <div v-if="password" class="strength-bar">
          <div class="strength-fill" :class="strengthClass" :style="{ width: strengthWidth }"></div>
        </div>
        <p v-if="password" class="strength-label" :class="strengthClass">
          {{ strengthText }}
        </p>

        <button @click="register" class="btn-login" :disabled="loading">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p v-if="error" class="login-error">{{ error }}</p>

        <div class="divider"><span>already have an account?</span></div>
        <router-link to="/login" class="btn-register">Back to Sign In</router-link>
      </template>

      <div class="login-footer">
        <p>General Services Office · CARSU</p>
        <p>F-DRC-011, Rev 01 · 06/24/2025</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut
} from 'firebase/auth'
import { auth } from '@/firebase'

const name            = ref('')
const email           = ref('')
const password        = ref('')
const confirmPassword = ref('')
const error           = ref('')
const loading         = ref(false)
const registered      = ref(false)
const sentTo          = ref('')

// Password strength
const strengthLevel = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 6)  score++
  if (p.length >= 10) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthClass = computed(() => {
  if (strengthLevel.value <= 1) return 'weak'
  if (strengthLevel.value <= 3) return 'fair'
  return 'strong'
})

const strengthWidth = computed(() => {
  return (strengthLevel.value / 5 * 100) + '%'
})

const strengthText = computed(() => {
  if (strengthLevel.value <= 1) return 'Weak password'
  if (strengthLevel.value <= 3) return 'Fair password'
  return 'Strong password'
})

async function register() {
  error.value = ''

  // Validations
  if (!name.value.trim()) {
    error.value = 'Please enter your full name.'; return
  }
  if (!email.value.trim()) {
    error.value = 'Please enter your email address.'; return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'; return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'; return
  }

  loading.value = true
  try {
    // Create account
    const result = await createUserWithEmailAndPassword(
      auth, email.value, password.value
    )

    // Set display name
    await updateProfile(result.user, { displayName: name.value })

    // Send verification email
    await sendEmailVerification(result.user)

    sentTo.value = email.value

    // Sign out until verified
    await signOut(auth)

    registered.value = true
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already registered. Try logging in.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password is too weak. Use at least 6 characters.'
    } else {
      error.value = 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-screen {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: linear-gradient(145deg, #0d1b2a 0%, #1b2d42 60%, #0a3d62 100%);
  position: relative; overflow: hidden;
}
.login-screen::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.07) 0%, transparent 50%);
}
.login-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 20px; padding: 48px;
  width: 420px; position: relative; z-index: 1;
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.4);
}
.login-logo { text-align: center; margin-bottom: 28px; }
.seal {
  width: 64px; height: 64px; background: #c9a84c;
  border-radius: 50%; display: flex; align-items: center;
  justify-content: center; margin: 0 auto 12px;
  font-family: 'DM Serif Display', serif;
  font-size: 20px; color: #0d1b2a; font-weight: 700;
  box-shadow: 0 0 0 6px rgba(201,168,76,0.2);
}
.login-logo h1 { font-family: 'DM Serif Display', serif; font-size: 19px; color: #c9a84c; }
.login-logo p { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px; letter-spacing: 1.5px; text-transform: uppercase; }

.alert-success {
  text-align: center;
  padding: 8px 0;
}
.success-icon { font-size: 48px; margin-bottom: 12px; }
.alert-success h3 { font-family: 'DM Serif Display', serif; color: #c9a84c; font-size: 18px; margin-bottom: 12px; }
.alert-success p { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 8px; }
.alert-success strong { color: #c9a84c; }
.hint { font-size: 11px; color: rgba(255,255,255,0.35); }

.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 8px; }
.req { color: #f87171; }
.form-group input {
  width: 100%; padding: 12px 16px; border-radius: 10px;
  border: 1px solid rgba(201,168,76,0.2);
  background: rgba(255,255,255,0.06); color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
  transition: border .2s;
}
.form-group input:focus { border-color: #c9a84c; }
.form-group input::placeholder { color: rgba(255,255,255,0.25); }

.strength-bar {
  height: 4px; background: rgba(255,255,255,0.1);
  border-radius: 2px; margin: -8px 0 4px; overflow: hidden;
}
.strength-fill { height: 100%; border-radius: 2px; transition: width .3s; }
.strength-fill.weak   { background: #f87171; }
.strength-fill.fair   { background: #fbbf24; }
.strength-fill.strong { background: #34d399; }
.strength-label { font-size: 10px; margin-bottom: 12px; }
.strength-label.weak   { color: #f87171; }
.strength-label.fair   { color: #fbbf24; }
.strength-label.strong { color: #34d399; }

.btn-login {
  width: 100%; padding: 13px; background: #c9a84c;
  border: none; border-radius: 10px;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  font-weight: 600; color: #0d1b2a; cursor: pointer;
  margin-top: 8px; transition: background .2s;
}
.btn-login:hover:not(:disabled) { background: #f0c96b; }
.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
.login-error { color: #f87171; font-size: 12px; text-align: center; margin-top: 10px; }

.divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
.divider span { font-size: 11px; color: rgba(255,255,255,0.25); white-space: nowrap; }

.btn-register {
  display: block; width: 100%; padding: 13px;
  background: transparent; border: 1px solid rgba(201,168,76,0.35);
  border-radius: 10px; color: #c9a84c;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  font-weight: 600; text-align: center; text-decoration: none;
  transition: all .2s; box-sizing: border-box;
}
.btn-register:hover { background: rgba(201,168,76,0.08); }

.login-footer { margin-top: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; }
.login-footer p { font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.8px; margin-top: 3px; }
</style>