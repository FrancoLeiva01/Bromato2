"use client"

import type React from "react"
import { Bell, HelpCircle, User, LogOut, ChevronDown, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useState } from "react"

interface NavbarProps {
  onTutorialClick?: () => void
  onSidebarToggle?: () => void
  isSidebarOpen?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ onTutorialClick, onSidebarToggle, isSidebarOpen }) => {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleTutorialClick = () => {
    if (onTutorialClick) {
      onTutorialClick()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    toast.success("Sesión cerrada correctamente")
    navigate("/login")
  }

  const handleNotificationsClick = () => {
    console.log("[v0] Campanita clickeada, navegando a /notifications")
    navigate("/notifications")
    console.log("[v0] Navigate ejecutado")
  }

  return (
    <header className="bg-gradient-to-r  from-slate-700 to-slate-900 shadow-[4px_0_10px_rgba(0,0,0,0.1)] shadow-gray-500 px-4 py-4">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 text-white hover:bg-slate-600 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-lg lg:text-xl font-semibold text-white truncate">
            <span className="hidden lg:inline">Administración de Bromatología Municipal</span>
            <span className="lg:hidden">Bromatología</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleTutorialClick}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-300 transition-colors"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium hidden md:inline">Tutorial guía rápida</span>
            <span className="text-sm font-medium md:hidden">Tutorial</span>
          </button>

          <button
            onClick={handleNotificationsClick}
            className="p-2 text-white hover:text-gray-900 hover:bg-red-300 rounded-lg transition-colors relative flex-shrink-0"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2 py-2 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900 hidden sm:inline">ADMIN</span>
              <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Administrador</p>
                  <p className="text-xs text-gray-500">admin@catamarca.gov.ar</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
