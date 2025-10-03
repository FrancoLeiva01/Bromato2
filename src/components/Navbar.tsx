import { Bell, HelpCircle, User, LogOut, ChevronDown, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { getCurrentUser, User as UserType } from "../utils/auth"

interface NavbarProps {
  onTutorialClick?: () => void
  onSidebarToggle?: () => void
  isSidebarOpen?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ onTutorialClick, onSidebarToggle, isSidebarOpen }) => {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])
  
  const handleTutorialClick = () => {
    if (onTutorialClick) {
      onTutorialClick()
    }
  }
  
  const handleNotificationsClick = () => {
    navigate("/notifications")
  }
  
  const handleLogout = () => {
    console.log('asdds')
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("currentUser")
    // toast.success("Sesión cerrada correctamente")
    navigate("/login")
  }
  
  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'administrador': 'ADMIN',
      'moderador': 'MOD',
      'usuario': 'USER'
    };
    return roleNames[role as keyof typeof roleNames] || 'USER';
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      'administrador': 'text-red-600',
      'moderador': 'text-blue-600',
      'usuario': 'text-gray-600'
    };
    return roleColors[role as keyof typeof roleColors] || 'text-gray-600';
  };

  if (!currentUser) return null;

  return (
    <header className="bg-slate-800 shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600 px-4 py-4">
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
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Tutorial</span>
          </button>

          <button
            onClick={handleNotificationsClick}
            className="p-2 text-white hover:text-gray-900 hover:bg-red-300 rounded-lg transition-colors relative flex-shrink-0"
          >
            <Bell className="w-8 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2 py-2 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-black flex-shrink-0" />
              <span className={`text-sm font-medium hidden sm:inline ${getRoleColor(currentUser.role)}`}>
                {getRoleDisplayName(currentUser.role)}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                  <p className={`text-xs font-medium mt-1 ${getRoleColor(currentUser.role)}`}>
                    {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </p>
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