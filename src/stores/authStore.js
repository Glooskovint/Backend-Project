import { create } from 'zustand'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  
  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verificar si el usuario existe en nuestra base de datos
          let user = await apiService.getUserByFirebaseUid(firebaseUser.uid)
          
          if (!user) {
            // Crear usuario en nuestra base de datos si no existe
            user = await apiService.createUser({
              firebase_uid: firebaseUser.uid,
              email: firebaseUser.email,
              nombre: firebaseUser.displayName || firebaseUser.email.split('@')[0]
            })
          }
          
          set({ user, loading: false })
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
      toast.error('Error al iniciar sesión')
      throw error
    }
  },
  
  register: async (email, password, nombre) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Crear usuario en nuestra base de datos
      await apiService.createUser({
        firebase_uid: userCredential.user.uid,
        email,
        nombre
      })
      
      toast.success('Cuenta creada correctamente')
      return userCredential.user
    } catch (error) {
      toast.error('Error al crear la cuenta')
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
  }
}))