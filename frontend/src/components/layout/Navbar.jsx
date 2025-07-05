import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import {
  Home,
  Plus,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  UserPlus,
  Briefcase,
  FolderClock,
  FolderClosed,
  Folders,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import JoinProjectModal from "../project/JoinProjectModal";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-bg-card shadow-sm border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-semibold text-primary-600 hover:text-primary-500 transition-colors"
            >
              <Folders className="w-6 h-6" />
              <span>Planificador de Proyectos</span>
            </Link>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-md btn-secondary hover:bg-opacity-90 transition-all"
                    aria-label="Unirse a un proyecto"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Unirse</span>
                  </button>

                  <Link
                    to="/create-project"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-md btn-primary hover:bg-opacity-90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Crear</span>
                  </Link>

                  <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>

                  <ThemeSwitcher />

                  <div className="flex items-center space-x-2 text-text-main group">
                    <User className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="text-sm">{user.nombre}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <ThemeSwitcher />
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Menú"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="md:hidden animate-fade-in-down pb-4 pt-2 border-t border-gray-200 dark:border-gray-700 bg-bg-card"
            >
              <div className="flex flex-col space-y-2 px-2">
                {user ? (
                  <>
                    <div className="px-2 py-2 rounded-md flex items-center justify-between w-full text-text-main">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {user.nombre}
                        </span>
                      </div>
                      <ThemeSwitcher />
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700 my-1" />

                    <Link
                      to="/create-project"
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md btn-primary justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Proyecto</span>
                    </Link>

                    <button
                      onClick={() => setIsJoinModalOpen(true)}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md btn-secondary justify-start"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Unirse a Proyecto</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors justify-start"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col space-y-3 px-3 py-4">
                      <div className="flex items-center space-x-2 px-3 py-2 justify-center">
                        <ThemeSwitcher />
                      </div>
                    </div>
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
  );
}
