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
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="hidden sm:block">Gestión de Proyectos</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/create-project"
                  className="flex items-center space-x-2 btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Proyecto</span>
                </Link>

                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Unirse a Proyecto</span>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.nombre}</span>
                </div>
                
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                
                <Link
                  to="/login"
                  className="flex items-center space-x-2 btn-primary"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-700 px-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.nombre}</span>
                  </div>
                  
                  <Link
                    to="/create-project"
                    className="flex items-center space-x-2 btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Proyecto</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsJoinModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 btn-secondary w-full justify-center"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Unirse a Proyecto</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors px-2 py-2">
                    <Settings className="w-5 h-5" />
                    <span>Accesibilidad</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors px-2 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors px-2 py-2">
                    <Settings className="w-5 h-5" />
                    <span>Accesibilidad</span>
                  </button>
                  
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
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