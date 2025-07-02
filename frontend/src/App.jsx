import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateProject from './pages/CreateProject'
import ProjectView from './pages/ProjectView'
import JoinProject from './pages/JoinProject'

function App() {
  const { initializeAuth } = useAuthStore()
  const { loadThemeFromStorage, currentTheme } // <-- currentTheme no se necesita aquí si el useEffect de abajo se elimina o ajusta
    = useThemeStore((state) => ({ // Seleccionar solo lo necesario
        loadThemeFromStorage: state.loadThemeFromStorage,
        currentTheme: state.currentTheme // Necesario para el segundo useEffect
      }));

  useEffect(() => {
    initializeAuth()
    loadThemeFromStorage() // Cargar y aplicar la clase del tema al iniciar la app
  }, [initializeAuth, loadThemeFromStorage])

  // Este useEffect asegura que la clase en documentElement se mantenga sincronizada
  // si currentTheme cambia por cualquier motivo (incluso fuera de setTheme, aunque es raro).
  // Con la lógica actual de setTheme y loadThemeFromStorage, esto es una redundancia segura.
  useEffect(() => {
    if (currentTheme && currentTheme.class) { // Verificar que currentTheme exista
      document.documentElement.className = currentTheme.class;
    } else if (currentTheme) { // Si currentTheme existe pero .class es '' (default)
      document.documentElement.className = '';
    }
  }, [currentTheme]);

  return (
    // La clase del tema ya está en document.documentElement.
    // Tailwind usará esto para aplicar los estilos condicionales (theme-bw:, theme-red:, etc.)
    // y las variables CSS definidas en :root o .theme-*.
    // Las clases bg-bg-main y text-text-main aquí usarán las variables CSS del tema actual.
    <div className="min-h-screen bg-bg-main text-text-main">
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