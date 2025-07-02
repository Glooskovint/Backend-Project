/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Mantenemos el modo oscuro basado en clases si es necesario para otros fines
  theme: {
    extend: {
      colors: {
        // Colores semánticos que usarán variables CSS
        // Los valores HSL permiten ajustar la opacidad si es necesario (ej. bg-primary/50)
        'primary': 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-focus': 'hsl(var(--color-primary-focus) / <alpha-value>)', // Para hover/focus
        'secondary': 'hsl(var(--color-secondary) / <alpha-value>)',
        'accent': 'hsl(var(--color-accent) / <alpha-value>)',
        'text-main': 'hsl(var(--color-text-main) / <alpha-value>)',
        'text-secondary': 'hsl(var(--color-text-secondary) / <alpha-value>)',
        'text-accent': 'hsl(var(--color-text-accent) / <alpha-value>)', // Texto sobre fondos de acento/primarios
        'bg-main': 'hsl(var(--color-bg-main) / <alpha-value>)',
        'bg-card': 'hsl(var(--color-bg-card) / <alpha-value>)',
        'bg-accent': 'hsl(var(--color-bg-accent) / <alpha-value>)', // Fondos con color de acento
        'border-color': 'hsl(var(--color-border) / <alpha-value>)',

        // Los colores específicos del tema anterior como theme_bw, theme_red se gestionan mediante variables CSS en index.css
        // Las variantes originales de 'primary' (azul-50, azul-100, etc.) se pueden definir como variables CSS
        // si se necesitan directamente, o se pueden construir a partir de la base 'primary' con utilidades de opacidad/ligereza si es necesario.
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