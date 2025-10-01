import React, { useState } from 'react';
import { Users, Edit, Trash2, Plus } from 'lucide-react';

const UsuariosTable = () => {
  // Estados para filtros y paginación
  const [filterType, setFilterType] = useState("Filtros");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos de ejemplo
  const usuarios = [
    { 
      id: 1, 
      nombre: "Juan Pérez", 
      email: "juan.perez@email.com", 
      rol: "Administrador", 
      estado: "Activo",
      fechaRegistro: "2024-01-15"
    },
    { 
      id: 2, 
      nombre: "María García", 
      email: "maria.garcia@email.com", 
      rol: "Visualizador", 
      estado: "Activo",
      fechaRegistro: "2024-02-20"
    },
    { 
      id: 3, 
      nombre: "Carlos López", 
      email: "carlos.lopez@email.com", 
      rol: "Digitalizador", 
      estado: "Inactivo",
      fechaRegistro: "2024-01-10"
    },
    { 
      id: 4, 
      nombre: "Ana Martínez", 
      email: "ana.martinez@email.com", 
      rol: "Administrador", 
      estado: "Activo",
      fechaRegistro: "2024-03-05"
    },
    { 
      id: 5, 
      nombre: "Pedro Rodríguez", 
      email: "pedro.rodriguez@email.com", 
      rol: "Visualizador", 
      estado: "Suspendido",
      fechaRegistro: "2024-02-28"
    },
    { 
      id: 6, 
      nombre: "Pedro Rodríguez", 
      email: "pedro.rodriguez@email.com", 
      rol: "Visualizador", 
      estado: "Suspendido",
      fechaRegistro: "2024-02-28"
    },
    { 
      id: 7, 
      nombre: "Franco Rodríguez", 
      email: "pedro.rodriguez@email.com", 
      rol: "Visualizador", 
      estado: "Suspendido",
      fechaRegistro: "2024-02-28"
    },
    { 
      id: 8, 
      nombre: "Pedro Rodríguez", 
      email: "pedro.rodriguez@email.com", 
      rol: "Visualizador", 
      estado: "Suspendido",
      fechaRegistro: "2024-02-28"
    },
    { 
      id: 9, 
      nombre: "Pedro Rodríguez", 
      email: "pedro.rodriguez@email.com", 
      rol: "Visualizador", 
      estado: "Suspendido",
      fechaRegistro: "2024-02-28"
    },
    { 
      id: 10, 
      nombre: "Pedro Rodríguez", 
      email: "pedro.rodriguez@email.com", 
      rol: "Visualizador", 
      estado: "Suspendido",
      fechaRegistro: "2024-02-28"
    },
    { 
      id: 11, 
      nombre: "Pedro Rodríguez", 
      email: "pedro.rodriguez@email.com", 
      rol: "Visualizador", 
      estado: "Suspendido",
      fechaRegistro: "2024-02-28"
    },
  ];

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter(usuario => {
    if (filterType === "Nombre" && searchTerm) {
      return usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (filterType === "Email" && searchTerm) {
      return usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (filterType === "Estado" && statusFilter) {
      return usuario.estado === statusFilter;
    }
    if (filterType === "Rol" && roleFilter) {
      return usuario.rol === roleFilter;
    }
    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(startIndex, startIndex + itemsPerPage); 

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setSearchTerm("");
    setStatusFilter("");
    setRoleFilter("");
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-slate-700 p-6 rounded-lg">
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 pb-5">
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          </div>
          <select
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="Filtros">Filtros</option>
            <option value="Todos">Todos</option>
            <option value="Nombre">Nombre</option>
            <option value="Email">Email</option>
            <option value="Estado">Estado</option>
            <option value="Rol">Rol</option>
          </select>
          {filterType === "Nombre" && (
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            />
          )}
          {filterType === "Email" && (
            <input
              type="text"
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            />
          )}
          {filterType === "Estado" && (
            <select
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Seleccionar estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Suspendido">Suspendido</option>
            </select>
          )}
          {filterType === "Rol" && (
            <select
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Seleccionar rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Digitalizador">Digitalizador</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          )}
          <button
            className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
            onClick={handleSearch}
          >
            Buscar
          </button>
        </div>
         <button 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-300 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Crear Usuario</span>
        </button>
      </div>

      <div className="bg-slate-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.rol === "Administrador"
                          ? "bg-purple-100 text-purple-800"
                          : usuario.rol === "Digitalizador"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : usuario.estado === "Inactivo"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.fechaRegistro}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                        onClick={() => console.log(`Editar usuario ${usuario.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                        onClick={() => console.log(`Eliminar usuario ${usuario.id}`)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-700 text-white hover:bg-blue-400"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosTable;