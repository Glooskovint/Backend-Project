import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { 
  Home, 
  Plus, 
  LogIn, 
  LogOut, 
  User, 
  Settings,
  Menu,
  X,
  UserPlus // Icono para "Unirse a Proyecto"
} from 'lucide-react'
import { useState } from 'react'
import JoinProjectModal from '../project/JoinProjectModal' // Importar el modal
import ThemeSwitcher from './ThemeSwitcher' // Importar el ThemeSwitcher

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false) // Estado para el modal

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
    {/* Aplicar colores de fondo y borde semánticos */}
    <nav className="fixed top-0 left-0 right-0 bg-bg-card shadow-sm border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - usa colores primarios, que deberían adaptarse */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Home className="w-6 h-6" />
            {/* Texto del logo podría usar text-text-main o text-primary-600 dependiendo del diseño deseado con temas */}
            <span className="hidden sm:block">Gestión de Proyectos</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/create-project"
                  className="flex items-center space-x-2 btn-primary" // btn-primary ya está en index.css
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Proyecto</span>
                </Link>

                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="flex items-center space-x-2 btn-secondary" // btn-secondary ya está en index.css
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Unirse a Proyecto</span>
                </button>
                
                {/* Texto del usuario y botón de logout podrían usar text-text-main o text-text-secondary */}
                <div className="flex items-center space-x-2 text-text-secondary hover:text-text-main">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.nombre}</span>
                </div>
                
                <ThemeSwitcher /> {/* ThemeSwitcher ya tiene sus propios estilos para adaptarse */}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-text-secondary hover:text-text-main transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                {/* <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </button> */}
                <ThemeSwitcher /> {/* ThemeSwitcher ya tiene sus propios estilos para adaptarse */}
                
                <Link
                  to="/login"
                  className="flex items-center space-x-2 btn-primary" // btn-primary ya está en index.css
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Iniciar Sesión</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - Iconos podrían usar text-text-secondary o text-text-main */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-text-secondary hover:text-text-main transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Fondo y borde deben ser semánticos */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up bg-bg-card">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  {/* Texto del usuario */}
                  <div className="flex items-center space-x-2 text-text-secondary px-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.nombre}</span>
                  </div>
                  
                  <Link
                    to="/create-project"
                    className="flex items-center space-x-2 btn-primary w-full justify-center" // btn-primary
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Crear Proyecto</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsJoinModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 btn-secondary w-full justify-center" // btn-secondary
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm">Unirse a Proyecto</span>
                  </button>
                  
                  <div className="px-2 py-2">
                    <ThemeSwitcher /> {/* ThemeSwitcher se encarga de sus estilos */}
                  </div>
                  
                  {/* Botón de logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-text-secondary hover:text-text-main transition-colors px-2 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                   <div className="px-2 py-2">
                    <ThemeSwitcher /> {/* ThemeSwitcher se encarga de sus estilos */}
                  </div>
                  
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 btn-primary w-full justify-center" // btn-primary
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Iniciar Sesión</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    <JoinProjectModal
      isOpen={isJoinModalOpen}
      onClose={() => setIsJoinModalOpen(false)}
    />
    </>
  )
}