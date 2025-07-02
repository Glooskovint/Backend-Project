import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themes = [
  { id: 'default', name: 'Azul (Default)', class: '' }, // Clase vacía para el tema por defecto (:root)
  { id: 'bw', name: 'Blanco y Negro', class: 'theme-bw' },
  { id: 'red', name: 'Rojo', class: 'theme-red' },
  { id: 'yellow-pastel', name: 'Amarillo Pastel', class: 'theme-yellow-pastel' },
];

export const useThemeStore = create(
  persist(
    (set, get) => ({ // <--- Añadido 'get' para acceder al estado actual si es necesario
      availableThemes: themes,
      currentTheme: themes[0], // Azul (Default) como tema inicial
      setTheme: (themeId) => {
        const selectedTheme = themes.find(t => t.id === themeId);
        if (selectedTheme) {
          set({ currentTheme: selectedTheme });
          // Aplicar la clase al elemento <html> (document.documentElement)
          document.documentElement.className = selectedTheme.class;
        }
      },
      loadThemeFromStorage: () => {
        // El middleware 'persist' ya se encarga de hidratar el estado 'currentTheme' desde localStorage.
        // Esta función ahora solo necesita asegurar que la clase correcta se aplique a <html> al inicio.
        const state = get(); // Usamos get() para obtener el estado más reciente post-hidratación.
        if (state.currentTheme && state.currentTheme.class) {
          document.documentElement.className = state.currentTheme.class;
        } else {
          // Si es el tema por defecto (clase vacía) o no hay tema, asegurar que no haya clases de tema.
          document.documentElement.className = '';
        }
      }
    }),
    {
      name: 'app-theme',
      storage: localStorage,
      partialize: (state) => ({ currentTheme: state.currentTheme }),
    }
  )
);

// No es necesario llamar a loadThemeFromStorage aquí globalmente.
// Se debe llamar en App.jsx después de que el componente se monte.
