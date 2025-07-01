import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verificar si el usuario existe en nuestra base de datos
          let userData = await api.getUserByFirebaseUid(firebaseUser.uid)

          // Si no existe, crearlo
          if (!userData) {
            userData = await api.createUser({
              firebase_uid: firebaseUser.uid,
              email: firebaseUser.email,
              nombre: firebaseUser.displayName || firebaseUser.email.split('@')[0]
            })
          }

          set({
            user: {
              ...userData,
              firebaseUser
            },
            loading: false
          })
        } catch (error) {
          console.error('Error al inicializar usuario:', error)
          set({ user: null, loading: false })
        }
      } else {
        set({ user: null, loading: false })
      }
    })
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Sesión iniciada correctamente')
      return userCredential.user
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message)
      throw error
    }
  },

  register: async (email, password, nombre) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Crear usuario en nuestra base de datos
      await api.createUser({
        firebase_uid: userCredential.user.uid,
        email,
        nombre
      })

      toast.success('Cuenta creada correctamente')
      return userCredential.user
    } catch (error) {
      toast.error('Error al crear cuenta: ' + error.message)
      throw error
    }
  },

  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null })
      toast.success('Sesión cerrada')
    } catch (error) {
      toast.error('Error al cerrar sesión')
      throw error
    }
  },

  loginAnonymously: async () => {
    try {
      const userCredential = await signInAnonymously(auth)
      toast.success('Sesión anónima iniciada correctamente')
      return userCredential.user
    } catch (error) {
      toast.error('Error al iniciar sesión anónima: ' + error.message)
      throw error
    }
  }
}))