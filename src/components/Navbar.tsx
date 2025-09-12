import type React from "react"
import { Bell, HelpCircle, User } from "lucide-react"

const Navbar: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Administración de Bromatología Municipal</h1>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Tutorial guía rápida</span>
          </button>

          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">TEST</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
