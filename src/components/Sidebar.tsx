import type React from "react"
import { Building2, Calendar, FileText} from "lucide-react"

const Sidebar: React.FC = () => {
  const menuItems = [
      { icon: Calendar, label: "Inicio", active: true },
    { icon: Building2, label: "Documentos", active: false },
    { icon: FileText, label: "Pre-Cargados", active: false },
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
            return (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
