import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true, // true inicialmente hasta que onAuthStateChanged resuelva

  // Función interna para obtener/crear usuario en backend y actualizar el store
  _fetchAndSetUser: async (firebaseUser) => {
    if (!firebaseUser) {
      set({ user: null, loading: false });
      return;
    }
    try {
      let userData = await api.getUserByFirebaseUid(firebaseUser.uid);
      if (!userData) {
        // Esto podría ocurrir si el usuario se autenticó pero no está en nuestra DB
        // (ej. creado directamente en Firebase console, o si el registro falló a mitad de camino antes)
        // Para el flujo de registro, nos aseguraremos de que se cree antes de llamar aquí.
        // Opcionalmente, crearlo aquí como un fallback:
        console.warn(`Usuario Firebase ${firebaseUser.uid} no encontrado en backend. Intentando crear...`);
        userData = await api.createUser({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          nombre: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        });
         if (!userData) throw new Error("No se pudo crear el usuario en el backend como fallback.");
      }
      set({ user: { ...userData, firebaseUid: firebaseUser.uid, email: firebaseUser.email }, loading: false });
    } catch (error) {
      console.error('Error en _fetchAndSetUser:', error);
      toast.error('Error al sincronizar datos del usuario.');
      // Decidir si cerrar sesión o mantener un estado de error
      await signOut(auth); // Forzar logout si no podemos obtener/crear datos del backend
      set({ user: null, loading: false });
    }
  },

  initializeAuth: () => {
    // Iniciar loading en true cada vez que se llama, si es necesario,
    // pero onAuthStateChanged se llama una vez y luego mantiene el estado.
    // set({ loading: true }); // Descomentar si se quiere loading en cada re-evaluación
    onAuthStateChanged(auth, async (firebaseUser) => {
      await get()._fetchAndSetUser(firebaseUser);
    });
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged se disparará, pero para asegurar la actualización inmediata
      // y controlar el estado de 'loading' directamente aquí:
      await get()._fetchAndSetUser(userCredential.user); // Llama a la función interna
      toast.success('Sesión iniciada correctamente');
      // No es necesario retornar userCredential.user si el store se actualiza y los componentes reaccionan a él
    } catch (error) {
      set({ loading: false });
      toast.error('Error al iniciar sesión: ' + error.message);
      throw error; // Para que el componente sepa del error
    }
  },

  register: async (email, password, nombre) => {
    set({ loading: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Crear usuario en nuestra base de datos ANTES de llamar a _fetchAndSetUser
      // para asegurar que getUserByFirebaseUid lo encuentre.
      await api.createUser({
        firebase_uid: userCredential.user.uid,
        email,
        nombre,
      });

      // Ahora llamar a _fetchAndSetUser para consolidar y actualizar el store.
      // onAuthStateChanged también se disparará, pero esto da un control más directo.
      await get()._fetchAndSetUser(userCredential.user);
      toast.success('Cuenta creada correctamente');
    } catch (error) {
      set({ loading: false });
      // Considerar si hay que limpiar el usuario de Firebase si la creación en el backend falla.
      // Por ejemplo, userCredential.user.delete() - pero esto tiene implicaciones de seguridad.
      toast.error('Error al crear cuenta: ' + error.message);
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      // onAuthStateChanged se encargará de poner user a null y loading a false.
      // Alternativamente, se puede hacer explícitamente:
      set({ user: null, loading: false });
      toast.success('Sesión cerrada');
    } catch (error) {
      set({ loading: false });
      toast.error('Error al cerrar sesión');
      throw error;
    }
  }
}));