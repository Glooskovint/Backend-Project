import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore' // Importar el store de temas
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateProject from './pages/CreateProject'
import ProjectView from './pages/ProjectView'
import JoinProject from './pages/JoinProject'

function App() {
  const { initializeAuth } = useAuthStore()
  const { loadThemeFromStorage, currentTheme } = useThemeStore() // Obtener la función y el tema actual

  useEffect(() => {
    initializeAuth()
    loadThemeFromStorage() // Cargar y aplicar el tema al iniciar la app
  }, [initializeAuth, loadThemeFromStorage])

  // Efecto para actualizar la clase del body cuando currentTheme cambie (opcional, ya que setTheme lo hace)
  // Pero es bueno para asegurar consistencia si el tema cambia por fuera del setTheme (ej. devtools)
  useEffect(() => {
    if (currentTheme.class) {
      document.documentElement.className = currentTheme.class;
    } else {
      document.documentElement.className = '';
    }
  }, [currentTheme]);

  return (
    // La clase del tema se aplica en document.documentElement,
    // aquí podríamos querer aplicar colores base de texto y fondo que los temas sobrescribirán.
    // Tailwind espera que las clases de tema estén en un elemento padre (como <html> o <body>)
    // para que las utilidades de color como `bg-theme-bg-main` o `text-theme-text-main` funcionen.
    // Si usamos `darkMode: 'class'`, Tailwind buscará `.dark` en `<html>`.
    // Para nuestros temas personalizados, las clases como `theme-red` también se aplican a `<html>`.
    <div className="min-h-screen bg-bg-main text-text-main"> {/* Usar colores semánticos */}
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join/:token" element={<JoinProject />} />
          <Route 
            path="/create-project" 
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:id" 
            element={
              <ProtectedRoute>
                <ProjectView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App