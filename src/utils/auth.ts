export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'visualizador' | 'digitalizador';
}

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    return JSON.parse(userData);
  }
  // Datos por defecto para testing 
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
  
  // Jerarquía de roles: administrador > moderador > usuario
  const roleHierarchy = {
    'administrador': 3,
    'visualizador': 2,
    'digitalizador': 1
  };
  
  const userRoleLevel = roleHierarchy[user.role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userRoleLevel >= requiredRoleLevel;
};