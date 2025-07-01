import React from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { Palette } from 'lucide-react'; // Icono para el botón

const ThemeSwitcher = () => {
  const { availableThemes, currentTheme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    setIsOpen(false); // Cerrar el dropdown después de seleccionar
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Cambiar tema"
      >
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
          {availableThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`w-full text-left px-4 py-2 text-sm ${
                currentTheme.id === theme.id
                  ? 'bg-primary-500 text-white dark:bg-primary-600'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
