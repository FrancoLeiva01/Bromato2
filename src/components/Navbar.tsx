import { Bell, HelpCircle, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow">
      {/* Logo y título */}
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold text-gray-800">
          Administración de Bromatología Municipal
        </div>
      </div>

      {/* Acciones del Navbar */}
      <div className="flex items-center gap-6">
        {/* Enlace de ayuda */}
        <a
          href="#"
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <HelpCircle className="w-4 h-4" />
          Tutorial guía rápida
        </a>

        {/* Notificaciones */}
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          {/* Badge rojo de notificación */}
        </button>

        {/* Usuario */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">TEST</span>
          <div className="bg-yellow-400 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </nav>
  );
}
