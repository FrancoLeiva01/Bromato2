import type React from "react"
import { Building2, Calendar, FileText } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems = [
    { icon: Calendar, label: "Inicio", path: "/home" },
    { icon: Building2, label: "Documentos", path: "/documentos" },
    { icon: FileText, label: "Pre-Cargados", path: "/precargados" },
  ]

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Building2 className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="font-bold text-lg">Catamarca</h2>
            <p className="text-sm text-slate-300">Capital</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={index}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
