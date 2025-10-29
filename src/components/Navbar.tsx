import { HelpCircle, User, LogOut, ChevronDown, Menu } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { getCurrentUser, User as UserType } from "../utils/auth"
import { useAuth } from "@/modules/Auth/hook/useAuth"

interface NavbarProps {
  onTutorialClick?: () => void
  onSidebarToggle?: () => void
  isSidebarOpen?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ onTutorialClick, onSidebarToggle, isSidebarOpen }) => {
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
  
  // const handleNotificationsClick = () => {
  //   navigate("/notifications")
  // }

const {logoutMutation} = useAuth()
  
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
    <header className="bg-slate-800 border-b-4 border-orange-500 px-4 py-4 ">
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

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 bg-red-500 hover:bg-red-700 px-2 py-2 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-white flex-shrink-0" />
              <span className={`text-sm text-white font-medium hidden sm:inline ${getRoleColor(currentUser.role)}`}>
                {getRoleDisplayName(currentUser.role)}
              </span>
              <ChevronDown className="w-4 h-4 text-white flex-shrink-0" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 shadow-lg border py-2 z-50 rounded-lg border-b border-slate-600">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-sm font-medium text-red-500">{currentUser.name}</p>
                  <p className="text-xs text-gray-100">{currentUser.email}</p>
                  <p className={`text-xs font-medium mt-1 ${getRoleColor(currentUser.role)}`}>
                    {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </p>
                </div>
                <button
                  onClick={ () => logoutMutation.mutate()}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-500  hover:bg-red-300 transition-colors"
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