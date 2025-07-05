import React from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { Palette, Check } from 'lucide-react'; // Check para indicar tema activo

const ThemeSwitcher = () => {
  const { availableThemes, currentTheme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    setIsOpen(false); // Cerrar después de seleccionar
  };

  // Cerrar dropdown si se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejo de teclado
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        aria-expanded={isOpen}
        aria-label="Cambiar tema"
      >
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="sm:inline text-sm font-medium text-text-main">
          {currentTheme.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {availableThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm ${
                currentTheme.id === theme.id
                  ? 'bg-primary-500 text-white dark:bg-primary-600'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{theme.name}</span>
              {currentTheme.id === theme.id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;