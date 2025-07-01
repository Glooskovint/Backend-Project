/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilitar el modo oscuro basado en clases
  theme: {
    extend: {
      colors: {
        // Tema Azul (Default) - Ya definido como 'primary'
        primary: {
          50: '#eff6ff', // azul-50
          100: '#dbeafe', // azul-100
          200: '#bfdbfe', // azul-200
          300: '#93c5fd', // azul-300
          400: '#60a5fa', // azul-400
          500: '#3b82f6', // azul-500 (Primario Principal)
          600: '#2563eb', // azul-600 (Acento)
          700: '#1d4ed8', // azul-700 (Secundario)
          800: '#1e40af', // azul-800
          900: '#1e3a8a', // azul-900
        },
        // Colores base para texto y fondos (pueden ser sobrescritos por temas)
        'text-main': '#1F2937', // gris-800
        'text-secondary': '#4B5563', // gris-600
        'bg-main': '#F9FAFB', // gris-50
        'bg-card': '#FFFFFF', // blanco

        // Tema Blanco y Negro (Alto Contraste)
        theme_bw: {
          primary: '#000000',
          secondary: '#374151', // gris-700
          accent: '#000000',
          'text-main': '#000000',
          'text-secondary': '#374151', // gris-700
          'bg-main': '#FFFFFF',
          'bg-card': '#F3F4F6', // gris-100
          border: '#000000',
        },
        // Tema Rojo
        theme_red: {
          primary: '#EF4444', // rojo-500
          secondary: '#B91C1C', // rojo-700
          accent: '#DC2626', // rojo-600
          'text-main': '#1F2937', // gris-800
          'text-secondary': '#4B5563', // gris-600
          'bg-main': '#FEF2F2', // rojo-50
          'bg-card': '#FFFFFF',
        },
        // Tema Amarillo Pastel
        theme_yellow_pastel: {
          primary: '#FCD34D', // amarillo-300
          secondary: '#FBBF24', // amarillo-400
          accent: '#F59E0B', // amarillo-500
          'text-main': '#374151', // gris-700
          'text-secondary': '#6B7280', // gris-500
          'bg-main': '#FFFBEB', // amarillo-50
          'bg-card': '#FFFFFF',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}