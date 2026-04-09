<template>
  <div class="login-screen">
    <div class="login-card">
      <div class="login-logo">
        <div class="seal">GSO</div>
        <h1>Records Inventory System</h1>
        <p>Caraga State University · CARSU</p>
      </div>

      <!-- Verified success notice -->
      <div v-if="justVerified" class="alert-success">
        ✅ Email verified! You can now sign in.
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email"
          placeholder="Enter your email" @keyup.enter="login" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password"
          placeholder="Enter your password" @keyup.enter="login" />
      </div>

      <button @click="login" class="btn-login" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>

      <p v-if="error" class="login-error">{{ error }}</p>

      <!-- Forgot Password -->
      <div class="forgot-wrap">
        <span @click="showForgot = !showForgot" class="forgot-link">
          Forgot password?
        </span>
      </div>

      <div v-if="showForgot" class="forgot-box">
        <p>Enter your email to receive a reset link:</p>
        <input v-model="resetEmail" type="email" placeholder="Enter your email" />
        <button @click="sendReset" class="btn-reset" :disabled="resetSent">
          {{ resetSent ? '✅ Email Sent!' : 'Send Reset Link' }}
        </button>
        <p v-if="resetMsg" class="reset-msg">{{ resetMsg }}</p>
      </div>

      <!-- Resend verification -->
      <div v-if="showResend" class="resend-box">
        <p>Didn't receive the verification email?</p>
        <button @click="resendVerification" class="btn-resend">
          Resend Verification Email
        </button>
        <p v-if="resendMsg" class="resend-msg">{{ resendMsg }}</p>
      </div>

      <div class="divider"><span>or</span></div>

      <router-link to="/register" class="btn-register">
        Create an Account
      </router-link>

      <div class="login-footer">
        <p>General Services Office · CARSU</p>
        <p>F-DRC-011, Rev 01 · 06/24/2025</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth'
import { auth } from '@/firebase'

const email      = ref('')
const password   = ref('')
const error      = ref('')
const loading    = ref(false)
const showResend = ref(false)
const resendMsg  = ref('')
const showForgot = ref(false)
const resetEmail = ref('')
const resetSent  = ref(false)
const resetMsg   = ref('')
const router     = useRouter()
const route      = useRoute()

const justVerified = ref(route.query.verified === 'true')

async function login() {
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }
  error.value      = ''
  loading.value    = true
  showResend.value = false

  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    if (!result.user.emailVerified) {
      await signOut(auth)
      error.value      = '⚠️ Please verify your email before logging in. Check your inbox.'
      showResend.value = true
      loading.value    = false
      return
    }
    router.push('/dashboard')
  } catch (err) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential'
    ) {
      error.value = 'Invalid email or password.'
    } else if (err.code === 'auth/too-many-requests') {
      error.value = 'Too many attempts. Please try again later.'
    } else {
      error.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

async function resendVerification() {
  resendMsg.value = ''
  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    await sendEmailVerification(result.user)
    await signOut(auth)
    resendMsg.value = '✅ Verification email sent! Check your inbox.'
  } catch {
    resendMsg.value = '❌ Could not resend. Check your email and password.'
  }
}

async function sendReset() {
  resetMsg.value = ''
  if (!resetEmail.value) {
    resetMsg.value = 'Please enter your email.'
    return
  }
  try {
    await sendPasswordResetEmail(auth, resetEmail.value)
    resetSent.value = true
    resetMsg.value  = '✅ Reset link sent! Check your Gmail inbox.'
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      resetMsg.value = '❌ No account found with this email.'
    } else {
      resetMsg.value = '❌ Failed to send. Please try again.'
    }
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
.login-logo h1 {
  font-family: 'DM Serif Display', serif;
  font-size: 19px; color: #c9a84c;
}
.login-logo p {
  font-size: 11px; color: rgba(255,255,255,0.4);
  margin-top: 4px; letter-spacing: 1.5px; text-transform: uppercase;
}
.alert-success {
  background: rgba(34,197,94,0.15);
  border: 1px solid rgba(34,197,94,0.3);
  color: #86efac; font-size: 12px;
  padding: 10px 14px; border-radius: 8px;
  margin-bottom: 16px; text-align: center;
}
.form-group { margin-bottom: 18px; }
.form-group label {
  display: block; font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,0.5); letter-spacing: 1.2px;
  text-transform: uppercase; margin-bottom: 8px;
}
.form-group input {
  width: 100%; padding: 12px 16px; border-radius: 10px;
  border: 1px solid rgba(201,168,76,0.2);
  background: rgba(255,255,255,0.06); color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
  transition: border .2s;
}
.form-group input:focus { border-color: #c9a84c; }
.form-group input::placeholder { color: rgba(255,255,255,0.25); }
.btn-login {
  width: 100%; padding: 13px; background: #c9a84c;
  border: none; border-radius: 10px;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  font-weight: 600; color: #0d1b2a; cursor: pointer;
  margin-top: 4px; transition: background .2s;
}
.btn-login:hover:not(:disabled) { background: #f0c96b; }
.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
.login-error {
  color: #f87171; font-size: 12px;
  text-align: center; margin-top: 10px;
}
.forgot-wrap {
  text-align: right;
  margin-top: 8px;
}
.forgot-link {
  font-size: 12px; color: #c9a84c;
  cursor: pointer; text-decoration: underline;
}
.forgot-link:hover { color: #f0c96b; }
.forgot-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 16px; margin-top: 12px;
}
.forgot-box p {
  font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 10px;
}
.forgot-box input {
  width: 100%; padding: 10px 14px; border-radius: 8px;
  border: 1px solid rgba(201,168,76,0.2);
  background: rgba(255,255,255,0.06); color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  outline: none; margin-bottom: 10px;
}
.forgot-box input:focus { border-color: #c9a84c; }
.btn-reset {
  width: 100%; padding: 10px;
  background: rgba(201,168,76,0.2);
  border: 1px solid rgba(201,168,76,0.4);
  border-radius: 8px; color: #c9a84c;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all .2s;
}
.btn-reset:hover:not(:disabled) { background: rgba(201,168,76,0.3); }
.btn-reset:disabled { opacity: 0.6; cursor: not-allowed; }
.reset-msg {
  font-size: 11px; color: #86efac;
  margin-top: 8px; text-align: center;
}
.resend-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 14px;
  margin-top: 14px; text-align: center;
}
.resend-box p { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
.btn-resend {
  background: none; border: 1px solid rgba(201,168,76,0.4);
  color: #c9a84c; font-size: 12px; font-weight: 600;
  padding: 7px 16px; border-radius: 8px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all .2s;
}
.btn-resend:hover { background: rgba(201,168,76,0.1); }
.resend-msg { font-size: 11px; color: #86efac; margin-top: 8px; margin-bottom: 0; }
.divider {
  display: flex; align-items: center; gap: 12px; margin: 20px 0;
}
.divider::before, .divider::after {
  content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1);
}
.divider span { font-size: 11px; color: rgba(255,255,255,0.25); }
.btn-register {
  display: block; width: 100%; padding: 13px;
  background: transparent;
  border: 1px solid rgba(201,168,76,0.35);
  border-radius: 10px; color: #c9a84c;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  font-weight: 600; text-align: center;
  text-decoration: none; transition: all .2s;
  box-sizing: border-box;
}
.btn-register:hover { background: rgba(201,168,76,0.08); }
.login-footer {
  margin-top: 24px; text-align: center;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 14px;
}
.login-footer p {
  font-size: 10px; color: rgba(255,255,255,0.2);
  letter-spacing: 0.8px; margin-top: 3px;
}
</style>