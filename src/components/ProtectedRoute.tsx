import type React from "react"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"

// Interfaces y tipos
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'visualizador' | 'digitalizador';
}

// Funciones de utilidad para roles
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    return JSON.parse(userData);
  }
  // Datos por defecto para testing (podemos cambiarlos)
  return {
    id: '1',
    name: 'ADMIN',
    email: 'admin@catamarca.gov.ar',
    role: 'administrador'
  };
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const hasPermission = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Jerarquía de roles: administrador > visualizador > digitalizador
  const roleHierarchy = {
    'administrador': 3,
    'visualizador': 2,
    'digitalizador': 1
  };
  
  const userRoleLevel = roleHierarchy[user.role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userRoleLevel >= requiredRoleLevel;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Opcional: si no se especifica, solo verifica autenticación
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // Verificar primero si está autenticado
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si se especifica un rol requerido, verificar permisos
  if (requiredRole) {
    if (!hasPermission(requiredRole)) {
      toast.error('No tienes permisos para acceder a esta sección');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>
}

export default ProtectedRoute