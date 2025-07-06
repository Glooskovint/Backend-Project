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
    (set, get) => ({
      availableThemes: themes,
      currentTheme: themes[0], // Azul (Default) como tema inicial
      setTheme: (themeId) => {
        const selectedTheme = themes.find(t => t.id === themeId);
        if (selectedTheme) {
          set({ currentTheme: selectedTheme });
          document.documentElement.className = selectedTheme.class;
        }
      },
      // Esta función se llama para aplicar el tema después de la hidratación.
      _applyThemeToDocument: () => {
        const state = get(); // Obtener el estado actual (ya hidratado)
        if (state.currentTheme && state.currentTheme.class) {
          document.documentElement.className = state.currentTheme.class;
        } else {
          document.documentElement.className = ''; // Tema por defecto
        }
      }
    }),
    {
      name: 'app-theme',
      storage: localStorage,
      partialize: (state) => ({ currentTheme: state.currentTheme }),
      // onRehydrateStorage se llama una vez que el almacenamiento ha sido leído y el estado está listo.
      onRehydrateStorage: () => {
        return (state, error) => {
          if (state) {
            // Llamar a una acción interna para aplicar el tema al documento
            // Esto asegura que se haga con el estado ya hidratado.
            state._applyThemeToDocument();
          }
        }
      }
    }
  )
);

// Ya no es necesario exportar o llamar a loadThemeFromStorage desde App.jsx explícitamente para esto,
// onRehydrateStorage se encargará de aplicar el tema.
