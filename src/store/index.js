import { createStore } from 'vuex'
import { db } from '@/firebase'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp
} from 'firebase/firestore'

// Convert Firestore Timestamps to plain strings to avoid reactivity errors
function sanitize(data) {
  const clean = {}
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue
    if (k === '_firestoreId' || k === 'type') continue
    // Convert Firestore Timestamp to ISO string
    if (v && typeof v === 'object' && typeof v.toDate === 'function') {
      clean[k] = v.toDate().toISOString()
    } else {
      clean[k] = v
    }
  }
  return clean
}

export default createStore({
  state: {
    records: [],
    loading: false,
    user: null,
    editingRecord: null
  },
  mutations: {
    SET_RECORDS(state, records)   { state.records = records },
    ADD_RECORD(state, record)     { state.records.push(record) },
    UPDATE_RECORD(state, updated) {
      const idx = state.records.findIndex(r => r.id === updated.id)
      if (idx !== -1) state.records.splice(idx, 1, updated)
    },
    DELETE_RECORD(state, id)      { state.records = state.records.filter(r => r.id !== id) },
    SET_LOADING(state, val)       { state.loading = val },
    SET_USER(state, user)         { state.user = user },
    SET_EDITING(state, record)    { state.editingRecord = record },
    CLEAR_EDITING(state)          { state.editingRecord = null },
  },
  actions: {
    async fetchRecords({ commit }) {
      commit('SET_LOADING', true)
      try {
        const snap = await getDocs(collection(db, 'records'))
        const records = snap.docs.map(d => ({
          ...sanitize(d.data()),
          id: d.id,  // Always use Firestore doc ID, never the stored id field
        }))
        commit('SET_RECORDS', records)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async addRecord({ commit }, record) {
      const payload = sanitize(record)
      // Never store 'id' inside the Firestore document itself
      delete payload.id
      const ref = await addDoc(collection(db, 'records'), {
        ...payload,
        createdAt: serverTimestamp()
      })
      commit('ADD_RECORD', { id: ref.id, ...payload })
    },
    async updateRecord({ commit }, record) {
      const { id, ...rest } = record
      if (!id) throw new Error('Record ID is missing')
      // CRITICAL: id must be a plain string for Firestore
      const firestoreId = String(id)
      const payload = sanitize(rest)
      delete payload.createdAt
      delete payload.updatedAt
      await updateDoc(doc(db, 'records', firestoreId), {
        ...payload,
        updatedAt: serverTimestamp()
      })
      commit('UPDATE_RECORD', { id: firestoreId, ...payload })
    },
    async deleteRecord({ commit }, id) {
      await deleteDoc(doc(db, 'records', String(id)))
      commit('DELETE_RECORD', id)
    },
    setEditing({ commit }, record)  { commit('SET_EDITING', record) },
    clearEditing({ commit })        { commit('CLEAR_EDITING') },
  },
  getters: {
    allRecords:        state => state.records,
    permanentRecords:  state => state.records.filter(r => r.tval === 'P'),
    temporaryRecords:  state => state.records.filter(r => r.tval === 'T'),
    recordsByCategory: state => cat => state.records.filter(r => r.category === cat),
    editingRecord:     state => state.editingRecord,
  }
})