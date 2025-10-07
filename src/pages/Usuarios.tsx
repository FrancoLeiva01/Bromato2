"use client";

import React, { useState, useEffect } from "react";
import { Users, Edit, Trash2 } from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent"

const UsuariosTable: React.FC = () => {
   const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState("Filtros");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])



  const usuarios = [
    { id: 1, nombre: "Juan Pérez", email: "juan.perez@email.com", rol: "Administrador", estado: "Activo", fechaRegistro: "2024-01-15" },
    { id: 2, nombre: "María García", email: "maria.garcia@email.com", rol: "Visualizador", estado: "Activo", fechaRegistro: "2024-02-20" },
    { id: 3, nombre: "Carlos López", email: "carlos.lopez@email.com", rol: "Digitalizador", estado: "Inactivo", fechaRegistro: "2024-01-10" },
    { id: 4, nombre: "Ana Martínez", email: "ana.martinez@email.com", rol: "Administrador", estado: "Activo", fechaRegistro: "2024-03-05" },
    { id: 5, nombre: "Pedro Rodríguez", email: "pedro.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-28" },
    { id: 6, nombre: "Franco Rodríguez", email: "franco.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-28" },
    { id: 7, nombre: "Franco Rodríguez", email: "franco.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-23" },
    { id: 8, nombre: "Franco Rodríguez", email: "franco.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-21" },
    { id: 9, nombre: "Franco Rodríguez", email: "franco.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-24" },
    { id: 10, nombre: "Franco Rodríguez", email: "franco.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-19" },
    { id: 11, nombre: "Franco Rodríguez", email: "franco.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-10" },
    { id: 12, nombre: "Franco Rodríguez", email: "franco.rodriguez@email.com", rol: "Visualizador", estado: "Suspendido", fechaRegistro: "2024-02-11" },
  ];

  const filteredUsuarios = usuarios.filter((usuario) => {
    const value = searchTerm.toLowerCase();
    switch (filterType) {
      case "Nombre":
        return usuario.nombre.toLowerCase().includes(value);
      case "Email":
        return usuario.email.toLowerCase().includes(value);
      case "Estado":
        return statusFilter ? usuario.estado === statusFilter : true;
      case "Rol":
        return roleFilter ? usuario.rol === roleFilter : true;
      case "Todos":
        return (
          usuario.nombre.toLowerCase().includes(value) ||
          usuario.email.toLowerCase().includes(value) ||
          usuario.rol.toLowerCase().includes(value) ||
          usuario.estado.toLowerCase().includes(value)
        );
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setSearchTerm("");
    setStatusFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  const handleSearch = () => setCurrentPage(1);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
     <LoaderContent isLoading={isLoading} loadingText="Cargando Usuarios..." minHeight="400px">

    <div className="bg-slate-700 p-6 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600 ">
      
     {/* Titulo */}
      <div className="mb-6">
        <div className="bg-slate-800 rounded-lg p-4 flex justify-center items-center">
          <Users className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-white text-center">Usuarios</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-2 md:space-y-0 mb-5">
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
          className="bg-blue-700 text-white px-4 py-1 rounded-lg hover:bg-blue-400 transition-colors"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{usuario.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{usuario.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{usuario.email}</td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-sm text-gray-900">{usuario.fechaRegistro}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" onClick={() => console.log(`Editar usuario ${usuario.id}`)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" onClick={() => console.log(`Eliminar usuario ${usuario.id}`)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-sm font-medium text-white">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-700 text-white hover:bg-blue-400"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

     </LoaderContent>
  );
};

export default UsuariosTable;
