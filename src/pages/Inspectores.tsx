"use client";

import type React from "react";
import { useState } from "react";
import { UserCheck, Eye, Plus, X } from "lucide-react";

interface Inspector {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  funcion: string;
  identificador: string;
}

const Inspectores: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de ejemplo
  const inspectores: Inspector[] = [
    {
      id: 1,
      nombre: "Inspector 1",
      apellido: "Apellido 1",
      email: "inspector1@catamarca.gov.ar",
      activo: true,
      funcion: "Sur",
      identificador: "37750108",
    },
    {
      id: 2,
      nombre: "Inspector 2",
      apellido: "Apellido 2",
      email: "inspector2@catamarca.gov.ar",
      activo: false,
      funcion: "Oeste",
      identificador: "46833456",
    },
    ...Array.from({ length: 32 }, (_, i) => ({
      id: i + 3,
      nombre: `Inspector ${i + 3}`,
      apellido: `Apellido ${i + 3}`,
      email: `inspector${i + 3}@catamarca.gov.ar`,
      activo: Math.random() > 0.5,
      funcion: ["Sur", "Norte", "Este", "Oeste", "Centro"][
        Math.floor(Math.random() * 5)
      ],
      identificador: `${Math.floor(Math.random() * 90000000) + 10000000}`,
    })),
  ];

  const filteredInspectores = inspectores.filter((inspector) => {
    if (!filterType || !searchTerm) return true;
    if (filterType === "apellido")
      return inspector.apellido
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    if (filterType === "identificador")
      return inspector.identificador.includes(searchTerm);
    return true;
  });

  const totalPages = Math.ceil(filteredInspectores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInspectores = filteredInspectores.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handleSearch = () => setCurrentPage(1);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInspector(null);
  };

  const handleViewDetails = (inspector: Inspector) => {
    setSelectedInspector(inspector);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-slate-700 p-6 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600 ">
        {/* Titulo */}
        <div className="mb-6">
          <div className="bg-slate-800 rounded-lg p-4 flex justify-center items-center">
            <UserCheck className="w-8 h-8 text-blue-500 mr-2" />
            <h1 className="text-3xl font-bold text-white text-center">
              Inspectores
            </h1>
          </div>
        </div>
        {/* Filtros + boton nuevo inspector */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5 space-y-3 md:space-y-0 justify-between">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <select
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              <option value="">Filtros</option>
              <option value="apellido">Apellido</option>
              <option value="identificador">Identificador</option>
            </select>
            {filterType && (
              <input
                type="text"
                placeholder={`Buscar por ${filterType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-100 rounded-lg px-3 py-1 text-sm"
              />
            )}
            <button
              className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-300 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nuevo Inspector</span>
          </button>
        </div>
        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identificador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInspectores.length > 0 ? (
                  currentInspectores.map((inspector) => (
                    <tr key={inspector.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inspector.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inspector.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inspector.apellido}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {inspector.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            inspector.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inspector.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inspector.funcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inspector.identificador}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          onClick={() => handleViewDetails(inspector)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No se encontraron inspectores que coincidan con los
                      criterios de búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
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

      {isModalOpen && selectedInspector && (
        <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-600 rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
            {/* equis */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Modal */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-white mb-2">
                  Inspector
                </h3>
                <h2 className="text-2xl font-bold text-gray-200">
                  {selectedInspector?.nombre}
                </h2>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-white mb-2">
                  Apellido
                </h3>
                <p className="text-4xl font-bold text-orange-500">
                  {selectedInspector?.apellido}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-white mb-2">Email</h3>
                <p className="text-gray-200">{selectedInspector?.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Inspectores;
