import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Home, Plus, LogIn, LogOut, User, Settings } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="font-semibold text-gray-900">Gestión de Proyectos</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home size={18} />
                <span>Inicio</span>
              </Link>
              
              {user && (
                <Link 
                  to="/create-project" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Plus size={18} />
                  <span>Crear Proyecto</span>
                </Link>
              )}
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Settings size={20} />
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.nombre}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:block">Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 btn-primary"
              >
                <LogIn size={18} />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar