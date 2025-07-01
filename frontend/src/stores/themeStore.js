import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themes = [
  { id: 'default', name: 'Azul (Default)', class: '' },
  { id: 'bw', name: 'Blanco y Negro', class: 'theme-bw' },
  { id: 'red', name: 'Rojo', class: 'theme-red' },
  { id: 'yellow-pastel', name: 'Amarillo Pastel', class: 'theme-yellow-pastel' },
];

export const useThemeStore = create(
  persist(
    (set) => ({
      availableThemes: themes,
      currentTheme: themes[0], // Azul (Default) como tema inicial
      setTheme: (themeId) => {
        const selectedTheme = themes.find(t => t.id === themeId);
        if (selectedTheme) {
          set({ currentTheme: selectedTheme });
          // Aplicar la clase al body o html
          if (selectedTheme.class) {
            document.documentElement.className = selectedTheme.class;
          } else {
            document.documentElement.className = ''; // Clase vacía para el tema por defecto
          }
        }
      },
      // Función para cargar el tema desde localStorage al inicio
      loadThemeFromStorage: () => {
        const storedThemeId = localStorage.getItem('app-theme'); // El nombre 'app-theme' es por la configuración de persist
        if (storedThemeId) {
          // El middleware persist ya se encarga de parsear el JSON, aquí accedemos al estado ya hidratado
          // Esta función es más para la lógica de aplicar la clase al inicio si es necesario
          const state = useThemeStore.getState();
          if (state.currentTheme.class) {
            document.documentElement.className = state.currentTheme.class;
          } else {
            document.documentElement.className = '';
          }
        } else {
          // Si no hay tema guardado, aplicar el default
           document.documentElement.className = themes[0].class;
        }
      }
    }),
    {
      name: 'app-theme', // nombre de la clave en localStorage
      storage: localStorage, // (opcional) por defecto es localStorage
      partialize: (state) => ({ currentTheme: state.currentTheme }), // Solo persistir currentTheme
    }
  )
);

// Cargar el tema al iniciar la aplicación
// Esto se podría llamar en App.jsx o main.jsx
// useThemeStore.getState().loadThemeFromStorage();
