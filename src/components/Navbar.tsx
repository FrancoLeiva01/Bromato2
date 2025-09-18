"use client"

import type React from "react"
import { Bell, HelpCircle, User, LogOut, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useState } from "react"

interface NavbarProps {
  onTutorialClick?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onTutorialClick }) => {
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
    <header className="bg-slate-700 shadow-sm border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Administración de Bromatología Municipal</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleTutorialClick}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-300 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Tutorial guía rápida</span>
          </button>

          <button
            onClick={handleNotificationsClick}
            className="p-2 text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">ADMIN</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
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
