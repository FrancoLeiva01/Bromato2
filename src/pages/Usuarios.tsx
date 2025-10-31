"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent";

const UsuariosTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("Filtros");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const usuarios = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@email.com",
      rol: "Administrador",
      estado: "Activo",
      fechaRegistro: "2024-01-15",
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria.garcia@email.com",
      rol: "Visualizador",
      estado: "Activo",
      fechaRegistro: "2024-02-20",
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos.lopez@email.com",
      rol: "Digitalizador",
      estado: "Inactivo",
      fechaRegistro: "2024-01-10",
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana.martinez@email.com",
      rol: "Administrador",
      estado: "Activo",
      fechaRegistro: "2024-03-05",
    },
    {
      id: 5,
      nombre: "Pedro Rodríguez",
      email: "pedro.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-28",
    },
    {
      id: 6,
      nombre: "Franco Rodríguez",
      email: "franco.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-28",
    },
    {
      id: 7,
      nombre: "Franco Rodríguez",
      email: "franco.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-23",
    },
    {
      id: 8,
      nombre: "Franco Rodríguez",
      email: "franco.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-21",
    },
    {
      id: 9,
      nombre: "Franco Rodríguez",
      email: "franco.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-24",
    },
    {
      id: 10,
      nombre: "Franco Rodríguez",
      email: "franco.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-19",
    },
    {
      id: 11,
      nombre: "Franco Rodríguez",
      email: "franco.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-10",
    },
    {
      id: 12,
      nombre: "Franco Rodríguez",
      email: "franco.rodriguez@email.com",
      rol: "Visualizador",
      estado: "Suspendido",
      fechaRegistro: "2024-02-11",
    },
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
  const currentUsuarios = filteredUsuarios.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setSearchTerm("");
    setStatusFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  const handleSearch = () => setCurrentPage(1);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Usuarios..."
      minHeight="400px"
    >
      <div className="bg-slate-900 p-6 rounded-lg">
        {/* Titulo */}

        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 rounded-lg">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row justify-center items-center text-center sm:text-left gap-4">
                  <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/30">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Usuarios
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-500/50 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Izquierda: Filtros */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
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
                    className="bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                  />
                )}

                {filterType === "Email" && (
                  <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                  />
                )}

                {filterType === "Estado" && (
                  <select
                    className="bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
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
                    className="bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Digitalizador">Digitalizador</option>
                    <option value="Visualizador">Visualizador</option>
                  </select>
                )}
              </div>

              {/* Derecha: Botón */}
              <button className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-400 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg">
                <Plus className="w-5 h-5" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b-2 border-purple-400">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {currentUsuarios.map((usuario, index) => (
                    <tr
                      key={usuario.id}
                      className={`${
                        index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                      } hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {usuario.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {usuario.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
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
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {usuario.fechaRegistro}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-500/30"
                            onClick={() =>
                              console.log(`Editar usuario ${usuario.id}`)
                            }
                            title="Editar inspector"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-500/30"
                            onClick={() =>
                              console.log(`Eliminar usuario ${usuario.id}`)
                            }
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINACION */}

            <div className="bg-slate-800/80 px-6 py-5 flex items-center justify-center space-x-4 border-t border-slate-700/50">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1 || totalPages === 0}
                className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  currentPage === 1 || totalPages === 0
                    ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                    : "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 hover:scale-105 shadow-lg"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="bg-slate-700/50 px-6 py-3 rounded-xl border border-slate-600/50">
                <span className="text-sm font-semibold text-slate-200">
                  Página{" "}
                  <span className="text-white">
                    {totalPages === 0 ? 0 : currentPage}
                  </span>{" "}
                  de <span className="text-white">{totalPages}</span>
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-cyan-500 hover:to-cyan-400 hover:scale-105"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoaderContent>
  );
};

export default UsuariosTable;
