import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
// Ya no necesitamos importar useThemeStore aquí para la carga inicial del tema,
// pero aún podría ser necesario para el ThemeSwitcher o si otros componentes lo usan.
// import { useThemeStore } from './stores/themeStore';
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateProject from './pages/CreateProject'
import ProjectView from './pages/ProjectView'
import JoinProject from './pages/JoinProject'

function App() {
  const { initializeAuth } = useAuthStore();
  // const { currentTheme } = useThemeStore((state) => ({ currentTheme: state.currentTheme })); // Ya no es estrictamente necesario para aplicar el tema inicial

  useEffect(() => {
    initializeAuth();
    // La lógica de carga y aplicación del tema ahora es manejada por onRehydrateStorage en themeStore.js
    // por lo que no necesitamos llamar a loadThemeFromStorage() aquí.
  }, [initializeAuth]);

  // Este useEffect podría seguir siendo útil si currentTheme se cambia programáticamente
  // de formas que no pasen por setTheme (lo cual es inusual).
  // Por ahora, lo comentaremos para ver si onRehydrateStorage es suficiente.
  // Si el ThemeSwitcher funciona bien, y la carga inicial también, este useEffect es redundante.
  /*
  useEffect(() => {
    if (currentTheme && currentTheme.class) {
      document.documentElement.className = currentTheme.class;
    } else if (currentTheme) {
      document.documentElement.className = '';
    }
  }, [currentTheme]);
  */

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